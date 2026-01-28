import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ImportState =
  | "idle"
  | "loading-libs"
  | "capturing"
  | "processing"
  | "reviewing";

export interface RecognizedCell {
  value: number; // 0 = empty, 1-9 = digit
  confidence: number; // 0-1
}

export interface ImportSliceState {
  importState: ImportState;
  importProgress: number; // 0-100
  recognizedDigits: RecognizedCell[] | null; // 81 cells when processing complete
}

const initialState: ImportSliceState = {
  importState: "idle",
  importProgress: 0,
  recognizedDigits: null,
};

export const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    setImportState: (state, action: PayloadAction<ImportState>) => {
      state.importState = action.payload;
    },

    setImportProgress: (state, action: PayloadAction<number>) => {
      state.importProgress = Math.min(100, Math.max(0, action.payload));
    },

    setRecognizedDigits: (
      state,
      action: PayloadAction<RecognizedCell[] | null>,
    ) => {
      state.recognizedDigits = action.payload;
    },

    resetImport: () => initialState,
  },
});

export const {
  setImportState,
  setImportProgress,
  setRecognizedDigits,
  resetImport,
} = importSlice.actions;

export default importSlice.reducer;
