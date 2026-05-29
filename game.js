// ==========================================
// CONFIGURATION GLOBALE ET VARIABLES DU JEU
// ==========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;

// Grille exacte de ton projet (25 colonnes x 30 lignes)
canvas.width = 500;
canvas.height = 600;

let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;

let currentLevelIndex = 0;
let currentMap = [];
let dotsEaten = 0;
let totalDots = 0;

let frightenedTimer = 0;
let frightenedDuration = 8000; // Plus court pour le mode difficile
let pacmanSpeedBonusActive = false;
let pacmanSpeedBonusTimer = 0;

// Variable pour animer la bouche de Pac-Man
let animationFrame = 0;

// Définition de Pac-Man (Replacé selon la map)
let pacman = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    baseSpeed: 2,
    currentSpeed: 2
};

// Liste des fantômes avec le nouveau mob spécial "Trolly" (Vert)
// NOTE : Trolly est de type "troll".
let ghosts = [
    { x: 0, y: 0, dx: 0, dy: 0, color: "red", type: "normal" }, // Inky
    { x: 0, y: 0, dx: 0, dy: 0, color: "pink", type: "normal" }, // Pinky
    { x: 0, y: 0, dx: 0, dy: 0, color: "cyan", type: "normal" }, // Blinky
    { x: 0, y: 0, dx: 0, dy: 0, color: "orange", type: "boss" },  // Boss Orange (Boss Crimson d'avant)
    { x: 0, y: 0, dx: 0, dy: 0, color: "#00FF00", type: "troll" } // NOUVEAU MOB : "Trolly" (Méta-Fantôme Vert)
];

// ==========================================
// CONFIGURATION DES 5 CARTES DIFFICILES (HARDCORE MODE)
// 0: Gomme rose, 1: Mur bleu, 2: Vide/Spawn, 3: Super Gomme blanche
// ==========================================

// MAP 1 : Le Labyrinthe Serré (Peu d'espace pour esquiver)
const map1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,3,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,3,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,2,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,2,2,0,2,2,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,2,2,0,2,2,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,1,3,1,1,1,1,0,1,0,1,1,1,1,3,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,1],
    [1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,3,0,1,0,3,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,1],
    [1,1,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,0,1],
    [1,0,0,0,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,0,0,0,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1],
    [1,3,0,0,0,1,0,0,0,1,1,1,0,1,1,1,0,0,0,1,0,0,0,3,1],
    [1,1,1,1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// MAP 2 : Les Îles Isolées (Obligation de passer par des goulots)
const map2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,3,0,3,1,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,2,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,1,2,2,2,1,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,1,3,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,3,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,3,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,3,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,3,0,0,0,0,0,3,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// MAP 3 : Le Grand H (Concentration centrale dangereuse)
const map3 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,2,1,2,1,1,1,1,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,2,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,2,2,2,2,0,2,2,1,2,2,2,2,2,2,2,1,2,2,0,2,2,2,2,1],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,3,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,3,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// MAP 4 : Le V inversé (Dédale complexe en bas)
const map4 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,2,1,2,1,1,1,1,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,2,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,2,2,2,2,0,2,2,1,2,2,2,2,2,2,2,1,2,2,0,2,2,2,2,1],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,3,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,3,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// MAP 5 : Le Boss Final (Symétrie trompeuse et chemins uniques)
const map5 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,2,1,2,1,1,1,1,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,2,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,2,2,2,2,0,2,2,1,2,2,2,2,2,2,2,1,2,2,0,2,2,2,2,1],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,3,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,3,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const allLevels = [map1, map2, map3, map4, map5]; // Les 5 maps hardcore

// ==========================================
// FONCTIONS DE LOGIQUE ET INITIALISATION
// ==========================================

function countTotalDots() {
    let count = 0;
    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            if (currentMap[r][c] === 0 || currentMap[r][c] === 3) count++;
        }
    }
    return count;
}

function isWall(x, y) {
    if (x < 0 || x >= 25 * tileSize || y < 0 || y >= 30 * tileSize) return true;
    let tileX = Math.floor(x / tileSize);
    let tileY = Math.floor(y / tileSize);
    return currentMap[tileY][tileX] === 1;
}

function updateUI() {
    let scoreEl = document.getElementById("scoreDisplay");
    let lvlEl = document.getElementById("niveauDisplay");
    let livesEl = document.getElementById("viesDisplay");

    if (scoreEl) scoreEl.innerText = score;
    // CORRECTION : Affiche uniquement le chiffre propre pour éviter le bug d'affichage
    if (lvlEl) lvlEl.innerText = (currentLevelIndex + 1); 
    if (livesEl) livesEl.innerText = lives;
}

// Positionnement dynamique Pac-Man selon la carte
function getStartPos(map) {
    // Parcourt la map de bas en haut pour trouver une case libre
    for(let r = map.length - 2; r > 0; r--) {
        for(let c = 1; c < map[r].length - 1; c++) {
            if (map[r][c] === 0 || map[r][c] === 2) {
                return { x: c * tileSize, y: r * tileSize };
            }
        }
    }
    // Par défaut
    return { x: 12 * tileSize, y: 20 * tileSize };
}

function initLevel() {
    currentMap = JSON.parse(JSON.stringify(allLevels[currentLevelIndex]));
    let pos = getStartPos(currentMap);
    pacman.x = pos.x;
    pacman.y = pos.y;
    pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    
    // Positionnement fantômes
    ghosts.forEach((g, idx) => {
        g.x = (11 + (idx % 3)) * tileSize;
        g.y = 10 * tileSize;
        g.dx = (idx % 2 === 0) ? 2 : -2;
        g.dy = 0;
    });

    dotsEaten = 0;
    totalDots = countTotalDots();
    frightenedTimer = 0;
    
    // CORRECTION : Vitesses entières (diviseurs de 20) obligatoires
    pacman.baseSpeed = currentLevelIndex >= 2 ? 4 : 2; 
    pacman.currentSpeed = pacman.baseSpeed;

    updateUI();
}

function setupMobileControls() {
    // RECOMMANDATION : Assure-toi que tes boutons dans index.html ont bien ces ID précis !
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
                e.preventDefault(); 
                pacman.nextDx = dir.dx * pacman.currentSpeed;
                pacman.nextDy = dir.dy * pacman.currentSpeed;
            };
            btn.addEventListener('touchstart', handlePress, { passive: false });
            btn.addEventListener('click', handlePress);
        }
    });
}

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":    pacman.nextDx = 0; pacman.nextDy = -pacman.currentSpeed; break;
        case "ArrowDown":  pacman.nextDx = 0; pacman.nextDy = pacman.currentSpeed; break;
        case "ArrowLeft":  pacman.nextDx = -pacman.currentSpeed; pacman.nextDy = 0; break;
        case "ArrowRight": pacman.nextDx = pacman.currentSpeed; pacman.nextDy = 0; break;
    }
});

// ==========================================
// LOGIQUE DU SCREAMER (JUMP SCARE)
// ==========================================
function triggerScreamer() {
    const overlay = document.getElementById('screamer-overlay');
    const sound = document.getElementById('scream-sound');
    
    if (overlay && sound) {
        sound.currentTime = 0; // Remet le son au début
        overlay.style.display = 'flex'; // Affiche la superposition
        
        // Joue le son. Attention, les navigateurs modernes bloquent le son sans interaction utilisateur préalable.
        sound.play().catch(error => console.log("Le son a été bloqué par le navigateur:", error));
        
        // Cache le screamer après 1.5 secondes
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1500);
    }
}

// ==========================================
// BOUCLE DE MISE À JOUR (UPDATE)
// ==========================================
function update() {
    if (gameOver || gameWon) return;

    animationFrame++; 

    if (frightenedTimer > 0) frightenedTimer -= 16.66; 

    // Fluidité des virages sur la grille
    if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (pacman.x % tileSize === 0 && pacman.y % tileSize === 0) {
            if (!isWall(pacman.x + (pacman.nextDx > 0 ? tileSize : pacman.nextDx < 0 ? -1 : 0), pacman.y + (pacman.nextDy > 0 ? tileSize : pacman.nextDy < 0 ? -1 : 0))) {
                pacman.dx = pacman.nextDx;
                pacman.dy = pacman.nextDy;
            }
        }
    }

    if (!isWall(pacman.x + (pacman.dx > 0 ? tileSize : pacman.dx < 0 ? -1 : 0), pacman.y + (pacman.dy > 0 ? tileSize : pacman.dy < 0 ? -1 : 0))) {
        pacman.x += pacman.dx;
        pacman.y += pacman.dy;
    } else {
        pacman.dx = 0;
        pacman.dy = 0;
    }

    // Tunnels latéraux
    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.x >= canvas.width) pacman.x = 0;

    // Manger les gommes
    let centerTileX = Math.floor((pacman.x + tileSize/2) / tileSize);
    let centerTileY = Math.floor((pacman.y + tileSize/2) / tileSize);

    if (centerTileX >= 0 && centerTileX < 25 && centerTileY >= 0 && centerTileY < 30) {
        let item = currentMap[centerTileY][centerTileX];
        if (item === 0) {
            currentMap[centerTileY][centerTileX] = 2;
            score += 10;
            dotsEaten++;
            updateUI();
        } else if (item === 3) {
            currentMap[centerTileY][centerTileX] = 2;
            score += 50;
            dotsEaten++;
            frightenedTimer = frightenedDuration;
            updateUI();
        }
    }

    if (dotsEaten >= totalDots) {
        if (currentLevelIndex < allLevels.length - 1) {
            currentLevelIndex++;
            initLevel();
        } else {
            gameWon = true;
        }
    }

    // Fantômes
    ghosts.forEach(g => {
        let ghostSpeed = currentLevelIndex >= 2 ? 4 : 2; 
        
        // CORRECTION : trolly accélère au lieu de ralentir s'il a peur !
        if (frightenedTimer > 0) {
            if (g.type === "troll") {
                ghostSpeed = 4; // Accélère
            } else if (g.type !== "boss") {
                ghostSpeed = 1; // Ralentit standard
            }
        }

        if (g.x % tileSize === 0 && g.y % tileSize === 0) {
            let possibleDirs = [];
            let dirs = [{x: ghostSpeed, y:0}, {x: -ghostSpeed, y:0}, {x:0, y: ghostSpeed}, {x:0, y: -ghostSpeed}];
            
            dirs.forEach(d => {
                if (!isWall(g.x + (d.x > 0 ? tileSize : d.x < 0 ? -1 : 0), g.y + (d.y > 0 ? tileSize : d.y < 0 ? -1 : 0))) {
                    if (!(d.x === -g.dx && d.y === -g.dy)) possibleDirs.push(d);
                }
            });

            if (possibleDirs.length === 0) possibleDirs.push({x: -g.dx, y: -g.dy});

            if ((g.type === "boss" || g.type === "troll") && Math.random() < 0.6 && possibleDirs.length > 0) {
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

        // Collisions
        let distance = Math.hypot((g.x + tileSize/2) - (pacman.x + tileSize/2), (g.y + tileSize/2) - (pacman.y + tileSize/2));
        if (distance < tileSize * 0.7) {
            // CORRECTION : Méta-Fantôme trolly est impossible à manger même en peur !
            if (frightenedTimer > 0 && g.type !== "boss" && g.type !== "troll") {
                score += 200;
                // Position Spawn Fantômes
                g.x = 12 * tileSize;
                g.y = 11 * tileSize;
                updateUI();
            } else {
                lives--;
                updateUI();
                if (lives <= 0) {
                    gameOver = true;
                    triggerScreamer(); // Déclenche le screamer sur le Game Over final
                } else {
                    initLevel(); // Recommence le niveau sur mort
                }
            }
        }
    });
}

// ==========================================
// RENDU GRAPHIQUE RESTAURÉ (DRAW)
// ==========================================

function drawPacman() {
    let mouthSize = 0;
    if (pacman.dx !== 0 || pacman.dy !== 0) {
        mouthSize = Math.abs(Math.sin(animationFrame * 0.25)) * 0.4; 
    }

    let startAngle = mouthSize;
    let endAngle = 2 * Math.PI - mouthSize;

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
        
        // CORRECTION : trolly (type troll) accélère et reste mortel au lieu de clignoter bleu !
        if (frightenedTimer > 0) {
            if (g.type === "troll") {
                // Trolly reste vert pétant et dangereux !
                ctx.fillStyle = "#FF0000"; // Devient ROUGE SANG (Couleur Boss Crimson)
            } else if (g.type !== "boss") {
                if (frightenedTimer < 2000 && Math.floor(frightenedTimer / 150) % 2 === 0) {
                    ctx.fillStyle = "white"; 
                } else {
                    ctx.fillStyle = "blue";
                }
            } else {
                ctx.fillStyle = g.color; // Boss reste orange
            }
        } else {
            ctx.fillStyle = g.color;
        }
        
        ctx.fill();
        ctx.closePath();

        // Yeux des fantômes
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
                // STYLE TEXTURE : Bloc bleu brillant d'origine
                ctx.fillStyle = "#0000FF";
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
            } else if (item === 0) {
                // STYLE GOMME : Petits cercles roses discrets originaux
                ctx.fillStyle = "#FFC0CB"; // Pink
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 2.5, 0, 2 * Math.PI);
                ctx.fill();
            } else if (item === 3) {
                // STYLE SUPER GOMME : Gros cercles blancs originaux (Pulsation pour le hardcore)
                ctx.fillStyle = "#FFFFFF"; // White
                ctx.beginPath();
                // Vibration hardcore
                let pulse = Math.sin(animationFrame * 0.2) * 1.5;
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 6 + pulse, 0, 2 * Math.PI);
                ctx.fill();
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
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Ton pote t'a battu !", canvas.width/2, canvas.height/2);
    } else if (gameWon) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lime";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TU ES LÉGENDAIRE !", canvas.width/2, canvas.height/2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialisation au chargement
initLevel();
setupMobileControls();
gameLoop();
