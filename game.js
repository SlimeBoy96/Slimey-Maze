const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const replayButton = document.getElementById('replayButton');

const tileSize = 50;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let maze = [];
let player = { x: 1, y: 1 };
let apples = [];
let score = 0;
let timeLeft = 60;
let timerInterval;
let appleInterval;

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

function generateApple() {
    let apple = { x: 0, y: 0 };
    do {
        apple.x = Math.floor(Math.random() * cols);
        apple.y = Math.floor(Math.random() * rows);
    } while (maze[apple.y][apple.x] !== 0 || (apple.x === player.x && apple.y === player.y));
    apples.push(apple);
    drawMaze();
    drawPlayer();
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

    apples.forEach(apple => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(apple.x * tileSize + tileSize / 2, apple.y * tileSize + tileSize / 2, tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    });
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
        collectApple();
    }
}

function collectApple() {
    for (let i = 0; i < apples.length; i++) {
        if (player.x === apples[i].x && player.y === apples[i].y) {
            apples.splice(i, 1);
            score++;
            scoreDisplay.textContent = score;
            break;
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(appleInterval);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    alert(`Time's up! Your final score is: ${score}`);
    window.removeEventListener('keydown', handleKeydown); // Disable player movement after game over
    replayButton.style.display = 'block'; // Show the replay button
}

function handleKeydown(e) {
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
}

window.addEventListener('keydown', handleKeydown);

function resetGame() {
    player = { x: 1, y: 1 };
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    generateMaze();
    apples = [];
    drawMaze();
    drawPlayer();
    clearInterval(timerInterval);
    clearInterval(appleInterval);
    startTimer();
    appleInterval = setInterval(generateApple, 3000);
    replayButton.style.display = 'none'; // Hide the replay button
    window.addEventListener('keydown', handleKeydown); // Re-enable player movement
}

resetGame();

