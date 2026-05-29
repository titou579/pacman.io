const canvas = document.getElementById('gameCanvas');
// Nouvelle taille XXL demandée : 30 colonnes x 40 lignes
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');

const tileSize = 20;

// --- AJOUT AUTOMATIQUE DE LA MANETTE MOBILE ---
if (!document.getElementById('mobile-controls')) {
    const touchContainer = document.createElement('div');
    touchContainer.id = 'mobile-controls';
    touchContainer.style.display = 'flex';
    touchContainer.style.flexDirection = 'column';
    touchContainer.style.alignItems = 'center';
    touchContainer.style.marginTop = '15px';
    touchContainer.innerHTML = `
        <button id="btn-up" style="width:80px; height:60px; margin:5px; font-weight:bold; font-size:24px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▲</button>
        <div style="display:flex;">
            <button id="btn-left" style="width:80px; height:60px; margin:5px; font-weight:bold; font-size:24px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">◀</button>
            <button id="btn-down" style="width:80px; height:60px; margin:5px; font-weight:bold; font-size:24px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▼</button>
            <button id="btn-right" style="width:80px; height:60px; margin:5px; font-weight:bold; font-size:24px; background:#222; color:white; border:2px solid #1919A6; border-radius:10px; touch-action: manipulation;">▶</button>
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

// Générateur de bordures propres pour nos maps 30x40
function createBaseMap() {
    let m = [];
    for(let r=0; r<40; r++) {
        let row = [];
        for(let c=0; c<30; c++) {
            // Murs extérieurs complets sauf tunnels aux lignes 18, 19, 20
            if (r === 0 || r === 38) {
                row.push(1);
            } else if (c === 0 || c === 29) {
                if (r >= 17 && r <= 21) row.push(2); // Tunnels latéraux ouverts
                else row.push(1);
            } else {
                row.push(0); // Intérieur vide par défaut (rempli après)
            }
        }
        m.push(row);
    }
    // Ligne 39 réservée pour l'affichage des vies sous forme de vide
    for(let c=0; c<30; c++) m[39][c] = 2;
    return m;
}

// --- CONFIGURATION DES REPERES DE MAPS 30x40 ---
const maps = [];

// MAP 1 : Le Labyrinthe Royal
let m1 = createBaseMap();
for(let r=2; r<37; r+=4) {
    for(let c=2; c<28; c++) {
        if(c % 5 !== 0 && r !== 18) m1[r][c] = 1; 
    }
}
for(let r=4; r<35; r+=2) {
    m1[r][7] = 1; m1[r][22] = 1;
}
m1[2][2] = 3; m1[2][27] = 3; m1[36][2] = 3; m1[36][27] = 3; // Super-gommes
maps.push(m1);

// MAP 2 : Les Forteresses Divisées
let m2 = createBaseMap();
for(let r=2; r<37; r++) {
    m2[r][14] = 1; m2[r][15] = 1; // Grand mur central séparateur
}
for(let r=16; r<=22; r++) {
    m2[r][14] = 2; m2[r][15] = 2; // Zone centrale ouverte
}
for(let r=4; r<36; r+=3) {
    for(let c=2; c<12; c++) m2[r][c] = 1;
    for(let c=18; c<28; c++) m2[r][c] = 1;
}
m2[3][3] = 3; m2[3][26] = 3; m2[35][3] = 3; m2[35][26] = 3;
maps.push(m2);

// MAP 3 : Le Grand Piège de l'Enfer
let m3 = createBaseMap();
for(let r=2; r<37; r++) {
    for(let c=2; c<28; c++) {
        if ((r + c) % 6 === 0 && (r < 15 || r > 24)) m3[r][c] = 1;
        if (r % 5 === 0 && c > 5 && c < 24) m3[r][c] = 1;
    }
}
// Nettoyage strict du centre pour éviter que le fantôme spawn dans un mur
for(let r=16; r<=24; r++) {
    for(let c=10; c<=20; c++) m3[r][c] = (r === 16 || r === 24 || c === 10 || c === 20) ? 1 : 2;
}
m3[16][15] = 2; // Porte d'entrée de la cage centrale
m3[2][2] = 3; m3[2][27] = 3; m3[36][2] = 3; m3[36][27] = 3;
maps.push(m3);

// --- INITIALISATION ---
let currentLevel = 0;
let lives = 3;
let score = 0;
let map = JSON.parse(JSON.stringify(maps[currentLevel]));

// Positions adaptées à la taille 30x40
let pacman = { x: 30, y: 30, size: 8, speed: 2, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouthOpen: 0, mouthDir: 1 };
let ghost = { x: 310, y: 410, size: 8, speed: 2, dx: 2, dy: 0, color: 'red', isScared: false, scaredTimer: 0 };

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') { pacman.nextDx = 0; pacman.nextDy = -1; }
    if (e.key === 'ArrowDown' || e.key === 's') { pacman.nextDx = 0; pacman.nextDy = 1; }
    if (e.key === 'ArrowLeft' || e.key === 'q') { pacman.nextDx = -1; pacman.nextDy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { pacman.nextDx = 1; pacman.nextDy = 0; }
});

function canMove(x, y, size) {
    const margin = 3; 
    const left = Math.floor((x - size + margin) / tileSize);
    const right = Math.floor((x + size - margin) / tileSize);
    const top = Math.floor((y - size + margin) / tileSize);
    const bottom = Math.floor((y + size - margin) / tileSize);

    if (x < 0 || x > canvas.width) return true; // Autoriser les sorties de secours (tunnels)
    if (!map[top] || map[top][left] === 1 || map[top][right] === 1 || !map[bottom] || map[bottom][left] === 1 || map[bottom][right] === 1) {
        return false;
    }
    return true;
}

function resetPositions() {
    pacman.x = 30; pacman.y = 30; pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    ghost.x = 310; ghost.y = 410; ghost.dx = 2; ghost.dy = 0; ghost.isScared = false; ghost.scaredTimer = 0;
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
            alert("🎉 TU AS GAGNÉ LE JEU GÉANT !");
            currentLevel = 0; lives = 3; score = 0;
        } else {
            alert("Niveau suivant ! Prépare-toi.");
        }
        map = JSON.parse(JSON.stringify(maps[currentLevel]));
        ghost.speed = (currentLevel === 2) ? 4 : 2;
        resetPositions();
    }
}

function getGhostMove() {
    let possibleMoves = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
    possibleMoves = possibleMoves.filter(m => !(m.dx === -ghost.dx && m.dy === -ghost.dy));
    let validMoves = possibleMoves.filter(m => canMove(ghost.x + m.dx * 2, ghost.y + m.dy * 2, ghost.size));
    
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
    // Déplacement Pac-Man
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMove(pacman.x + pacman.nextDx * pacman.speed, pacman.y + pacman.nextDy * pacman.speed, pacman.size)) {
            pacman.dx = pacman.nextDx; pacman.dy = pacman.nextDy;
            pacman.nextDx = 0; pacman.nextDy = 0;
        }
    }
    if (canMove(pacman.x + pacman.dx * pacman.speed, pacman.y + pacman.dy * pacman.speed, pacman.size)) {
        pacman.x += pacman.dx * pacman.speed; pacman.y += pacman.dy * pacman.speed;
    }

    // Gestion Tunnel Pac-Man
    if (pacman.x < -5) pacman.x = canvas.width + 5;
    if (pacman.x > canvas.width + 5) pacman.x = -5;

    // Manger gommes
    let gridX = Math.floor(pacman.x / tileSize);
    let gridY = Math.floor(pacman.y / tileSize);
    if (map[gridY] && map[gridY][gridX] === 0) {
        map[gridY][gridX] = 2; score += 10;
        checkLevelComplete();
    } else if (map[gridY] && map[gridY][gridX] === 3) {
        map[gridY][gridX] = 2; score += 50;
        ghost.isScared = true; ghost.scaredTimer = 400;
        checkLevelComplete();
    }

    // --- LOGIQUE SECURISEE DU FANTOME ---
    let currentGhostSpeed = ghost.isScared ? ghost.speed * 0.5 : ghost.speed;

    // Aimantation/Calcul aux intersections pour éviter de traverser les murs
    if (Math.abs((ghost.x - 10) % tileSize) < currentGhostSpeed && Math.abs((ghost.y - 10) % tileSize) < currentGhostSpeed) {
        ghost.x = Math.round((ghost.x - 10) / tileSize) * tileSize + 10;
        ghost.y = Math.round((ghost.y - 10) / tileSize) * tileSize + 10;
        
        let newMove = getGhostMove();
        ghost.dx = newMove.dx; ghost.dy = newMove.dy;
    }

    // Application du mouvement si la voie est libre
    if (canMove(ghost.x + ghost.dx * currentGhostSpeed, ghost.y + ghost.dy * currentGhostSpeed, ghost.size)) {
        ghost.x += ghost.dx * currentGhostSpeed;
        ghost.y += ghost.dy * currentGhostSpeed;
    } else {
        // Sécurité ultime : si bloqué, recalcul immédiat de direction
        let emergencyMove = getGhostMove();
        ghost.dx = emergencyMove.dx; ghost.dy = emergencyMove.dy;
    }

    // Gestion Tunnel Fantôme (Évite le dépop !)
    if (ghost.x < -5) ghost.x = canvas.width + 5;
    if (ghost.x > canvas.width + 5) ghost.x = -5;

    if (ghost.isScared) {
        ghost.scaredTimer--;
        if (ghost.scaredTimer <= 0) ghost.isScared = false;
    }

    // Collisions mortelles
    let distToGhost = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
    if (distToGhost < 14) {
        if (ghost.isScared) {
            score += 200; resetPositions();
        } else {
            lives--;
            if (lives <= 0) {
                alert("❌ GAME OVER ! Score : " + score);
                currentLevel = 0; lives = 3; score = 0;
                map = JSON.parse(JSON.stringify(maps[currentLevel]));
                ghost.speed = 2;
            } else {
                alert("Ouch ! Vies restantes : " + lives);
            }
            resetPositions();
        }
    }

    // --- AFFICHAGE ---
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = '#1919A6'; ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = '#ffb8ae'; ctx.beginPath(); ctx.arc(col * tileSize + 10, row * tileSize + 10, 3, 0, Math.PI * 2); ctx.fill();
            } else if (map[row][col] === 3) {
                ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(col * tileSize + 10, row * tileSize + 10, 6, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    // Score et niveau
    ctx.fillStyle = 'white'; ctx.font = 'bold 16px Arial';
    ctx.fillText("SCORE: " + score, 20, 22);
    ctx.fillText("NIVEAU: " + (currentLevel + 1), 500, 22);

    // Vies de Pac-Man tout en bas
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = 'yellow'; ctx.beginPath();
        ctx.arc(30 + i * 25, canvas.height - 20, 8, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(30 + i * 25, canvas.height - 20); ctx.fill();
    }

    // Dessin Pac-Man dynamisé
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

    // Dessin Fantôme stabilisé
    ctx.fillStyle = ghost.isScared ? '#1919FF' : ghost.color; 
    ctx.beginPath(); ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size); ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size); ctx.fill();
    ctx.fillStyle = ghost.isScared ? 'orange' : 'white'; 
    ctx.beginPath(); ctx.arc(ghost.x - 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ghost.x + 3, ghost.y - 2, 2, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(update);
}

update();
