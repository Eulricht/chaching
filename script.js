const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playerXCard = document.getElementById("card-x");
const playerOCard = document.getElementById("card-o");

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

function createBoard() {
  boardElement.innerHTML = "";

  boardState.forEach((value, index) => {
    const button = document.createElement("button");
    button.className = "cell";
    button.type = "button";
    button.dataset.index = index;
    button.textContent = value;
    button.disabled = Boolean(value) || gameOver;

    if (value) {
      button.classList.add(value.toLowerCase());
    }

    if (winningCells.includes(index)) {
      button.classList.add("win");
    }

    button.addEventListener("click", handleMove);
    boardElement.appendChild(button);
  });

  updateActivePlayerCard();
}

function handleMove(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (boardState[index] || gameOver) {
    return;
  }

  boardState[index] = currentPlayer;

  const winner = getWinner();
  if (winner) {
    gameOver = true;
    winningCells = winner.line;
    statusElement.textContent = `Player ${winner.player} wins`;
  } else if (boardState.every(Boolean)) {
    gameOver = true;
    statusElement.textContent = "Draw";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }

  createBoard();
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

function resetGame() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  winningCells = [];
  statusElement.textContent = "Player X's turn";
  createBoard();
}

resetButton.addEventListener("click", resetGame);
createBoard();
