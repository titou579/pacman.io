const express = require('express');
const app = express();
const path = require('path');

// Utiliser le port donné par Render, ou le port 3000 en local
const PORT = process.env.PORT || 3000;

// Servir les fichiers du jeu (index.html et game.js)
app.use(express.static(__dirname));

// Route principale qui envoie le fichier index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur Pac-Man tourne sur le port ${PORT}`);
});
