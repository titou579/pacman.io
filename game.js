const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dessiner un fond noir et un Pac-Man jaune statique pour tester
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Dessin de Pac-Man
ctx.beginPath();
ctx.arc(200, 200, 20, 0.2 * Math.PI, 1.8 * Math.PI); // Un cercle presque complet
ctx.lineTo(200, 200);
ctx.fillStyle = 'yellow';
ctx.fill();
ctx.closePath();
