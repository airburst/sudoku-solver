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
      state.selectedCells = [];
      state.selectedCells.push([row, col]);
    },
    // Set the value in every selected cell
    setSelectedCellsValue: (state, action) => {
      for (const [row, col] of state.selectedCells) {
        if (state.locked) {
          state.board[row][col].val = action.payload;
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
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
