// ==========================================
// CONFIGURATION GLOBALE ET VARIABLES DU JEU
// ==========================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;

let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;

let currentLevelIndex = 0;
let currentMap = [];
let dotsEaten = 0;
let totalDots = 0;

let frightenedTimer = 0;
let frightenedDuration = 7000;
let pacmanSpeedBonusActive = false;
let pacmanSpeedBonusTimer = 0;

// Variable essentielle pour gérer le rythme des animations (bouche, clignotements)
let animationFrame = 0;

// Définition de Pac-Man
let pacman = {
    x: 14 * tileSize,
    y: 26 * tileSize,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    baseSpeed: 2,
    currentSpeed: 2
};

// Liste des fantômes (le 4ème est configuré comme le "boss")
let ghosts = [
    { x: 0, y: 0, dx: 0, dy: 0, color: "red", type: "normal" },
    { x: 0, y: 0, dx: 0, dy: 0, color: "pink", type: "normal" },
    { x: 0, y: 0, dx: 0, dy: 0, color: "cyan", type: "normal" },
    { x: 0, y: 0, dx: 0, dy: 0, color: "orange", type: "boss" } // Le Boss qui traque le joueur
];

// ==========================================
// CONCEPTION DES NIVEAUX (Cartes de 30x35)
// 0: Gomme, 1: Mur, 2: Vide, 3: Super-Gomme, 4: Bonus Vitesse
// ==========================================
const templateMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,4,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,4,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,2,2,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,0,0,1,1,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,1,1,0,0,3,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Génération des 3 niveaux requis
const allLevels = [templateMap, templateMap, templateMap];

// ==========================================
// FONCTIONS DE LOGIQUE ET INITIALISATION
// ==========================================

function countTotalDots() {
    let count = 0;
    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            if (currentMap[r][c] === 0 || currentMap[r][c] === 3) {
                count++;
            }
        }
    }
    return count;
}

function isWall(x, y) {
    if (x < 0 || x >= 30 * tileSize || y < 0 || y >= 35 * tileSize) return true;
    let tileX = Math.floor(x / tileSize);
    let tileY = Math.floor(y / tileSize);
    return currentMap[tileY][tileX] === 1;
}

function initLevel() {
    currentMap = JSON.parse(JSON.stringify(allLevels[currentLevelIndex]));
    pacman.x = 14 * tileSize;
    pacman.y = 26 * tileSize;
    pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    
    ghosts.forEach((g, idx) => {
        g.x = (12 + (idx % 5)) * tileSize;
        g.y = 17 * tileSize;
        g.dx = (idx % 2 === 0) ? 2 : -2;
        g.dy = 0;
    });

    dotsEaten = 0;
    totalDots = countTotalDots();
    frightenedTimer = 0;
    frightenedDuration = Math.max(3000, 9000 - (currentLevelIndex * 1500));
    
    // FIX : Choix de vitesses entières obligatoires (diviseurs de 20)
    pacman.baseSpeed = currentLevelIndex >= 2 ? 4 : 2; 
    pacman.currentSpeed = pacman.baseSpeed;

    let lvlEl = document.getElementById("level");
    if (lvlEl) lvlEl.innerText = currentLevelIndex + 1;
}

// FIX : Activation et liaison des boutons tactiles à l'écran
function setupMobileControls() {
    const buttons = {
        'btn-up': { dx: 0, dy: -1 },
        'btn-down': { dx: 0, dy: 1 },
        'btn-left': { dx: -1, dy: 0 },
        'btn-right': { dx: 1, dy: 0 }
    };

    Object.entries(buttons).forEach(([id, dir]) => {
        const btn = document.getElementById(id);
        if (btn) {
            const handlePress = (e) => {
                e.preventDefault(); // Empêche l'écran de scroller sur mobile
                pacman.nextDx = dir.dx * pacman.currentSpeed;
                pacman.nextDy = dir.dy * pacman.currentSpeed;
            };
            btn.addEventListener('touchstart', handlePress, { passive: false });
            btn.addEventListener('click', handlePress);
        }
    });
}

// Écouteur clavier (PC)
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":    pacman.nextDx = 0; pacman.nextDy = -pacman.currentSpeed; break;
        case "ArrowDown":  pacman.nextDx = 0; pacman.nextDy = pacman.currentSpeed; break;
        case "ArrowLeft":  pacman.nextDx = -pacman.currentSpeed; pacman.nextDy = 0; break;
        case "ArrowRight": pacman.nextDx = pacman.currentSpeed; pacman.nextDy = 0; break;
    }
});

// ==========================================
// BOUCLE DE MISE À JOUR (UPDATE)
// ==========================================
function update() {
    if (gameOver || gameWon) return;

    animationFrame++; // Incrémentation constante pour animer le rendu visuel

    if (frightenedTimer > 0) {
        frightenedTimer -= 16.66; 
    }

    if (pacmanSpeedBonusActive) {
        pacmanSpeedBonusTimer -= 16.66;
        if (pacmanSpeedBonusTimer <= 0) {
            pacmanSpeedBonusActive = false;
            pacman.currentSpeed = pacman.baseSpeed;
        }
    }

    // Autoriser le redémarrage immédiat si Pac-Man s'arrête net sur un mur
    if (pacman.dx === 0 && pacman.dy === 0) {
        if (!isWall(pacman.x + (pacman.nextDx > 0 ? tileSize : pacman.nextDx < 0 ? -1 : 0), pacman.y + (pacman.nextDy > 0 ? tileSize : pacman.nextDy < 0 ? -1 : 0))) {
            pacman.dx = pacman.nextDx;
            pacman.dy = pacman.nextDy;
        }
    }

    // Pivotement aux intersections (alignement parfait sur la grille)
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (pacman.x % tileSize === 0 && pacman.y % tileSize === 0) {
            if (!isWall(pacman.x + (pacman.nextDx > 0 ? tileSize : pacman.nextDx < 0 ? -1 : 0), pacman.y + (pacman.nextDy > 0 ? tileSize : pacman.nextDy < 0 ? -1 : 0))) {
                pacman.dx = pacman.nextDx;
                pacman.dy = pacman.nextDy;
            }
        }
    }

    // Avancement de Pac-Man
    if (!isWall(pacman.x + (pacman.dx > 0 ? tileSize : pacman.dx < 0 ? -1 : 0), pacman.y + (pacman.dy > 0 ? tileSize : pacman.dy < 0 ? -1 : 0))) {
        pacman.x += pacman.dx;
        pacman.y += pacman.dy;
    } else {
        pacman.dx = 0;
        pacman.dy = 0;
    }

    // Gestion des tunnels latéraux (téléportation)
    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.x >= canvas.width) pacman.x = 0;

    // Analyse de la case centrale
    let centerTileX = Math.floor((pacman.x + tileSize/2) / tileSize);
    let centerTileY = Math.floor((pacman.y + tileSize/2) / tileSize);

    if (centerTileX >= 0 && centerTileX < 30 && centerTileY >= 0 && centerTileY < 35) {
        let item = currentMap[centerTileY][centerTileX];
        if (item === 0) {
            currentMap[centerTileY][centerTileX] = 2;
            score += 10;
            dotsEaten++;
        } else if (item === 3) {
            currentMap[centerTileY][centerTileX] = 2;
            score += 50;
            dotsEaten++;
            frightenedTimer = frightenedDuration;
        } else if (item === 4) {
            currentMap[centerTileY][centerTileX] = 2;
            score += 500;
            pacmanSpeedBonusActive = true;
            pacmanSpeedBonusTimer = 4000;
            pacman.currentSpeed = pacman.baseSpeed === 2 ? 4 : 5; 
        }
    }

    let scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.innerText = score;

    if (dotsEaten >= totalDots) {
        if (currentLevelIndex < allLevels.length - 1) {
            currentLevelIndex++;
            initLevel();
        } else {
            gameWon = true;
        }
    }

    // TRAITEMENT ET MOUVEMENT DES FANTÔMES
    ghosts.forEach(g => {
        let ghostSpeed = currentLevelIndex >= 2 ? 4 : 2; 
        if (frightenedTimer > 0 && g.type !== "boss") {
            ghostSpeed = 1; 
        }
        if (g.type === "boss") {
            ghostSpeed = currentLevelIndex >= 2 ? 5 : 4; 
        }

        if (g.x % tileSize === 0 && g.y % tileSize === 0) {
            let possibleDirs = [];
            let dirs = [{x: ghostSpeed, y:0}, {x: -ghostSpeed, y:0}, {x:0, y: ghostSpeed}, {x:0, y: -ghostSpeed}];
            
            dirs.forEach(d => {
                if (!isWall(g.x + (d.x > 0 ? tileSize : d.x < 0 ? -1 : 0), g.y + (d.y > 0 ? tileSize : d.y < 0 ? -1 : 0))) {
                    if (!(d.x === -g.dx && d.y === -g.dy)) {
                        possibleDirs.push(d);
                    }
                }
            });

            if (possibleDirs.length === 0) {
                possibleDirs.push({x: -g.dx, y: -g.dy});
            }

            if (g.type === "boss" && Math.random() < 0.7 && possibleDirs.length > 0) {
                possibleDirs.sort((a, b) => {
                    let distA = Math.hypot((g.x + a.x) - pacman.x, (g.y + a.y) - pacman.y);
                    let distB = Math.hypot((g.x + b.x) - pacman.x, (g.y + b.y) - pacman.y);
                    return distA - distB;
                });
                g.dx = possibleDirs[0].x;
                g.dy = possibleDirs[0].y;
            } else {
                let finalDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                g.dx = finalDir.x;
                g.dy = finalDir.y;
            }
        }

        g.x += g.dx;
        g.y += g.dy;

        // VÉRIFICATION CHOC ET MORT
        let distance = Math.hypot((g.x + tileSize/2) - (pacman.x + tileSize/2), (g.y + tileSize/2) - (pacman.y + tileSize/2));
        if (distance < tileSize * 0.8) {
            if (frightenedTimer > 0 && g.type !== "boss") {
                score += 200;
                g.x = 14 * tileSize;
                g.y = 17 * tileSize;
            } else {
                lives--;
                let livesEl = document.getElementById("lives");
                if (livesEl) livesEl.innerText = lives;
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    pacman.x = 14 * tileSize;
                    pacman.y = 26 * tileSize;
                    pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
                }
            }
        }
    });
}

// ==========================================
// RECOUVREMENT ET RENDU GRAPHIQUE (DRAW)
// ==========================================

function drawPacman() {
    // ANIMATION DE LA BOUCHE : On calcule la taille d'ouverture via un sinus oscillant
    let mouthSize = 0;
    if (pacman.dx !== 0 || pacman.dy !== 0) {
        mouthSize = Math.abs(Math.sin(animationFrame * 0.25)) * 0.4; 
    }

    let startAngle = mouthSize;
    let endAngle = 2 * Math.PI - mouthSize;

    // Ajustement de la rotation selon l'axe de déplacement
    let rotation = 0;
    if (pacman.dx > 0) rotation = 0;
    if (pacman.dy > 0) rotation = Math.PI / 2;
    if (pacman.dx < 0) rotation = Math.PI;
    if (pacman.dy < 0) rotation = 3 * Math.PI / 2;

    ctx.save();
    ctx.translate(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.arc(0, 0, (tileSize / 2) - 1, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    
    ctx.restore();
}

function drawGhosts() {
    ghosts.forEach(g => {
        ctx.beginPath();
        ctx.arc(g.x + tileSize / 2, g.y + tileSize / 2, (tileSize / 2) - 1, 0, 2 * Math.PI);
        
        // ANIMATION CLIGNOTEMENT : Blanc/bleu alterné durant les 2 dernières secondes
        if (frightenedTimer > 0 && g.type !== "boss") {
            if (frightenedTimer < 2000 && Math.floor(frightenedTimer / 150) % 2 === 0) {
                ctx.fillStyle = "white"; 
            } else {
                ctx.fillStyle = "blue";
            }
        } else {
            ctx.fillStyle = g.color;
        }
        
        ctx.fill();
        ctx.closePath();

        // Ajout d'yeux simples pour parfaire l'animation des fantômes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(g.x + 6, g.y + 6, 3, 0, 2 * Math.PI);
        ctx.arc(g.x + 14, g.y + 6, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(g.x + 6 + (g.dx * 0.5), g.y + 6 + (g.dy * 0.5), 1.5, 0, 2 * Math.PI);
        ctx.arc(g.x + 14 + (g.dx * 0.5), g.y + 6 + (g.dy * 0.5), 1.5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawMap() {
    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            let item = currentMap[r][c];
            if (item === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
            } else if (item === 0) {
                ctx.fillStyle = "pink";
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 3, 0, 2 * Math.PI);
                ctx.fill();
            } else if (item === 3) {
                ctx.fillStyle = "orange";
                ctx.beginPath();
                // Légère oscillation de taille sur les super gommes
                let pulse = Math.sin(animationFrame * 0.1) * 1.5;
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 6 + pulse, 0, 2 * Math.PI);
                ctx.fill();
            } else if (item === 4) {
                ctx.fillStyle = "lime";
                ctx.fillRect(c * tileSize + 4, r * tileSize + 4, tileSize - 8, tileSize - 8);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    } else if (gameWon) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lime";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("VICTOIRE !", canvas.width/2, canvas.height/2);
    }
}

// ==========================================
// BOUCLE PRINCIPALE (GAME LOOP)
// ==========================================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Lancement global au chargement
initLevel();
setupMobileControls();
gameLoop();
