const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

// --- LES 3 LABYRINTHES (0=Gomme, 1=Mur, 2=Vide, 3=Super-Gomme) ---
// Note : La toute dernière ligne (ligne 19) est laissée vide (2) pour afficher les vies !
const maps = [
    // NIVEAU 1 : Le Classique
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,3,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
        [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
        [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
        [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2], // Tunnel
        [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
        [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
        [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,3,0,1,0,0,0,0,0,2,2,0,0,0,0,0,1,0,3,1],
        [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
        [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]  // Zone des vies
    ],
    // NIVEAU 2 : Les Salles Jumelles (Plus serré)
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,3,1],
        [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
        [1,0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
        [1,2,2,2,1,0,1,1,2,2,2,2,1,1,0,1,2,2,2,1],
        [1,2,2,2,1,0,1,1,2,2,2,2,1,1,0,1,2,2,2,1],
        [1,1,1,1,1,0,2,2,2,1,1,2,2,2,0,1,1,1,1,1],
        [2,2,2,2,0,0,1,1,2,2,2,2,1,1,0,0,2,2,2,2], // Tunnel
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,1,1,1,0,2,2,0,1,1,1,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    // NIVEAU 3 : Le Grand Piège (Fantôme très rapide !)
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,1],
        [1,0,0,1,0,1,1,1,1,0,0,1,1,1,1,0,1,0,0,1],
        [1,1,0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,1,1],
        [1,1,0,1,0,1,2,2,1,1,1,1,2,2,1,0,1,0,1,1],
        [1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1],
        [1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1],
        [1,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,1],
        [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
        [2,2,2,2,0,2,2,1,1,2,2,1,1,2,2,0,2,2,2,2], // Tunnel
        [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
        [1,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
        [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,1,1,2,2,1,1,0,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ]
];

// --- VARIABLES DE JEU ---
let currentLevel = 0;
let lives = 3;
let score = 0;
// Copie profonde du niveau actuel pour pouvoir le modifier en jouant
let map = JSON.parse(JSON.stringify(maps[currentLevel]));

let pacman = { x: 30, y: 30, size: 8, speed: 2, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouthOpen: 0, mouthDir: 1 };
let ghost = { x: 190, y: 150, size: 8, speed: 2, dx: 2, dy: 0, color: 'red', isScared: false, scaredTimer: 0 };

// --- LES CONTROLES ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'q') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
});

// --- COLLISION GENERIQUE ---
function canMove(x, y, size) {
    const margin = 2; 
    const left = Math.floor((x - size + margin) / tileSize);
    const right = Math.floor((x + size - margin) / tileSize);
    const top = Math.floor((y - size + margin) / tileSize);
    const bottom = Math.floor((y + size - margin) / tileSize);

    if (x < 0 || x > canvas.width) return true; // Passage tunnel autorisé
    if (!map[top] || map[top][left] === 1 || map[top][right] === 1 || !map[bottom] || map[bottom][left] === 1 || map[bottom][right] === 1) {
        return false;
    }
    return true;
}

// --- REINITIALISER APRES UNE MORT ---
function resetPositions() {
    pacman.x = 30; pacman.y = 30; pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    ghost.x = 190; ghost.y = 150; ghost.dx = 2; ghost.dy = 0; ghost.isScared = false; ghost.scaredTimer = 0;
}

// --- CHANGER DE NIVEAU ---
function checkLevelComplete() {
    // Vérifier s'il reste des gommes (0) ou super gommes (3)
    let dotsLeft = false;
    for (let row = 0; row < map.length; row++) {
        if (map[row].includes(0) || map[row].includes(3)) {
            dotsLeft = true;
            break;
        }
    }

    if (!dotsLeft) {
        currentLevel++;
        if (currentLevel >= maps.length) {
            alert("🎉 FÉLICITATIONS ! Tu as triomphé des 3 niveaux !");
            // Recommencer le jeu complet
            currentLevel = 0;
            lives = 3;
            score = 0;
        } else {
            alert("Niveau terminé ! Passage au niveau " + (currentLevel + 1));
        }
        // Charger la nouvelle carte
        map = JSON.parse(JSON.stringify(maps[currentLevel]));
        
        // Augmenter la vitesse du fantôme au niveau 3 pour pimenter le jeu !
        if (currentLevel === 2) {
            ghost.speed = 4; 
        } else {
            ghost.speed = 2;
        }
        
        resetPositions();
    }
}

// --- IA DU FANTÔME (TRAQUEUR INTÉLLIGENT) ---
function getGhostMove() {
    let possibleMoves = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
    
    // Interdire le demi-tour immédiat pour éviter qu'il tremble
    possibleMoves = possibleMoves.filter(m => !(m.dx === -ghost.dx && m.dy === -ghost.dy));
    
    // Garder uniquement les mouvements sans murs
    let validMoves = possibleMoves.filter(m => canMove(ghost.x + m.dx * ghost.speed, ghost.y + m.dy * ghost.speed, ghost.size));
    
    if (validMoves.length === 0) return {dx: -ghost.dx, dy: -ghost.dy}; // Si coincé, fait demi-tour

    let bestMove = validMoves[0];
    let bestDistance = ghost.isScared ? -1 : Infinity;

    // Calculer quel mouvement rapproche (ou éloigne si effrayé) le plus de Pac-Man
    validMoves.forEach(move => {
        let testX = ghost.x + (move.dx * tileSize);
        let testY = ghost.y + (move.dy * tileSize);
        let distance = Math.sqrt(Math.pow(testX - pacman.x, 2) + Math.pow(testY - pacman.y, 2));
        
        if (ghost.isScared) {
            if (distance > bestDistance) { bestDistance = distance; bestMove = move; }
        } else {
            if (distance < bestDistance) { bestDistance = distance; bestMove = move; }
        }
    });
    return bestMove;
}

// --- BOUCLE DE JEU ---
function update() {
    // 1. Déplacement Pac-Man avec anticipation
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMove(pacman.x + pacman.nextDx * pacman.speed, pacman.y + pacman.nextDy * pacman.speed, pacman.size)) {
            pacman.dx = pacman.nextDx; pacman.dy = pacman.nextDy;
            pacman.nextDx = 0; pacman.nextDy = 0;
        }
    }
    if (canMove(pacman.x + pacman.dx * pacman.speed, pacman.y + pacman.dy * pacman.speed, pacman.size)) {
        pacman.x += pacman.dx * pacman.speed; pacman.y += pacman.dy * pacman.speed;
    }

    // Tunnel téléportation
    if (pacman.x < -10) pacman.x = canvas.width + 10;
    if (pacman.x > canvas.width + 10) pacman.x = -10;

    // 2. Manger les points
    let gridX = Math.floor(pacman.x / tileSize);
    let gridY = Math.floor(pacman.y / tileSize);
    if (map[gridY] && map[gridY][gridX] === 0) {
        map[gridY][gridX] = 2; score += 10;
        checkLevelComplete();
    } else if (map[gridY] && map[gridY][gridX] === 3) {
        map[gridY][gridX] = 2; score += 50;
        ghost.isScared = true;
        ghost.scaredTimer = 400; // Durée de vulnérabilité du fantôme
        checkLevelComplete();
    }

    // 3. Déplacement de l'IA du Fantôme (uniquement quand parfaitement aligné sur la grille)
    if ((ghost.x - 10) % tileSize === 0 && (ghost.y - 10) % tileSize === 0) {
        let newMove = getGhostMove();
        ghost.dx = newMove.dx; ghost.dy = newMove.dy;
    }
    let currentGhostSpeed = ghost.isScared ? ghost.speed * 0.5 : ghost.speed;
    ghost.x += ghost.dx * currentGhostSpeed;
    ghost.y += ghost.dy * currentGhostSpeed;

    if (ghost.isScared) {
        ghost.scaredTimer--;
        if (ghost.scaredTimer <= 0) ghost.isScared = false;
    }

    // 4. Gestion des contacts / Système de vies
    let distToGhost = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
    if (distToGhost < 14) {
        if (ghost.isScared) {
            score += 200;
            ghost.x = 190; ghost.y = 150;
            ghost.isScared = false;
        } else {
            lives--;
            if (lives <= 0) {
                alert("❌ GAME OVER ! Score final : " + score);
                currentLevel = 0; lives = 3; score = 0;
                map = JSON.parse(JSON.stringify(maps[currentLevel]));
                ghost.speed = 2;
            } else {
                alert("Ouch ! Vie perdue. Il te reste " + lives + " vies.");
            }
            resetPositions();
        }
    }

    // --- EN COULISSE : LE DESSIN ---
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessin de la Map
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = '#1919A6';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath(); ctx.arc(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 3, 0, Math.PI * 2); ctx.fill();
            } else if (map[row][col] === 3) {
                ctx.fillStyle = 'white';
                ctx.beginPath(); ctx.arc(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 6, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    // Texte Score & Niveau
    ctx.fillStyle = 'white'; ctx.font = 'bold 14px Arial';
    ctx.fillText("SCORE: " + score, 10, 16);
    ctx.fillText("NIVEAU: " + (currentLevel + 1), 310, 16);

    // Dessin des 3 Vies en bas à gauche
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(20 + i * 22, canvas.height - 10, 7, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(20 + i * 22, canvas.height - 10);
        ctx.fill();
    }

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
    ctx.fillStyle = ghost.isScared ? '#1919FF' : ghost.color; // Bleu s'il a peur
    ctx.beginPath(); ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size); ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size); ctx.fill();
    ctx.fillStyle = ghost.isScared ? 'orange' : 'white'; // Yeux oranges s'il a peur
    ctx.beginPath(); ctx.arc(ghost.x - 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ghost.x + 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(update);
}

update();
