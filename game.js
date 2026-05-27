const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- LE LABYRINTHE AGRANDI ET OPTIMISÉ ---
// 0 = Pac-gomme, 1 = Mur, 2 = Vide, 3 = Super-Gomme
const tileSize = 20;
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,2,1,0,1,2,2,2], // Tunnel haut
    [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
    [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2], // Tunnel central
    [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,2,1,0,1,2,2,2], // Tunnel bas
    [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,3,0,1,0,0,0,0,0,2,2,0,0,0,0,0,1,0,3,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// --- LES PERSONNAGES ---
let pacman = { x: 30, y: 30, size: 8, speed: 2, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouthOpen: 0, mouthDir: 1 };
let ghost = { x: 190, y: 150, size: 8, speed: 1.5, dx: 2, dy: 0, color: 'red', isScared: false, scaredTimer: 0 };
let score = 0;

// --- CONTRÔLES ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'q') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
});

// --- COLLISION ---
function canMove(x, y) {
    const margin = 2; 
    const left = Math.floor((x - pacman.size + margin) / tileSize);
    const right = Math.floor((x + pacman.size - margin) / tileSize);
    const top = Math.floor((y - pacman.size + margin) / tileSize);
    const bottom = Math.floor((y + pacman.size - margin) / tileSize);

    if (x < 0 || x > canvas.width) return true; // Autoriser le tunnel
    if (!map[top] || map[top][left] === 1 || map[top][right] === 1 || !map[bottom] || map[bottom][left] === 1 || map[bottom][right] === 1) {
        return false;
    }
    return true;
}

// --- INTELLIGENCE DU FANTÔME ---
function getGhostMove() {
    let possibleMoves = [
        {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}
    ];
    
    // Empêcher le fantôme de faire demi-tour instantanément
    possibleMoves = possibleMoves.filter(m => !(m.dx === -ghost.dx && m.dy === -ghost.dy));
    
    // Garder seulement les mouvements possibles sans foncer dans un mur
    let validMoves = possibleMoves.filter(m => canMove(ghost.x + m.dx * 5, ghost.y + m.dy * 5));
    
    // Si bloqué, autoriser le demi-tour
    if (validMoves.length === 0) validMoves = [{dx: -ghost.dx, dy: -ghost.dy}];

    let bestMove = validMoves[0];
    let bestDistance = ghost.isScared ? -1 : Infinity; // Si apeuré, chercher la plus grande distance

    // Choisir le mouvement qui rapproche (ou éloigne) le plus de Pac-Man
    validMoves.forEach(move => {
        let testX = ghost.x + (move.dx * tileSize);
        let testY = ghost.y + (move.dy * tileSize);
        // Calcul de la distance "à vol d'oiseau" (Pythagore)
        let distance = Math.sqrt(Math.pow(testX - pacman.x, 2) + Math.pow(testY - pacman.y, 2));
        
        if (ghost.isScared) {
            if (distance > bestDistance) { bestDistance = distance; bestMove = move; }
        } else {
            if (distance < bestDistance) { bestDistance = distance; bestMove = move; }
        }
    });

    return bestMove;
}

// --- BOUCLE PRINCIPALE ---
function update() {
    // 1. Déplacement Pac-Man
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMove(pacman.x + pacman.nextDx * pacman.speed, pacman.y + pacman.nextDy * pacman.speed)) {
            pacman.dx = pacman.nextDx; pacman.dy = pacman.nextDy;
            pacman.nextDx = 0; pacman.nextDy = 0;
        }
    }
    if (canMove(pacman.x + pacman.dx * pacman.speed, pacman.y + pacman.dy * pacman.speed)) {
        pacman.x += pacman.dx * pacman.speed; pacman.y += pacman.dy * pacman.speed;
    }

    // Tunnels (gauche/droite)
    if (pacman.x < -10) pacman.x = canvas.width + 10;
    if (pacman.x > canvas.width + 10) pacman.x = -10;

    // 2. Manger les objets
    let gridX = Math.floor(pacman.x / tileSize);
    let gridY = Math.floor(pacman.y / tileSize);
    if (map[gridY] && map[gridY][gridX] === 0) {
        map[gridY][gridX] = 2; score += 10;
    } else if (map[gridY] && map[gridY][gridX] === 3) {
        map[gridY][gridX] = 2; score += 50;
        ghost.isScared = true; // Le fantôme a peur !
        ghost.scaredTimer = 500; // Durée de la peur
    }

    // 3. IA et Déplacement du Fantôme
    // Ne changer de direction qu'au centre d'une case pour la fluidité
    if (ghost.x % tileSize === 10 && ghost.y % tileSize === 10) {
        let newMove = getGhostMove();
        ghost.dx = newMove.dx; ghost.dy = newMove.dy;
    }
    
    // Le fantôme apeuré va un peu plus lentement
    let currentGhostSpeed = ghost.isScared ? ghost.speed * 0.7 : ghost.speed;
    ghost.x += ghost.dx * currentGhostSpeed;
    ghost.y += ghost.dy * currentGhostSpeed;

    // Gérer le chrono de la peur
    if (ghost.isScared) {
        ghost.scaredTimer--;
        if (ghost.scaredTimer <= 0) ghost.isScared = false;
    }

    // 4. Manger ou être mangé (Collisions avec le fantôme)
    let distToGhost = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
    if (distToGhost < 15) {
        if (ghost.isScared) {
            score += 200;
            ghost.x = 190; ghost.y = 150; // Le fantôme retourne au centre
            ghost.isScared = false;
        } else {
            alert("Game Over! Score: " + score);
            document.location.reload(); // Recharger la page
        }
    }

    // --- DESSIN ---
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = '#1919A6'; // Bleu plus sympa pour les murs
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath(); ctx.arc(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 3, 0, Math.PI * 2); ctx.fill();
            } else if (map[row][col] === 3) {
                ctx.fillStyle = 'white'; // Super-Gomme blanche
                ctx.beginPath(); ctx.arc(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 6, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    ctx.fillStyle = 'white'; ctx.font = '16px Arial';
    ctx.fillText("SCORE: " + score, 10, 15);

    // Dessin Pac-Man
    ctx.save(); ctx.translate(pacman.x, pacman.y);
    if (pacman.dx === 1) ctx.rotate(0);
    else if (pacman.dx === -1) ctx.rotate(Math.PI);
    else if (pacman.dy === 1) ctx.rotate(Math.PI / 2);
    else if (pacman.dy === -1) ctx.rotate(-Math.PI / 2);

    pacman.mouthOpen += 0.05 * pacman.mouthDir;
    if (pacman.mouthOpen >= 0.3 || pacman.mouthOpen <= 0) pacman.mouthDir *= -1;
    ctx.fillStyle = 'yellow'; ctx.beginPath();
    ctx.arc(0, 0, pacman.size, pacman.mouthOpen * Math.PI, (2 - pacman.mouthOpen) * Math.PI);
    ctx.lineTo(0, 0); ctx.fill(); ctx.restore();

    // Dessin Fantôme
    ctx.fillStyle = ghost.isScared ? 'blue' : ghost.color; // Il devient bleu s'il a peur
    ctx.beginPath(); ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size); ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(ghost.x - 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ghost.x + 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(update);
}

update();
