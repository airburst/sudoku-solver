import type { Board, BoardValues } from "@/types/puzzle";

type SolverBoard = number[][]; // 0 = empty, 1-9 = value

// Precomputed box index for each cell (0-8)
const BOX_INDEX = [
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
] as const;

// Precomputed cells for each box (0-8)
const BOX_CELLS: readonly [number, number][][] = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 3],
    [2, 4],
    [2, 5],
  ],
  [
    [0, 6],
    [0, 7],
    [0, 8],
    [1, 6],
    [1, 7],
    [1, 8],
    [2, 6],
    [2, 7],
    [2, 8],
  ],
  [
    [3, 0],
    [3, 1],
    [3, 2],
    [4, 0],
    [4, 1],
    [4, 2],
    [5, 0],
    [5, 1],
    [5, 2],
  ],
  [
    [3, 3],
    [3, 4],
    [3, 5],
    [4, 3],
    [4, 4],
    [4, 5],
    [5, 3],
    [5, 4],
    [5, 5],
  ],
  [
    [3, 6],
    [3, 7],
    [3, 8],
    [4, 6],
    [4, 7],
    [4, 8],
    [5, 6],
    [5, 7],
    [5, 8],
  ],
  [
    [6, 0],
    [6, 1],
    [6, 2],
    [7, 0],
    [7, 1],
    [7, 2],
    [8, 0],
    [8, 1],
    [8, 2],
  ],
  [
    [6, 3],
    [6, 4],
    [6, 5],
    [7, 3],
    [7, 4],
    [7, 5],
    [8, 3],
    [8, 4],
    [8, 5],
  ],
  [
    [6, 6],
    [6, 7],
    [6, 8],
    [7, 6],
    [7, 7],
    [7, 8],
    [8, 6],
    [8, 7],
    [8, 8],
  ],
];

/**
 * Get candidates for a cell using Set for O(1) lookups
 */
function getCandidates(board: SolverBoard, row: number, col: number): number[] {
  const used = new Set<number>();

  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] > 0) used.add(board[row][c]);
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] > 0) used.add(board[r][col]);
  }

  // Check box (O(9) instead of O(81))
  const box = BOX_INDEX[row][col];
  for (const [r, c] of BOX_CELLS[box]) {
    if (board[r][c] > 0) used.add(board[r][c]);
  }

  const candidates: number[] = [];
  for (let n = 1; n <= 9; n++) {
    if (!used.has(n)) candidates.push(n);
  }
  return candidates;
}

/**
 * Check if placing a value is valid
 */
function isValid(
  board: SolverBoard,
  row: number,
  col: number,
  num: number,
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // Check box
  const box = BOX_INDEX[row][col];
  for (const [r, c] of BOX_CELLS[box]) {
    if (board[r][c] === num) return false;
  }

  return true;
}

/**
 * Find the empty cell with the fewest candidates (MRV heuristic)
 * Returns null if no empty cells remain
 */
function findBestCell(
  board: SolverBoard,
): { row: number; col: number; candidates: number[] } | null {
  let best: { row: number; col: number; candidates: number[] } | null = null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const candidates = getCandidates(board, r, c);
        if (candidates.length === 0) {
          return { row: r, col: c, candidates: [] }; // Dead end
        }
        if (!best || candidates.length < best.candidates.length) {
          best = { row: r, col: c, candidates };
          if (candidates.length === 1) return best; // Can't do better
        }
      }
    }
  }

  return best;
}

/**
 * Clone a board efficiently
 */
function cloneBoard(board: SolverBoard): SolverBoard {
  return board.map((row) => [...row]);
}

/**
 * Apply constraint propagation to solve obvious cells
 * Uses naked singles and hidden singles strategies
 */
function propagate(board: SolverBoard): boolean {
  let progress = true;

  while (progress) {
    progress = false;

    // Naked singles: cells with only one candidate
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const candidates = getCandidates(board, r, c);

          if (candidates.length === 0) {
            return false; // Invalid state
          }

          if (candidates.length === 1) {
            board[r][c] = candidates[0];
            progress = true;
          }
        }
      }
    }

    // Hidden singles in rows
    for (let r = 0; r < 9; r++) {
      for (let num = 1; num <= 9; num++) {
        let count = 0;
        let lastCol = -1;
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === num) {
            count = 2;
            break;
          }
          if (board[r][c] === 0 && isValid(board, r, c, num)) {
            count++;
            lastCol = c;
          }
        }
        if (count === 1 && lastCol >= 0) {
          board[r][lastCol] = num;
          progress = true;
        }
      }
    }

    // Hidden singles in columns
    for (let c = 0; c < 9; c++) {
      for (let num = 1; num <= 9; num++) {
        let count = 0;
        let lastRow = -1;
        for (let r = 0; r < 9; r++) {
          if (board[r][c] === num) {
            count = 2;
            break;
          }
          if (board[r][c] === 0 && isValid(board, r, c, num)) {
            count++;
            lastRow = r;
          }
        }
        if (count === 1 && lastRow >= 0) {
          board[lastRow][c] = num;
          progress = true;
        }
      }
    }

    // Hidden singles in boxes
    for (let box = 0; box < 9; box++) {
      for (let num = 1; num <= 9; num++) {
        let count = 0;
        let lastPos: [number, number] | null = null;
        for (const [r, c] of BOX_CELLS[box]) {
          if (board[r][c] === num) {
            count = 2;
            break;
          }
          if (board[r][c] === 0 && isValid(board, r, c, num)) {
            count++;
            lastPos = [r, c];
          }
        }
        if (count === 1 && lastPos) {
          board[lastPos[0]][lastPos[1]] = num;
          progress = true;
        }
      }
    }
  }

  return true;
}

/**
 * Check if the board is completely solved
 */
function isSolved(board: SolverBoard): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}

/**
 * Solve using constraint propagation + backtracking with MRV heuristic
 */
function solve(board: SolverBoard): SolverBoard | null {
  // Apply constraint propagation first
  if (!propagate(board)) return null;

  if (isSolved(board)) return board;

  // Find the cell with fewest candidates (MRV)
  const best = findBestCell(board);

  if (!best || best.candidates.length === 0) {
    return null; // No solution
  }

  // Try each candidate
  for (const candidate of best.candidates) {
    const newBoard = cloneBoard(board);
    newBoard[best.row][best.col] = candidate;

    const result = solve(newBoard);
    if (result) return result;
  }

  return null;
}

/**
 * Extract numeric values from the board (fixedVal takes precedence over val)
 */
const extractValues = (board: Board): BoardValues =>
  board.map((row) => row.map((cell) => cell.fixedVal || cell.val));

/**
 * Insert solved values back into the board structure
 */
const insertValues = (board: Board, solution: BoardValues): Board =>
  board.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      pencilMarks: [],
      centreMarks: [],
      val: solution[r][c],
      error: false,
    })),
  );

/**
 * Solve the puzzle and return the completed board
 */
const solvePuzzle = (board: Board): Board | null => {
  const boardValues = extractValues(board);
  const solvedBoard = solve(boardValues);
  if (!solvedBoard) return null;
  return insertValues(board, solvedBoard);
};

export default solvePuzzle;

/**
 * Check if the board is completely and correctly solved
 */
export const checkBoard = (board: Board): boolean => {
  const boardValues = extractValues(board);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = boardValues[r][c];
      if (val < 1 || val > 9) return false;

      // Check this value doesn't conflict with others
      const temp = boardValues[r][c];
      boardValues[r][c] = 0;
      const valid = isValid(boardValues, r, c, temp);
      boardValues[r][c] = temp;
      if (!valid) return false;
    }
  }

  return true;
};
