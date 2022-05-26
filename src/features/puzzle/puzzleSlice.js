import { createSlice, current } from "@reduxjs/toolkit";
import checkEntry from "../../services/CheckEntry";

const emptyCell = {
  val: 0,
  fixedVal: 0,
  pencilMarks: [],
  centreMarks: [],
  selected: false,
  error: false,
};

const emptyBoard = [...Array(9).keys()].map(() =>
  [...Array(9).keys()].map(() => emptyCell)
);

const initialState = {
  board: emptyBoard,
  locked: false,
  selectedCells: [],
  mode: "setup", // "normal" | "corner" | "centre"
  isDragging: false,
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
    setBoard: (state, action) => {
      state.board = action.payload;
    },
    setCellValue: (state, action) => {
      const { row, col, value } = action.payload;
      state.board[row][col].val = value;
    },
    selectCell: (state, action) => {
      const { row, col } = action.payload;
      if (!state.isDragging) {
        state.selectedCells.map(
          ([r, c]) => (state.board[r][c].selected = false)
        );
        state.selectedCells = [[row, col]];
        state.board[row][col].selected = true;
      }
      if (state.isDragging) {
        state.board[row][col].selected = true;
        state.selectedCells.push([row, col]);
      }
    },
    // Set the value in every selected cell
    setSelectedCellsValue: (state, action) => {
      for (const [row, col] of state.selectedCells) {
        if (state.locked) {
          if (state.board[row][col].fixedVal === 0) {
            const error = checkEntry(
              current(state).board,
              row,
              col,
              action.payload
            );
            state.board[row][col].error = error;
            state.board[row][col].val = action.payload;
          }
        } else {
          state.board[row][col].fixedVal = action.payload;
        }
        // Clear pencil marks and selected status
        state.board[row][col].pencilMarks = [];
        state.board[row][col].centreMarks = [];
      }
    },
    clearSelectedCells: (state) => {
      for (const [row, col] of state.selectedCells) {
        state.board[row][col].selected = false;
      }
      state.selectedCells = [];
    },
    setSelectedCellsPencilMarks: (state, action) => {
      const { mode } = state;
      const markType = mode === "centre" ? "centreMarks" : "pencilMarks";

      for (const [row, col] of state.selectedCells) {
        if (state.board[row][col].fixedVal > 0) {
          return;
        }
        // If the cell has the pencil mark, remove it
        if (state.board[row][col][markType].includes(action.payload)) {
          state.board[row][col][markType] = state.board[row][col][
            markType
          ].filter((mark) => mark !== action.payload);
        } else {
          state.board[row][col][markType].push(action.payload);
        }
        // Remove any value from cell when changing pencil marks
        state.board[row][col].val = 0;
      }
    },
    move: (state, action) => {
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
    // Put board into 'play' mode
    lockBoard: (state) => {
      state.locked = true;
      state.mode = "normal";
      state.board.map((row) =>
        row.forEach((cell) => {
          cell.selected = false;
          cell.pencilMarks = [];
          cell.centreMarks = [];
        })
      );
    },
    changeMode: (state, action) => {
      state.mode = action.payload;
    },
    setDragging: (state, action) => {
      state.isDragging = action.payload;
    },
    restart: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  setBoard,
  setCellValue,
  lockBoard,
  selectCell,
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
  move,
  changeMode,
  restart,
  setDragging,
} = puzzleSlice.actions;

export default puzzleSlice.reducer;
