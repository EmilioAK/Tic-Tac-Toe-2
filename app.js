var _ = require('lodash');

const ticTacToe = (function() {
  let board = [];
  const metadata = {};
    
  const reset = () => {
    board = Array.from(Array(9), x => null);
    metadata = {
      whosTurn: 0,
      winner: null
    };
  }

  reset();

  const rows = () => _.chunk(board, 3);
  
  const rowWon = (theseRows = rows()) => theseRows.some(row => row.every(cell => cell === row[0] && cell != null));

  const columnWon = () => rowWon(_.zip(...rows()));

  const diagonalWon = () => {
    const firstDiagonal = _.range(3).map(i => rows()[i][i]);
    const secondDiagonal = _.range(3).map(i => rows().reverse()[i][i]);
    return rowWon([firstDiagonal, secondDiagonal])
  };

  const gameOver = () => rowWon() || columnWon() || diagonalWon();

  const incrementTurn = () => {metadata.whosTurn = (metadata.whosTurn + 1) % 2};

  const place = (index) => {
    board[index] = metadata.whosTurn;
    if (gameOver()) {
      metadata.winner = metadata.whosTurn;
    }
    incrementTurn();
  }

  return { place, reset, board, metadata };
})();
