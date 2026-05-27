const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- LE LABYRINTHE ---
// 0 = Pac-gomme, 1 = Mur bleu, 2 = Espace vide
const tileSize = 20; // Chaque case fait 20x20 pixels (20*20 cases = 400px)
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
    [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
    [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
    [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2], // Le tunnel central
    [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
    [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,2,2,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// --- LES PERSONNAGES ---
let pacman = {
    x: 30, y: 30, size: 8, speed: 2,
    dx: 0, dy: 0, nextDx: 0, nextDy: 0,
    mouthOpen: 0, mouthDir: 1
};

let ghost = {
    x: 190, y: 150, size: 8, speed: 2,
    dx: 2, dy: 0, color: 'red'
};

let score = 0;

// --- GESTION DES CLAVIERS ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'q') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
});

// --- VERIFICATION DES COLLISIONS AVEC LES MURS ---
function canMove(x, y) {
    const margin = 2; // Tolérance pour passer dans les couloirs
    const left = Math.floor((x - pacman.size + margin) / tileSize);
    const right = Math.floor((x + pacman.size - margin) / tileSize);
    const top = Math.floor((y - pacman.size + margin) / tileSize);
    const bottom = Math.floor((y + pacman.size - margin) / tileSize);

    // Tunnel gauche/droite
    if (x < 0 || x > canvas.width) return true;

    // Bloquer si on touche un mur (1)
    if (!map[top] || map[top][left] === 1 || map[top][right] === 1 || 
        !map[bottom] || map[bottom][left] === 1 || map[bottom][right] === 1) {
        return false;
    }
    return true;
}

// --- BOUCLE PRINCIPALE ---
function update() {
    // 1. Déplacement de Pac-Man avec système d'anticipation pour tourner facilement
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMove(pacman.x + pacman.nextDx * pacman.speed, pacman.y + pacman.nextDy * pacman.speed)) {
            pacman.dx = pacman.nextDx;
            pacman.dy = pacman.nextDy;
            pacman.nextDx = 0;
            pacman.nextDy = 0;
        }
    }
    if (canMove(pacman.x + pacman.dx * pacman.speed, pacman.y + pacman.dy * pacman.speed)) {
        pacman.x += pacman.dx * pacman.speed;
        pacman.y += pacman.dy * pacman.speed;
    }

    // Effet Tunnel de téléportation
    if (pacman.x < -10) pacman.x = canvas.width + 10;
    if (pacman.x > canvas.width + 10) pacman.x = -10;

    // 2. Manger les pac-gommes
    let gridX = Math.floor(pacman.x / tileSize);
    let gridY = Math.floor(pacman.y / tileSize);
    if (map[gridY] && map[gridY][gridX] === 0) {
        map[gridY][gridX] = 2; // Devient une case vide
        score += 10;
    }

    // 3. IA Basique du Fantôme (rebondit aléatoirement aux intersections)
    if (!canMove(ghost.x + ghost.dx * ghost.speed, ghost.y + ghost.dy * ghost.speed)) {
        let possibleMoves = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
        let validMoves = possibleMoves.filter(m => canMove(ghost.x + m.dx * ghost.speed, ghost.y + m.dy * ghost.speed));
        let move = validMoves[Math.floor(Math.random() * validMoves.length)];
        if (move) { ghost.dx = move.dx; ghost.dy = move.dy; }
    }
    ghost.x += ghost.dx * ghost.speed;
    ghost.y += ghost.dy * ghost.speed;

    // --- DESSIN ---
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner la Map (Murs et Gommes)
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = '#ffb8ae'; // Couleur pac-gomme
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize/2, row * tileSize + tileSize/2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Dessiner le Score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText("SCORE: " + score, 10, 15);

    // Dessiner Pac-Man
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    if (pacman.dx === 1) ctx.rotate(0);
    else if (pacman.dx === -1) ctx.rotate(Math.PI);
    else if (pacman.dy === 1) ctx.rotate(Math.PI / 2);
    else if (pacman.dy === -1) ctx.rotate(-Math.PI / 2);

    pacman.mouthOpen += 0.05 * pacman.mouthDir;
    if (pacman.mouthOpen >= 0.3 || pacman.mouthOpen <= 0) pacman.mouthDir *= -1;

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(0, 0, pacman.size, pacman.mouthOpen * Math.PI, (2 - pacman.mouthOpen) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    // Dessiner le Fantôme
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size);
    ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size);
    ctx.fill();
    // Yeux du fantôme
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(ghost.x - 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ghost.x + 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(update);
}

// Lancer le jeu !
update();
