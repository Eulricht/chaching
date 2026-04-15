const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playerXCard = document.getElementById("card-x");
const playerOCard = document.getElementById("card-o");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawElement = document.getElementById("score-draw");
const moveCountElement = document.getElementById("move-count");
const streakLabelElement = document.getElementById("streak-label");
const roundLabelElement = document.getElementById("round-label");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let boardState = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let winningCells = [];
let lastMoveIndex = null;
let roundNumber = 1;
let scores = {
  X: 0,
  O: 0,
  draw: 0
};
let streak = {
  player: "",
  count: 0
};

function createBoard() {
  boardElement.innerHTML = "";

  boardState.forEach((value, index) => {
    const button = document.createElement("button");
    button.className = "cell";
    button.type = "button";
    button.dataset.index = index;
    button.disabled = Boolean(value) || gameOver;
    button.dataset.value = value;

    applyCellState(button, value, index, false);

    button.addEventListener("click", handleMove);
    boardElement.appendChild(button);
  });

  updateActivePlayerCard();
  updateHud();
}

function updateBoard() {
  const buttons = boardElement.querySelectorAll(".cell");

  buttons.forEach((button, index) => {
    const value = boardState[index];
    const previousValue = button.dataset.value || "";
    const shouldAnimateMark = !previousValue && Boolean(value);

    button.disabled = Boolean(value) || gameOver;
    button.dataset.value = value;
    applyCellState(button, value, index, shouldAnimateMark);
  });

  updateActivePlayerCard();
  updateHud();
}

function applyCellState(button, value, index, shouldAnimateMark) {
  button.classList.toggle("x", value === "X");
  button.classList.toggle("o", value === "O");
  button.classList.toggle("win", winningCells.includes(index));
  button.classList.toggle("last-move", lastMoveIndex === index);

  button.textContent = "";

  if (!value) {
    return;
  }

  const mark = document.createElement("span");
  mark.className = "mark";
  mark.textContent = value;

  if (shouldAnimateMark) {
    mark.classList.add("is-drawing");
  }

  button.appendChild(mark);
}

function handleMove(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (boardState[index] || gameOver) {
    return;
  }

  boardState[index] = currentPlayer;
  lastMoveIndex = index;

  const winner = getWinner();
  if (winner) {
    gameOver = true;
    winningCells = winner.line;
    scores[winner.player] += 1;
    updateStreak(winner.player);
    statusElement.textContent = `Player ${winner.player} wins`;
  } else if (boardState.every(Boolean)) {
    gameOver = true;
    scores.draw += 1;
    streak.player = "";
    streak.count = 0;
    statusElement.textContent = "Draw game";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }

  updateBoard();
}

function getWinner() {
  for (const [a, b, c] of winningLines) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return {
        player: boardState[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}

function updateActivePlayerCard() {
  playerXCard.classList.toggle("is-active", !gameOver && currentPlayer === "X");
  playerOCard.classList.toggle("is-active", !gameOver && currentPlayer === "O");
}

function updateHud() {
  const movesPlayed = boardState.filter(Boolean).length;

  if (scoreXElement) {
    scoreXElement.textContent = String(scores.X);
  }

  if (scoreOElement) {
    scoreOElement.textContent = String(scores.O);
  }

  if (scoreDrawElement) {
    scoreDrawElement.textContent = String(scores.draw);
  }

  if (moveCountElement) {
    moveCountElement.textContent = String(movesPlayed);
  }

  if (roundLabelElement) {
    roundLabelElement.textContent = `Round ${roundNumber}`;
  }

  if (streakLabelElement) {
    streakLabelElement.textContent = streak.count > 1 ? `${streak.player} x${streak.count}` : "None";
  }
}

function updateStreak(player) {
  if (streak.player === player) {
    streak.count += 1;
    return;
  }

  streak.player = player;
  streak.count = 1;
}

function resetGame() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  winningCells = [];
  lastMoveIndex = null;
  roundNumber += 1;
  statusElement.textContent = "Player X's turn";
  updateBoard();
}

resetButton.addEventListener("click", resetGame);
createBoard();
boardElement.classList.add("is-intro");
window.setTimeout(() => {
  boardElement.classList.remove("is-intro");
}, 900);
