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
    if (board[index] === null) {
      board[index] = metadata.whosTurn;
    }
    gameOver();
  }

  return { place, reset, getBoard, getMetadata };
})();

const cells = document.getElementsByClassName('cell');
const winningMessage = document.getElementById('winningMessage');

function render() {
  const players = {
    0: 'Circle',
    1: 'Cross',
    'Tie': 'Tie'
  };

  const drawBoard = (() => {
    for (let index = 0; index < ticTacToe.getBoard().length; index++) {
      const gameCell = ticTacToe.getBoard()[index];
      domCell = cells[index]
  
      domCell.innerHTML = '';
      if (gameCell === 0) {
        const circleDiv = document.createElement('div');
        circleDiv.className = 'circle';
        domCell.appendChild(circleDiv);
      } else if (gameCell === 1) {
        const crossDiv = document.createElement('div');
        crossDiv.className = 'cross';
        domCell.appendChild(crossDiv);
      }
    }
  })();

  const winnerDeclared = (() => {
    const winningPlayer = ticTacToe.getMetadata().winner;
    if (winningPlayer != null) {
      document.getElementById('winner').textContent = winningPlayer === 'Tie' ? 'Tie!' : `${players[winningPlayer]} won the game!`;
      winningMessage.style.display = 'flex';
    }
  })();
}

for (let index = 0; index < cells.length; index++) {
  const cell = cells[index];
  cell.addEventListener('click', () => {
    ticTacToe.place(index);
    render();
  });
}

document.getElementById('restartButton').addEventListener('click', () => {
  ticTacToe.reset();
  winningMessage.style.display = 'none';
  render();
});