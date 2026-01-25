import type { Board, BoardValues } from "@/types/puzzle";

/**
 * Extract numeric values from the board (fixedVal takes precedence over val)
 */
const extractValues = (board: Board): BoardValues =>
  board.map((row) => row.map((cell) => cell.fixedVal || cell.val));

/**
 * Check if value exists in the given row
 */
const existsInRow = (
  boardValues: BoardValues,
  row: number,
  val: number,
): boolean => {
  return boardValues[row].includes(val);
};

/**
 * Check if value exists in the given column
 */
const existsInCol = (
  boardValues: BoardValues,
  col: number,
  val: number,
): boolean => {
  const colValues = boardValues.map((row) => row[col]);
  return colValues.includes(val);
};

/**
 * Get all values in a 3x3 box containing the given cell
 */
const getSquare = (board: BoardValues, row: number, col: number): number[] => {
  const square: number[] = [];
  const squareRow = Math.floor(row / 3) * 3;
  const squareCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      square.push(board[squareRow + i][squareCol + j]);
    }
  }
  return square;
};

/**
 * Check if value exists in the 3x3 box containing the given cell
 */
const existsInSquare = (
  board: BoardValues,
  row: number,
  col: number,
  val: number,
): boolean => {
  const square = getSquare(board, row, col);
  return square.includes(val);
};

/**
 * Check if entering a value at the given position would cause an error
 * (duplicate in row, column, or 3x3 box)
 *
 * @param board - The full puzzle board
 * @param row - Row index (0-8)
 * @param col - Column index (0-8)
 * @param val - Value to check (1-9)
 * @returns true if the entry would be an error, false if valid
 */
const checkEntry = (
  board: Board,
  row: number,
  col: number,
  val: number,
): boolean => {
  const boardValues = extractValues(board);

  return (
    existsInSquare(boardValues, row, col, val) ||
    existsInRow(boardValues, row, val) ||
    existsInCol(boardValues, col, val)
  );
};

export default checkEntry;
