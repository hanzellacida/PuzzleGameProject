const boardSize = 8;
const symbols = ['🍀', '🐱', '🧲', '🎋', '🔮']; // Lucky items
let board = [];
let firstSelected = null;
let score = 0;

const matchSound = document.getElementById('match-sound');
const backgroundMusic = document.getElementById('background-music');

function createBoard() {
    board = [];
    score = 0;
    updateScore(0);
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = {
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                element: document.createElement('div'),
            };
            cell.element.classList.add('cell');
            cell.element.innerHTML = cell.symbol;
            cell.element.addEventListener('click', () => selectCell(i, j));
            row.push(cell);
            boardElement.appendChild(cell.element);
        }
        board.push(row);
    }

    // Start background music when the game is created
    backgroundMusic.play();
    loadLeaderboard();
}

function selectCell(row, col) {
    const cell = board[row][col];
    if (firstSelected) {
        if (firstSelected === cell) {
            firstSelected.element.classList.remove('selected');
            firstSelected = null;
        } else {
            swapCells(firstSelected, cell);
            firstSelected.element.classList.remove('selected');
            firstSelected = null;
        }
    } else {
        firstSelected = cell;
        cell.element.classList.add('selected');
    }
}

function swapCells(cell1, cell2) {
    const tempSymbol = cell1.symbol;
    cell1.symbol = cell2.symbol;
    cell2.symbol = tempSymbol;

    cell1.element.innerHTML = cell1.symbol;
    cell2.element.innerHTML = cell2.symbol;

    checkMatch();
}

function checkMatch() {
    const toRemove = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = board[i][j];
            const rowMatch = checkRowMatch(i, j);
            const colMatch = checkColMatch(i, j);
            if (rowMatch.length >= 3) toRemove.push(...rowMatch);
            if (colMatch.length >= 3) toRemove.push(...colMatch);
        }
    }

    if (toRemove.length > 0) {
        toRemove.forEach(cell => {
            cell.element.classList.add('match');
        });

        setTimeout(() => {
            toRemove.forEach(cell => {
                cell.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                cell.element.innerHTML = cell.symbol;
                cell.element.classList.remove('match');
            });
            updateScore(toRemove.length);
            matchSound.play(); // Play match sound effect
        }, 500);
    }
}

function checkRowMatch(row, col) {
    const match = [board[row][col]];
    for (let i = col + 1; i < boardSize; i++) {
        if (board[row][i].symbol === board[row][col].symbol) {
            match.push(board[row][i]);
        } else {
            break;
        }
    }
    return match;
}

function checkColMatch(row, col) {
    const match = [board[row][col]];
    for (let i = row + 1; i < boardSize; i++) {
        if (board[i][col].symbol === board[row][col].symbol) {
            match.push(board[i][col]);
        } else {
            break;
        }
    }
    return match;
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = `Score: ${score}`;
}

document.getElementById('restart').addEventListener('click', () => {
    saveScore(score);
    createBoard();
});

function saveScore(newScore) {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(newScore);
    scores.sort((a, b) => b - a);
    localStorage.setItem('scores', JSON.stringify(scores.slice(0, 5)));
    loadLeaderboard();
}

function loadLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = scores.map(score => `<div>${score}</div>`).join('');
}

createBoard();
