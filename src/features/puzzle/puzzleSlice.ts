import { createSlice, current, type PayloadAction } from "@reduxjs/toolkit";
import type { Board, Cell, Direction, Mode, PuzzleState } from "@/types/puzzle";
import checkEntry from "@/services/CheckEntry";

const emptyCell: Cell = {
  val: 0,
  fixedVal: 0,
  notes: [],
  selected: false,
  error: false,
};

const createEmptyBoard = (): Board =>
  [...Array(9).keys()].map(() =>
    [...Array(9).keys()].map(() => ({
      ...emptyCell,
      notes: [],
    })),
  );

const initialState: PuzzleState = {
  board: createEmptyBoard(),
  locked: false,
  selectedCells: [],
  mode: "setup",
  isDragging: false,
  clock: 0,
  paused: false,
  history: [],
};

const MAX_HISTORY = 50;

const cloneBoard = (board: Board): Board =>
  board.map((row) => row.map((cell) => ({ ...cell, notes: [...cell.notes] })));

const nextCell = (
  row: number,
  col: number,
  direction: Direction,
): { row: number; col: number } => {
  switch (direction) {
    case "Up":
      return { row: row === 0 ? 8 : row - 1, col };
    case "Down":
      return { row: row === 8 ? 0 : row + 1, col };
    case "Left":
      return { row, col: col === 0 ? 8 : col - 1 };
    case "Right":
      return { row, col: col === 8 ? 0 : col + 1 };
    default:
      return { row, col };
  }
};

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
    },

    setCellValue: (
      state,
      action: PayloadAction<{ row: number; col: number; value: number }>,
    ) => {
      const { row, col, value } = action.payload;
      state.board[row][col].val = value;
    },

    selectCell: (
      state,
      action: PayloadAction<{ row: number; col: number }>,
    ) => {
      const { row, col } = action.payload;
      if (!state.isDragging) {
        state.selectedCells.forEach(([r, c]) => {
          state.board[r][c].selected = false;
        });
        state.selectedCells = [[row, col]];
        state.board[row][col].selected = true;
      }
      if (state.isDragging) {
        state.board[row][col].selected = true;
        state.selectedCells.push([row, col]);
      }
    },

    setSelectedCellsValue: (state, action: PayloadAction<number>) => {
      // Save to history before making changes
      if (!state.history) state.history = [];
      state.history.push(cloneBoard(state.board));
      if (state.history.length > MAX_HISTORY) state.history.shift();

      for (const [row, col] of state.selectedCells) {
        if (state.locked) {
          if (state.board[row][col].fixedVal === 0) {
            const error = checkEntry(
              current(state).board,
              row,
              col,
              action.payload,
            );
            state.board[row][col].error = error;
            state.board[row][col].val = action.payload;
          }
        } else {
          state.board[row][col].fixedVal = action.payload;
        }
        // Clear notes
        state.board[row][col].notes = [];
      }
    },

    clearSelectedCells: (state) => {
      for (const [row, col] of state.selectedCells) {
        state.board[row][col].selected = false;
      }
      state.selectedCells = [];
    },

    setSelectedCellsNotes: (state, action: PayloadAction<number>) => {
      // Save to history before making changes
      if (!state.history) state.history = [];
      state.history.push(cloneBoard(state.board));
      if (state.history.length > MAX_HISTORY) state.history.shift();

      for (const [row, col] of state.selectedCells) {
        if (state.board[row][col].fixedVal > 0) {
          return;
        }
        // Toggle: remove if present, add if not
        if (state.board[row][col].notes.includes(action.payload)) {
          state.board[row][col].notes = state.board[row][col].notes.filter(
            (n) => n !== action.payload,
          );
        } else {
          state.board[row][col].notes.push(action.payload);
        }
        // Remove any value from cell when changing notes
        state.board[row][col].val = 0;
      }
    },

    move: (state, action: PayloadAction<Direction>) => {
      const direction = action.payload;
      // Unselect all cells apart from most recent
      const [lastRow, lastCol] =
        state.selectedCells[state.selectedCells.length - 1];
      for (const [r, c] of state.selectedCells) {
        state.board[r][c].selected = false;
      }
      state.selectedCells = [[lastRow, lastCol]];
      state.board[lastRow][lastCol].selected = false;
      // Determine next cell and select it
      const { row, col } = nextCell(lastRow, lastCol, direction);
      state.board[row][col].selected = true;
      state.selectedCells = [[row, col]];
    },

    lockBoard: (state) => {
      state.locked = true;
      state.mode = "normal";
      state.board.forEach((row) =>
        row.forEach((cell) => {
          cell.selected = false;
          cell.notes = [];
        }),
      );
    },

    changeMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },

    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },

    restart: (state) => {
      state.board.forEach((row) =>
        row.forEach((cell) => {
          cell.val = 0;
          cell.selected = false;
          cell.notes = [];
          cell.error = false;
        }),
      );
      state.clock = 0;
      state.paused = false;
      state.history = [];
    },

    reset: () => initialState,

    undo: (state) => {
      if (!state.history) state.history = [];
      const prev = state.history.pop();
      if (prev) {
        // Preserve selection state
        const selectedCells = state.selectedCells;
        state.board = prev;
        for (const [r, c] of selectedCells) {
          state.board[r][c].selected = true;
        }
      }
    },

    incrementClock: (state) => {
      state.clock += 1;
    },

    pause: (state) => {
      state.paused = true;
    },

    resume: (state) => {
      state.paused = false;
    },
  },
});

export const {
  setBoard,
  setCellValue,
  lockBoard,
  selectCell,
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsNotes,
  move,
  changeMode,
  restart,
  reset,
  undo,
  setDragging,
  incrementClock,
  pause,
  resume,
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
