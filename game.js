const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
// TAILLE ADAPTÉE : 30 colonnes x 35 lignes
canvas.width = 30 * tileSize;
canvas.height = 35 * tileSize;

let score = 0;
let currentLevelIndex = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;

// VARIABLES DE JEU
let dotsEaten = 0;
let totalDots = 0;
let frightenedTimer = 0;
let frightenedDuration = 8000; 
let pacmanSpeedBonusActive = false;
let pacmanSpeedBonusTimer = 0;

// ENCODAGE DES MAPS GÉANTES (30x35)
const map1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const map2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,3,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,4,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,4,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,3,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,3,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const map3 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,3,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const map4 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,3,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,3,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const map5 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const allLevels = [map1, map2, map3, map4, map5];
let currentMap = JSON.parse(JSON.stringify(allLevels[currentLevelIndex]));

// ENTITÉS
let pacman = { x: 14 * tileSize, y: 26 * tileSize, dx: 0, dy: 0, nextDx: 0, nextDy: 0, baseSpeed: 2, currentSpeed: 2 };

let ghosts = [
    { x: 12 * tileSize, y: 17 * tileSize, color: "red", dx: tileSize, dy: 0, type: "normal" },
    { x: 13 * tileSize, y: 17 * tileSize, color: "pink", dx: -tileSize, dy: 0, type: "normal" },
    { x: 15 * tileSize, y: 17 * tileSize, color: "cyan", dx: 0, dy: -tileSize, type: "normal" },
    { x: 16 * tileSize, y: 17 * tileSize, color: "orange", dx: 0, dy: -tileSize, type: "normal" },
    { x: 14 * tileSize, y: 16 * tileSize, color: "#8B0000", dx: tileSize, dy: 0, type: "boss" }
];

function initLevel() {
    currentMap = JSON.parse(JSON.stringify(allLevels[currentLevelIndex]));
    pacman.x = 14 * tileSize;
    pacman.y = 26 * tileSize;
    pacman.dx = 0; pacman.dy = 0; pacman.nextDx = 0; pacman.nextDy = 0;
    
    ghosts.forEach((g, idx) => {
        g.x = (12 + (idx % 5)) * tileSize;
        g.y = 17 * tileSize;
        g.dx = (idx % 2 === 0) ? tileSize : -tileSize;
        g.dy = 0;
    });

    dotsEaten = 0;
    totalDots = countTotalDots();
    frightenedTimer = 0;
    frightenedDuration = Math.max(3000, 9000 - (currentLevelIndex * 1500));
    
    pacman.baseSpeed = 2 + (currentLevelIndex * 0.2);
    pacman.currentSpeed = pacman.baseSpeed;

    document.getElementById("level").innerText = currentLevelIndex + 1;
}

function countTotalDots() {
    let count = 0;
    for(let r=0; r<currentMap.length; r++) {
        for(let c=0; c<currentMap[r].length; c++) {
            if(currentMap[r][c] === 0 || currentMap[r][c] === 3) count++;
        }
    }
    return count;
}

function changeDirection(dx, dy) {
    pacman.nextDx = dx;
    pacman.nextDy = dy;
}

window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection(0, -pacman.currentSpeed);
    if (e.key === "ArrowDown") changeDirection(0, pacman.currentSpeed);
    if (e.key === "ArrowLeft") changeDirection(-pacman.currentSpeed, 0);
    if (e.key === "ArrowRight") changeDirection(pacman.currentSpeed, 0);
});

// Mobile inputs
document.getElementById("btn-up").addEventListener("touchstart", () => changeDirection(0, -pacman.currentSpeed));
document.getElementById("btn-down").addEventListener("touchstart", () => changeDirection(0, pacman.currentSpeed));
document.getElementById("btn-left").addEventListener("touchstart", () => changeDirection(-pacman.currentSpeed, 0));
document.getElementById("btn-right").addEventListener("touchstart", () => changeDirection(pacman.currentSpeed, 0));

function isWall(x, y) {
    let cellX = Math.floor(x / tileSize);
    let cellY = Math.floor(y / tileSize);
    
    if (cellX < 0 || cellX >= 30) return false;
    if (cellY < 0 || cellY >= 35) return true;

    return currentMap[cellY][cellX] === 1;
}

function update() {
    if (gameOver || gameWon) return;

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
    }

    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.x >= canvas.width) pacman.x = 0;

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
            pacman.currentSpeed = pacman.baseSpeed * 1.5;
        }
    }

    document.getElementById("score").innerText = score;

    if (dotsEaten >= totalDots) {
        if (currentLevelIndex < allLevels.length - 1) {
            currentLevelIndex++;
            initLevel();
        } else {
            gameWon = true;
        }
    }

    ghosts.forEach(g => {
        let ghostSpeed = 2 + (currentLevelIndex * 0.3);
        if (frightenedTimer > 0 && g.type !== "boss") {
            ghostSpeed = 1.2;
        }
        if (g.type === "boss") {
            ghostSpeed *= 1.25;
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

        let distance = Math.hypot((g.x + tileSize/2) - (pacman.x + tileSize/2), (g.y + tileSize/2) - (pacman.y + tileSize/2));
        if (distance < tileSize * 0.8) {
            if (frightenedTimer > 0 && g.type !== "boss") {
                score += 200;
                g.x = 14 * tileSize;
                g.y = 17 * tileSize;
            } else {
                lives--;
                document.getElementById("lives").innerText = lives;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < currentMap.length; r++) {
        for (let c = 0; c < currentMap[r].length; c++) {
            if (currentMap[r][c] === 1) {
                ctx.fillStyle = "#111199";
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.strokeStyle = "#000055";
                ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
            } else if (currentMap[r][c] === 0) {
                ctx.fillStyle = "#ffb8ae";
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (currentMap[r][c] === 3) {
                if (Math.floor(Date.now() / 200) % 2 === 0) {
                    ctx.fillStyle = "#ffb8ff";
                    ctx.beginPath();
                    ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 7, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (currentMap[r][c] === 4) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/3, r * tileSize + tileSize * 0.6, 5, 0, Math.PI * 2);
                ctx.arc(c * tileSize + tileSize * 0.7, r * tileSize + tileSize * 0.6, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "green";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(c * tileSize + tileSize/2, r * tileSize + 2);
                ctx.lineTo(c * tileSize + tileSize/3, r * tileSize + tileSize * 0.6);
                ctx.stroke();
            }
        }
    }

    ctx.fillStyle = pacmanSpeedBonusActive ? "#00FFFF" : "#FFFF00";
    ctx.beginPath();
    ctx.arc(pacman.x + tileSize/2, pacman.y + tileSize/2, tileSize/2 - 1, 0.2 * Math.PI, 1.8 * Math.PI); 
    ctx.lineTo(pacman.x + tileSize/2, pacman.y + tileSize/2);
    ctx.fill();

    ghosts.forEach(g => {
        if (frightenedTimer > 0 && g.type !== "boss") {
            ctx.fillStyle = (frightenedTimer < 2000 && Math.floor(Date.now() / 100) % 2 === 0) ? "white" : "blue";
        } else {
            ctx.fillStyle = g.color;
        }

        if (g.type === "boss") {
            ctx.shadowColor = "red";
            ctx.shadowBlur = 10;
            ctx.fillRect(g.x + 1, g.y + 1, tileSize - 2, tileSize - 2);
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = "yellow";
            ctx.fillRect(g.x + 4, g.y + 4, 4, 4);
            ctx.fillRect(g.x + 12, g.y + 4, 4, 4);
        } else {
            ctx.beginPath();
            ctx.arc(g.x + tileSize/2, g.y + tileSize/2, tileSize/2 - 1, Math.PI, 0, false);
            ctx.lineTo(g.x + tileSize - 1, g.y + tileSize);
            ctx.lineTo(g.x + 1, g.y + tileSize);
            ctx.fill();
        }
    });

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "30px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Ton pote a gagné cette fois...", canvas.width/2, canvas.height/2 + 40);
    }
    if (gameWon) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "lime";
        ctx.font = "30px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText("VICTOIRE ULTIME !", canvas.width/2, canvas.height/2);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Là, il ne pourra jamais te battre.", canvas.width/2, canvas.height/2 + 40);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Lancement
initLevel();
gameLoop();
