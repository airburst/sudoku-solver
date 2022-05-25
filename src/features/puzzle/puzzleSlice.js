import { createSlice } from "@reduxjs/toolkit";

const emptyCell = {
  val: 0,
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
    toggleCellSelected: (state, action) => {
      const { row, col } = action.payload;
      state.board[row][col].selected = !state.board[row][col].selected;
      // Update selected cells array
      if (state.board[row][col].selected) {
        state.selectedCells.push([row, col]);
      } else {
        state.selectedCells = state.selectedCells.filter(
          ([r, c]) => r !== row || c !== col
        );
      }
    },
    // Set the value in every selected cell
    setSelectedCellsValue: (state, action) => {
      for (const [row, col] of state.selectedCells) {
        state.board[row][col].val = action.payload;
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
      state.board.map((row) => row.map((cell) => (cell.selected = false)));
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCellValue,
  lockBoard,
  toggleCellSelected,
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
