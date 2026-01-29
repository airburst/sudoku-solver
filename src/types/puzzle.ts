/**
 * A single cell in the Sudoku puzzle
 */
export interface Cell {
  /** User-entered value (during solve mode), 0 = empty */
  val: number;
  /** Fixed/given value set during setup mode, 0 = empty */
  fixedVal: number;
  /** Notes (1-9), displayed in 3x3 grid */
  notes: number[];
  /** Whether this cell is currently selected */
  selected: boolean;
  /** Whether this cell has an error (duplicate in row/col/box) */
  error: boolean;
}

/**
 * 9x9 grid of cells
 */
export type Board = Cell[][];

/**
 * Mode for number entry
 * - "setup": Setting up the initial puzzle (enters fixedVal)
 * - "normal": Normal solve mode (enters val)
 * - "notes": Notes mode (displayed in 3x3 grid)
 */
export type Mode = "setup" | "normal" | "notes";

/**
 * Direction for keyboard navigation
 */
export type Direction = "Up" | "Down" | "Left" | "Right";

/**
 * Cell coordinates [row, col]
 */
export type CellCoords = [number, number];

/**
 * Full puzzle state managed by Redux
 */
export interface PuzzleState {
  /** 9x9 grid of cells */
  board: Board;
  /** Whether the puzzle is locked (in solve mode) */
  locked: boolean;
  /** Currently selected cells as [row, col] pairs */
  selectedCells: CellCoords[];
  /** Current entry mode */
  mode: Mode;
  /** Whether user is dragging to select multiple cells */
  isDragging: boolean;
  /** Timer in seconds */
  clock: number;
  /** Whether the game is paused */
  paused: boolean;
}

/**
 * A simple 9x9 grid of numbers (0 = empty, 1-9 = value)
 * Used by solver functions
 */
export type BoardValues = number[][];

/**
 * Root Redux state shape
 */
export interface RootState {
  puzzle: PuzzleState;
}
