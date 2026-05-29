// ==========================================
// CONFIGURATION GLOBALE ET VARIABLES DU JEU
// ==========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;

// Grille exacte (25 colonnes x 30 lignes)
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
let frightenedDuration = 8000; 

// Animation de la bouche de Pac-Man
let mouthAngle = 0.2;
let mouthSpeed = 0.02;

// Définition de Pac-Man
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

// Liste des fantômes avec "Trolly" (Vert)
let ghosts = [
    { x: 0, y: 0, dx: 0, dy: 0, color: "red", type: "normal" },   
    { x: 0, y: 0, dx: 0, dy: 0, color: "pink", type: "normal" },  
    { x: 0, y: 0, dx: 0, dy: 0, color: "cyan", type: "normal" },  
    { x: 0, y: 0, dx: 0, dy: 0, color: "orange", type: "boss" },  
    { x: 0, y: 0, dx: 0, dy: 0, color: "#00FF00", type: "troll" } 
];

// ==========================================
// LES 5 NIVEAUX DU JEU (MATRICES 25x30)
// ==========================================

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
    [1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
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

const map4 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,3,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,3,1],
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
    [1,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,1],
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

const allLevels = [map1, map2, map3, map4, map5];

// ==========================================
// FONCTIONS DE LOGIQUE ET DE MISE À JOUR
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
    let scoreEl = document.getElementById("scoreDisplay") || document.getElementById("score");
    let lvlEl = document.getElementById("niveauDisplay") || document.getElementById("level");
    let livesEl = document.getElementById("viesDisplay") || document.getElementById("lives") || document.getElementById("livesDisplay");

    if (scoreEl) scoreEl.innerText = score;
    if (lvlEl) lvlEl.innerText = (currentLevelIndex + 1); 
    if (livesEl) livesEl.innerText = lives;
}

function getStartPos(map) {
    for(let r = map.length - 2; r > 0; r--) {
        for(let c = 1; c < map[r].length - 1; c++) {
            if (map[r][c] === 0 || map[r][c] === 2) return { x: c * tileSize, y: r * tileSize };
        }
    }
    return { x: 12 * tileSize, y: 20 * tileSize };
}

// Nouvelle fonction dédiée pour repositionner les acteurs SANS recharger la carte
function respawnActors() {
    let pos = getStartPos(currentMap);
    pacman.x = pos.x;
    pacman.y = pos.y;
    pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    
    ghosts.forEach((g, idx) => {
        g.x = (11 + (idx % 3)) * tileSize;
        g.y = 10 * tileSize;
        g.dx = (idx % 2 === 0) ? 2 : -2;
        g.dy = 0;
    });

    frightenedTimer = 0;
    pacman.baseSpeed = currentLevelIndex >= 2 ? 4 : 2; 
    pacman.currentSpeed = pacman.baseSpeed;
}

// Utilisé uniquement au tout début ou lors d'un changement de niveau complet
function initLevel() {
    currentMap = JSON.parse(JSON.stringify(allLevels[currentLevelIndex]));
    dotsEaten = 0;
    totalDots = countTotalDots();
    respawnActors();
    updateUI();
}

function setupMobileControls() {
    if (!document.getElementById('btn-up')) {
        const mobileCtrl = document.createElement('div');
        mobileCtrl.style.textAlign = 'center';
        mobileCtrl.style.margin = '15px auto';
        mobileCtrl.style.maxWidth = '200px';
        mobileCtrl.innerHTML = `
            <button id="btn-up" style="width:60px; height:45px; margin:5px; font-weight:bold; font-size:18px;">▲</button><br>
            <button id="btn-left" style="width:60px; height:45px; margin:5px; font-weight:bold; font-size:18px;">◀</button>
            <button id="btn-down" style="width:60px; height:45px; margin:5px; font-weight:bold; font-size:18px;">▼</button>
            <button id="btn-right" style="width:60px; height:45px; margin:5px; font-weight:bold; font-size:18px;">▶</button>
        `;
        if (canvas && canvas.parentNode) canvas.parentNode.insertBefore(mobileCtrl, canvas.nextSibling);
    }

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

function triggerScreamer() {
    const overlay = document.getElementById('screamer-overlay');
    const sound = document.getElementById('scream-sound');
    if (overlay && sound) {
        sound.currentTime = 0; 
        overlay.style.display = 'flex'; 
        sound.play().catch(err => console.log(err));
        setTimeout(() => {
            overlay.style.display = 'none';
            resetEntireGame();
        }, 2500);
    } else {
        setTimeout(resetEntireGame, 2500);
    }
}

function resetEntireGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    gameWon = false;
    currentLevelIndex = 0;
    initLevel();
}

function update() {
    if (gameOver || gameWon) return;

    if (frightenedTimer > 0) frightenedTimer -= 16.66; 

    // Animation bouche
    if (pacman.dx !== 0 || pacman.dy !== 0) {
        mouthAngle += mouthSpeed;
        if (mouthAngle > 0.4 || mouthAngle < 0.05) {
            mouthSpeed = -mouthSpeed;
        }
    }

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

    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.x >= canvas.width) pacman.x = 0;

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

    ghosts.forEach(g => {
        let ghostSpeed = currentLevelIndex >= 2 ? 4 : 2; 
        
        if (frightenedTimer > 0) {
            if (g.type === "troll") ghostSpeed = 4; 
            else if (g.type !== "boss") ghostSpeed = 1; 
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

        let distance = Math.hypot((g.x + tileSize/2) - (pacman.x + tileSize/2), (g.y + tileSize/2) - (pacman.y + tileSize/2));
        if (distance < tileSize * 0.7) {
            if (frightenedTimer > 0 && g.type !== "boss" && g.type !== "troll") {
                score += 200;
                g.x = 12 * tileSize;
                g.y = 11 * tileSize;
                updateUI();
            } else {
                lives--;
                updateUI();
                if (lives <= 0) {
                    gameOver = true;
                    triggerScreamer(); 
                } else {
                    // CORRECTION : On repositionne les acteurs au point de départ sans toucher à la map !
                    respawnActors(); 
                }
            }
        }
    });
}

// ==========================================
// RENDU GRAPHIQUE ORIGINAL RESTAURÉ
// ==========================================

function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    
    // Rotation en fonction de la direction
    if (pacman.dx > 0) ctx.rotate(0);
    else if (pacman.dx < 0) ctx.rotate(Math.PI);
    else if (pacman.dy > 0) ctx.rotate(Math.PI / 2);
    else if (pacman.dy < 0) ctx.rotate(-Math.PI / 2);

    ctx.beginPath();
    // Dessin en forme de camembert (bouche animée)
    ctx.arc(0, 0, (tileSize / 2) - 1, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawGhosts() {
    ghosts.forEach(g => {
        let x = g.x;
        let y = g.y;
        let r = (tileSize / 2) - 1;

        ctx.beginPath();
        // Choix de la couleur selon l'état de vulnérabilité
        if (frightenedTimer > 0) {
            if (g.type === "troll") ctx.fillStyle = "#FF0000"; 
            else if (g.type !== "boss") ctx.fillStyle = "blue"; 
            else ctx.fillStyle = g.color; 
        } else {
            ctx.fillStyle = g.color;
        }

        // Tête bombée et corps du fantôme classique
        ctx.arc(x + tileSize / 2, y + tileSize / 2, r, Math.PI, 0, false);
        ctx.lineTo(x + tileSize - 1, y + tileSize);
        // Vagues en bas du drap
        ctx.lineTo(x + tileSize - 1 - (r/2), y + tileSize - 3);
        ctx.lineTo(x + tileSize - 1 - r, y + tileSize);
        ctx.lineTo(x + r, y + tileSize - 3);
        ctx.lineTo(x + 1, y + tileSize);
        ctx.closePath();
        ctx.fill();

        // Yeux blancs (toujours visibles, regardent vers leur axe dx/dy)
        let eyeOffsetDx = g.dx > 0 ? 1 : g.dx < 0 ? -1 : 0;
        let eyeOffsetDy = g.dy > 0 ? 1 : g.dy < 0 ? -1 : 0;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + 6 + eyeOffsetDx, y + 7 + eyeOffsetDy, 3, 0, 2 * Math.PI);
        ctx.arc(x + 14 + eyeOffsetDx, y + 7 + eyeOffsetDy, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Pupilles bleues ou noires
        ctx.fillStyle = frightenedTimer > 0 && g.type !== "boss" ? "orange" : "blue";
        ctx.beginPath();
        ctx.arc(x + 6 + eyeOffsetDx * 1.5, y + 7 + eyeOffsetDy * 1.5, 1.5, 0, 2 * Math.PI);
        ctx.arc(x + 14 + eyeOffsetDx * 1.5, y + 7 + eyeOffsetDy * 1.5, 1.5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawMap() {
    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            let item = currentMap[r][c];
            if (item === 1) {
                // Style rétro : Murs bleus foncés avec bordures/doublures plus claires
                ctx.fillStyle = "#0d0d8a";
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.strokeStyle = "#1919b3";
                ctx.lineWidth = 2;
                ctx.strokeRect(c * tileSize + 2, r * tileSize + 2, tileSize - 4, tileSize - 4);
            } else if (item === 0) {
                // Billes standards d'origine (jaune/rose pastel)
                ctx.fillStyle = "#ffb8ae"; 
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 2.5, 0, 2 * Math.PI);
                ctx.fill();
            } else if (item === 3) {
                // Super-billes clignotantes blanches
                ctx.fillStyle = "white"; 
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 6, 0, 2 * Math.PI);
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
