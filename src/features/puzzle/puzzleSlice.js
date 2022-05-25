import { createSlice } from "@reduxjs/toolkit";

const emptyCell = {
  val: 0,
  fixedVal: 0,
  pencilMarks: [],
  selected: false,
};

const emptyBoard = [...Array(9).keys()].map(() =>
  [...Array(9).keys()].map(() => emptyCell)
);

const initialState = {
  board: emptyBoard,
  locked: false,
  selectedCells: [],
  mode: "normal", // | "corner" | "centre"
};

const nextCell = (row, col, direction) => {
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
    setCellValue: (state, action) => {
      const { row, col, value } = action.payload;
      state.board[row][col].val = value;
    },
    selectCell: (state, action) => {
      const { row, col } = action.payload;
      state.board[row][col].selected = true;
      // Empty selected cells array: TODO: Fix for drag
      state.selectedCells.map(([r, c]) => (state.board[r][c].selected = false));
      state.selectedCells = [[row, col]];
    },
    // Set the value in every selected cell
    setSelectedCellsValue: (state, action) => {
      for (const [row, col] of state.selectedCells) {
        if (state.locked) {
          if (state.board[row][col].fixedVal === 0) {
            state.board[row][col].val = action.payload;
          }
        } else {
          state.board[row][col].fixedVal = action.payload;
        }
        // Clear pencil marks and selected status
        state.board[row][col].pencilMarks = [];
      }
    },
    clearSelectedCells: (state) => {
      for (const [row, col] of state.selectedCells) {
        state.board[row][col].selected = false;
      }
      state.selectedCells = [];
    },
    setSelectedCellsPencilMarks: (state, action) => {
      for (const [row, col] of state.selectedCells) {
        // If the cell has the pencil mark, remove it
        if (state.board[row][col].pencilMarks.includes(action.payload)) {
          state.board[row][col].pencilMarks = state.board[row][
            col
          ].pencilMarks.filter((mark) => mark !== action.payload);
        } else {
          state.board[row][col].pencilMarks.push(action.payload);
        }
        // Remove any value from cell when changing pencil marks
        state.board[row][col].val = 0;
      }
    },
    move: (state, action) => {
      const direction = action.payload;
      // Unselect current cell
      const [r, c] = state.selectedCells[0];
      state.board[r][c].selected = false;
      // Determine next cell and select it
      const { row, col } = nextCell(r, c, direction);
      state.board[row][col].selected = true;
      state.selectedCells = [[row, col]];
    },
    // Put board into 'play' mode
    lockBoard: (state) => {
      state.locked = true;
      state.board.map((row) =>
        row.forEach((cell) => {
          cell.selected = false;
          cell.pencilMarks = [];
        })
      );
    },
    changeMode: (state, action) => {
      state.mode = action.payload;
    },
    restart: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  setCellValue,
  lockBoard,
  selectCell,
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
  move,
  changeMode,
  restart,
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
