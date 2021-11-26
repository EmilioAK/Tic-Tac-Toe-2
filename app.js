const ticTacToe = (function() {
  let board = [];
  const metadata = {};
    
  const reset = () => {
    board = Array.from(Array(9), x => null);
    metadata.whosTurn = 0;
    metadata.winner = null;
  }

  reset();

  const getBoard = () => [...board];

  const getMetadata = () => Object.assign({}, metadata)

  const gameWon = () => {
    const rows = () => _.chunk(board, 3);
  
    const rowWon = (theseRows = rows()) => theseRows.some(row => row.every(cell => cell === row[0] && cell != null));

    const columnWon = () => rowWon(_.zip(...rows()));

    const diagonalWon = () => {
      const firstDiagonal = _.range(3).map(i => rows()[i][i]);
      const secondDiagonal = _.range(3).map(i => rows().reverse()[i][i]);
      return rowWon([firstDiagonal, secondDiagonal]);
    };
    return rowWon() || columnWon() || diagonalWon();
  };

  const tie = () => {
    return board.every(cell => cell != null) && !gameWon();
  };

  const incrementTurn = () => {metadata.whosTurn = (metadata.whosTurn + 1) % 2};

  const gameOver = () => {  // Supposed to be run whenever a win can happen, currenlty only when place() is run
    if (tie()) {
      metadata.winner = 'Tie';
    } else if (gameWon()) {
      metadata.winner = metadata.whosTurn;
    } else {
      incrementTurn();
    }
  };
  const place = (index) => {
    console.log(`place: ${index}`)
    board[index] = metadata.whosTurn;
    gameOver();
  }

  return { place, reset, getBoard, getMetadata };
})();


// ticTacToe.place(0)
// ticTacToe.place(8)
// ticTacToe.place(3)
// ticTacToe.place(2)
// ticTacToe.place(7)
// ticTacToe.place(5)
// ticTacToe.place(4)
// ticTacToe.place(6)
// ticTacToe.place(1)
// console.log(ticTacToe.getBoard())
// console.log(ticTacToe.getMetadata().winner)

// Game loop idea:
// Event listner on every cell
// Run place() on cell
// check winner every time
// problem: Decouples board from DOM

// Second idea:
// Event listner on every cell
// run place() on cell
// check winner
// Redraw dom to reflect board
// problem: still feels janky...

// Third idea
// Okay so we have an API above, and the below code here should send requests to it, and then draw the board after each request. Decoupled
// So clicking a cell should send a click request (place())
// After a place is run, the board should be drawn (below loop kind of works)
// The API tells us the winner, so if the winner is found the game should be terminated
// This seems like a good idea

const cells = document.getElementsByClassName('cell');
const winningMessage = document.getElementById('winningMessage');

for (let index = 0; index < cells.length; index++) {
  const cell = cells[index];
  cell.addEventListener('click', () => {
    ticTacToe.place(index);
    drawBoard();
    winner();
  });
}

function drawBoard() {
  for (let index = 0; index < ticTacToe.getBoard().length; index++) {
    const gameCell = ticTacToe.getBoard()[index];
    domCell = cells[index]

    domCell.innerHTML = '';
    if (gameCell === 0) { // Fix so that 0 and 1 have clearer meaning
      const circleDiv = document.createElement('div');
      circleDiv.className = 'circle';
      domCell.appendChild(circleDiv);
    } else if (gameCell === 1) {
      const crossDiv = document.createElement('div');
      crossDiv.className = 'cross';
      domCell.appendChild(crossDiv);
    }
  }
}

function winner() {
  const players = {
    0: 'Circle',
    1: 'Cross',
    'Tie': 'Tie'
  };
  winningPlayer = ticTacToe.getMetadata().winner;
  if (winningPlayer != null) {
    document.getElementById('winner').textContent = winningPlayer === 'Tie' ? 'Tie!' : `${players[winningPlayer]} won the game!`;
    winningMessage.style.display = 'flex';
  }
}

document.getElementById('restartButton').addEventListener('click', () => {
  ticTacToe.reset();
  winningMessage.style.display = 'none';
  drawBoard();
});