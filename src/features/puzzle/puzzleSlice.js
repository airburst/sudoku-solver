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
    },
    lockBoard: (state) => {
      state.locked = true;
      state.board.map((row) => row.map((cell) => (cell.selected = false)));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCellValue, lockBoard, toggleCellSelected } =
  puzzleSlice.actions;

export default puzzleSlice.reducer;
