const canvas = document.getElementById('gameCanvas');
// Grille exacte : 25 colonnes x 30 lignes (Tuiles de 20px)
canvas.width = 500;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const tileSize = 20;

// --- LEGENDE DES MAPS ---
// 1 = Mur (Bleu)
// 0 = Petite Gomme (Rose)
// 2 = Espace Vide / Zone de spawn / Tunnel
// 3 = Super Gomme blanche (Rend le fantôme vulnérable)

const map1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,3,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,2,1,1,1,0,0,0,0,0,0,0,0,1], // Porte de la cage au milieu (2)
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2], // Tunnel Gauche et Droite (2)
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2], 
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,3,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]  // Ligne HUD pour l'affichage des vies
];

const map2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,2,1,1,1,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const map3 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,0,1,1,1,2,1,1,1,0,0,1,0,1,0,1,0,1],
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [2,0,1,0,1,0,1,0,0,1,2,2,2,2,2,1,0,0,1,0,1,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,2],
    [1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const maps = [map1, map2, map3];

// --- VARIABLES DE JEU ---
let currentLevel = 0;
let lives = 3;
let score = 0;
let map = JSON.parse(JSON.stringify(maps[currentLevel]));

// Positions d'apparition adaptées (Spawn de Pac-Man en haut à gauche et Fantôme au centre de la cage)
let pacman = { x: 30, y: 30, size: 8, speed: 2, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouthOpen: 0, mouthDir: 1 };
let ghost = { x: 250, y: 290, size: 8, speed: 2, dx: 2, dy: 0, color: 'red', isScared: false, scaredTimer: 0 };

// --- INTEGRATION BOUTONS MOBILES (EVITE LE DOUBLE-BOUTON) ---
if (!document.getElementById('mobile-controls')) {
    const touchContainer = document.createElement('div');
    touchContainer.id = 'mobile-controls';
    touchContainer.style.display = 'flex';
    touchContainer.style.flexDirection = 'column';
    touchContainer.style.alignItems = 'center';
    touchContainer.style.marginTop = '15px';
    touchContainer.innerHTML = `
        <button id="btn-up" style="width:75px; height:55px; margin:4px; font-weight:bold; font-size:22px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▲</button>
        <div style="display:flex;">
            <button id="btn-left" style="width:75px; height:55px; margin:4px; font-weight:bold; font-size:22px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">◀</button>
            <button id="btn-down" style="width:75px; height:55px; margin:4px; font-weight:bold; font-size:22px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▼</button>
            <button id="btn-right" style="width:75px; height:55px; margin:4px; font-weight:bold; font-size:22px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▶</button>
        </div>
    `;
    canvas.parentNode.insertBefore(touchContainer, canvas.nextSibling);

    const setDir = (dx, dy) => { pacman.nextDx = dx; pacman.nextDy = dy; };
    
    document.getElementById('btn-up').addEventListener('touchstart', (e) => { e.preventDefault(); setDir(0, -1); });
    document.getElementById('btn-down').addEventListener('touchstart', (e) => { e.preventDefault(); setDir(0, 1); });
    document.getElementById('btn-left').addEventListener('touchstart', (e) => { e.preventDefault(); setDir(-1, 0); });
    document.getElementById('btn-right').addEventListener('touchstart', (e) => { e.preventDefault(); setDir(1, 0); });
    
    document.getElementById('btn-up').addEventListener('click', () => setDir(0, -1));
    document.getElementById('btn-down').addEventListener('click', () => setDir(0, 1));
    document.getElementById('btn-left').addEventListener('click', () => setDir(-1, 0));
    document.getElementById('btn-right').addEventListener('click', () => setDir(1, 0));
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'q') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
});

// --- ENGINE & VERIFICATIONS ETANCHEITE DU TUNNEL ---
function canMove(x, y, size) {
    const margin = 2; 
    const left = Math.floor((x - size + margin) / tileSize);
    const right = Math.floor((x + size - margin) / tileSize);
    const top = Math.floor((y - size + margin) / tileSize);
    const bottom = Math.floor((y + size - margin) / tileSize);

    // Sécurisation stricte des sorties latérales : Uniquement tolérées sur les lignes du tunnel central (13 à 15)
    if (x < 0 || x > canvas.width) {
        const gridY = Math.floor(y / tileSize);
        if (gridY >= 13 && gridY <= 15) return true; 
        return false; 
    }

    if (!map[top] || map[top][left] === 1 || map[top][right] === 1 || 
        !map[bottom] || map[bottom][left] === 1 || map[bottom][right] === 1) {
        return false;
    }
    return true;
}

function resetPositions() {
    pacman.x = 30; pacman.y = 30; pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    ghost.x = 250; ghost.y = 290; ghost.dx = 2; ghost.dy = 0; ghost.isScared = false; ghost.scaredTimer = 0;
}

function checkLevelComplete() {
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
            alert("🏆 MAGNIFIQUE ! TU AS SURVÉCU À TOUTES LES MAPS ! Recommençons.");
            currentLevel = 0; score = 0;
        } else {
            alert(`Niveau ${currentLevel + 1} ! Vos Vies se régénèrent à 100% ! ❤️`);
        }
        lives = 3; // Récupère toute sa vie
        map = JSON.parse(JSON.stringify(maps[currentLevel]));
        ghost.speed = 2 + (currentLevel * 0.4); // Léger boost de vitesse par niveau
        resetPositions();
    }
}

function getGhostMove() {
    let possibleMoves = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
    possibleMoves = possibleMoves.filter(m => !(m.dx === -ghost.dx && m.dy === -ghost.dy));
    let validMoves = possibleMoves.filter(m => canMove(ghost.x + m.dx * tileSize, ghost.y + m.dy * tileSize, ghost.size));
    
    if (validMoves.length === 0) return {dx: -ghost.dx, dy: -ghost.dy};

    let bestMove = validMoves[0];
    let bestDistance = ghost.isScared ? -1 : Infinity;

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

function update() {
    // Déplacement fluide de Pac-Man
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMove(pacman.x + pacman.nextDx * pacman.speed, pacman.y + pacman.nextDy * pacman.speed, pacman.size)) {
            pacman.dx = pacman.nextDx; pacman.dy = pacman.nextDy;
            pacman.nextDx = 0; pacman.nextDy = 0;
        }
    }
    if (canMove(pacman.x + pacman.dx * pacman.speed, pacman.y + pacman.dy * pacman.speed, pacman.size)) {
        pacman.x += pacman.dx * pacman.speed; pacman.y += pacman.dy * pacman.speed;
    }

    // Gestion du Wrap-around des Tunnels
    if (pacman.x < -5) pacman.x = canvas.width + 5;
    if (pacman.x > canvas.width + 5) pacman.x = -5;

    // Détection des gommes mangées
    let gridX = Math.floor(pacman.x / tileSize);
    let gridY = Math.floor(pacman.y / tileSize);
    if (map[gridY] && map[gridY][gridX] === 0) {
        map[gridY][gridX] = 2; score += 10;
        checkLevelComplete();
    } else if (map[gridY] && map[gridY][gridX] === 3) {
        map[gridY][gridX] = 2; score += 50;
        ghost.isScared = true; ghost.scaredTimer = 350;
        checkLevelComplete();
    }

    // Déplacement fluide du Fantôme
    let currentGhostSpeed = ghost.isScared ? ghost.speed * 0.5 : ghost.speed;

    if (Math.abs((ghost.x - 10) % tileSize) < currentGhostSpeed && Math.abs((ghost.y - 10) % tileSize) < currentGhostSpeed) {
        ghost.x = Math.round((ghost.x - 10) / tileSize) * tileSize + 10;
        ghost.y = Math.round((ghost.y - 10) / tileSize) * tileSize + 10;
        
        let newMove = getGhostMove();
        ghost.dx = newMove.dx; ghost.dy = newMove.dy;
    }

    if (canMove(ghost.x + ghost.dx * currentGhostSpeed, ghost.y + ghost.dy * currentGhostSpeed, ghost.size)) {
        ghost.x += ghost.dx * currentGhostSpeed; ghost.y += ghost.dy * currentGhostSpeed;
    }

    if (ghost.x < -5) ghost.x = canvas.width + 5;
    if (ghost.x > canvas.width + 5) ghost.x = -5;

    if (ghost.isScared) {
        ghost.scaredTimer--;
        if (ghost.scaredTimer <= 0) ghost.isScared = false;
    }

    // Collisions avec le fantôme
    let distToGhost = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
    if (distToGhost < 14) {
        if (ghost.isScared) {
            score += 200; resetPositions();
        } else {
            lives--;
            if (lives <= 0) {
                alert("❌ GAME OVER... Score final : " + score);
                currentLevel = 0; lives = 3; score = 0;
                map = JSON.parse(JSON.stringify(maps[currentLevel]));
                ghost.speed = 2;
            } else {
                alert("Ouch ! Vies restantes : " + lives);
            }
            resetPositions();
        }
    }

    // --- LOGIQUE DE DESSIN ---
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = '#1919A6'; ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = '#ffb8ae'; ctx.beginPath(); ctx.arc(col * tileSize + 10, row * tileSize + 10, 2.5, 0, Math.PI * 2); ctx.fill();
            } else if (map[row][col] === 3) {
                ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(col * tileSize + 10, row * tileSize + 10, 5.5, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    // Affichage des scores
    ctx.fillStyle = 'white'; ctx.font = 'bold 14px Arial';
    ctx.fillText("SCORE: " + score, 15, 22);
    ctx.fillText("NIVEAU: " + (currentLevel + 1), 400, 22);

    // Affichage graphique des vies tout en bas
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = 'yellow'; ctx.beginPath();
        ctx.arc(25 + i * 22, canvas.height - 18, 7, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(25 + i * 22, canvas.height - 18); ctx.fill();
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
    ctx.fillStyle = ghost.isScared ? '#1919FF' : ghost.color; 
    ctx.beginPath(); ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size); ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size); ctx.fill();
    ctx.fillStyle = ghost.isScared ? 'orange' : 'white'; 
    ctx.beginPath(); ctx.arc(ghost.x - 2.5, ghost.y - 2, 1.8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ghost.x + 2.5, ghost.y - 2, 1.8, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(update);
}

update();
