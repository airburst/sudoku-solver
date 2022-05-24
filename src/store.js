import { configureStore } from "@reduxjs/toolkit";
import puzzleReducer from "./features/puzzle/puzzleSlice";

export const store = configureStore({
  reducer: {
    puzzle: puzzleReducer,
  },
});
