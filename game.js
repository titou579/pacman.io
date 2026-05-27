const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Position de départ de Pac-Man
let pacman = {
    x: 200,
    y: 200,
    size: 20,
    speed: 4,
    dx: 0, // Déplacement horizontal (-1 pour gauche, 1 pour droite)
    dy: 0  // Déplacement vertical (-1 pour haut, 1 pour bas)
};

// Écouter les touches du clavier
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'z') {
        pacman.dx = 0; pacman.dy = -1;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        pacman.dx = 0; pacman.dy = 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'q') {
        pacman.dx = -1; pacman.dy = 0;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        pacman.dx = 1; pacman.dy = 0;
    }
});

// Boucle principale du jeu
function update() {
    // 1. Mettre à jour la position de Pac-Man
    pacman.x += pacman.dx * pacman.speed;
    pacman.y += pacman.dy * pacman.speed;

    // Empêcher Pac-Man de sortir de l'écran (collisions avec les bords)
    if (pacman.x - pacman.size < 0) pacman.x = pacman.size;
    if (pacman.x + pacman.size > canvas.width) pacman.x = canvas.width - pacman.size;
    if (pacman.y - pacman.size < 0) pacman.y = pacman.size;
    if (pacman.y + pacman.size > canvas.height) pacman.y = canvas.height - pacman.size;

    // 2. Nettoyer le canvas pour redessiner
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Dessiner Pac-Man
    ctx.beginPath();
    // Animation simple de la bouche selon la direction
    let angleDepart = 0.2;
    let angleFin = 1.8;
    
    ctx.arc(pacman.x, pacman.y, pacman.size, angleDepart * Math.PI, angleFin * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Relancer la fonction au prochain rafraîchissement d'écran
    requestAnimationFrame(update);
}

// Lancer le jeu
update();
