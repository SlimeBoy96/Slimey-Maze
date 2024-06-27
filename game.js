const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const winScreen = document.getElementById('winScreen');
const replayButton = document.getElementById('replayButton');
const nextLevelButton = document.getElementById('nextLevelButton');

const tileSize = 50;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let maze = [];
let player = { x: 1, y: 1 };
let level = 1;
let goal = { x: cols - 2, y: rows - 2 };

function initMaze() {
    maze = Array.from({ length: rows }, () => Array(cols).fill(1));
}

function carveMaze(x, y) {
    const directions = [
        [0, -1], // up
        [1, 0],  // right
        [0, 1],  // down
        [-1, 0]  // left
    ];

    directions.sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && maze[ny][nx] === 1) {
            maze[ny][nx] = 0;
            maze[y + dy][x + dx] = 0;
            carveMaze(nx, ny);
        }
    }
}

function generateMaze() {
    initMaze();
    maze[1][1] = 0;
    carveMaze(1, 1);
}

function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                ctx.clearRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw goal
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function movePlayer(dx, dy) {
    if (maze[player.y + dy][player.x + dx] === 0) {
        player.x += dx;
        player.y += dy;
        drawMaze();
        drawPlayer();
        checkWin();
    }
}

function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        winScreen.classList.remove('hidden');
    }
}

function resetGame() {
    player = { x: 1, y: 1 };
    generateMaze();
    drawMaze();
    drawPlayer();
}

function nextLevel() {
    level++;
    goal = { x: cols - 2, y: rows - 2 };
    resetGame();
}

replayButton.addEventListener('click', function () {
    winScreen.classList.add('hidden');
    resetGame();
});

nextLevelButton.addEventListener('click', function () {
    winScreen.classList.add('hidden');
    nextLevel();
});

window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

resetGame();
