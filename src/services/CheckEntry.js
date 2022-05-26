const extractValues = (board) =>
  board.map((row) => row.map((cell) => cell.fixedVal || cell.val));

const existsInRow = (boardValues, row, val) => {
  return boardValues[row].includes(val);
};

const existsInCol = (boardValues, col, val) => {
  const colValues = boardValues.map((row) => row[col]);
  return colValues.includes(val);
};

const getSquare = (board, row, col) => {
  const square = [];
  const squareRow = Math.floor(row / 3) * 3;
  const squareCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      square.push(board[squareRow + i][squareCol + j]);
    }
  }
  return square;
};

const existInSquare = (board, row, col, val) => {
  const square = getSquare(board, row, col);
  return square.includes(val);
};

const checkEntry = (board, row, col, val) => {
  const boardValues = extractValues(board);

  return (
    existInSquare(boardValues, row, col, val) ||
    existsInRow(boardValues, row, val) ||
    existsInCol(boardValues, col, val)
  );
};

export default checkEntry;
