import { describe, it, expect } from "vitest";
import importReducer, {
  setImportState,
  setImportProgress,
  setRecognizedDigits,
  resetImport,
  type ImportSliceState,
} from "./importSlice";

describe("importSlice", () => {
  const initialState: ImportSliceState = {
    importState: "idle",
    importProgress: 0,
    recognizedDigits: null,
  };

  it("should return initial state", () => {
    expect(importReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("setImportState", () => {
    it("should update importState", () => {
      const result = importReducer(initialState, setImportState("loading-libs"));
      expect(result.importState).toBe("loading-libs");
    });

    it("should cycle through all states", () => {
      let state = initialState;
      state = importReducer(state, setImportState("loading-libs"));
      expect(state.importState).toBe("loading-libs");

      state = importReducer(state, setImportState("capturing"));
      expect(state.importState).toBe("capturing");

      state = importReducer(state, setImportState("processing"));
      expect(state.importState).toBe("processing");

      state = importReducer(state, setImportState("reviewing"));
      expect(state.importState).toBe("reviewing");
    });
  });

  describe("setImportProgress", () => {
    it("should update progress", () => {
      const result = importReducer(initialState, setImportProgress(50));
      expect(result.importProgress).toBe(50);
    });

    it("should clamp progress to 0-100", () => {
      let result = importReducer(initialState, setImportProgress(-10));
      expect(result.importProgress).toBe(0);

      result = importReducer(initialState, setImportProgress(150));
      expect(result.importProgress).toBe(100);
    });
  });

  describe("setRecognizedDigits", () => {
    it("should set recognized digits", () => {
      const digits = [
        { value: 5, confidence: 0.95 },
        { value: 0, confidence: 1 },
        { value: 3, confidence: 0.8 },
      ];
      const result = importReducer(initialState, setRecognizedDigits(digits));
      expect(result.recognizedDigits).toEqual(digits);
    });

    it("should allow setting null", () => {
      const stateWithDigits: ImportSliceState = {
        ...initialState,
        recognizedDigits: [{ value: 1, confidence: 0.9 }],
      };
      const result = importReducer(stateWithDigits, setRecognizedDigits(null));
      expect(result.recognizedDigits).toBeNull();
    });
  });

  describe("resetImport", () => {
    it("should reset to initial state", () => {
      const modifiedState: ImportSliceState = {
        importState: "reviewing",
        importProgress: 75,
        recognizedDigits: [{ value: 1, confidence: 0.9 }],
      };
      const result = importReducer(modifiedState, resetImport());
      expect(result).toEqual(initialState);
    });
  });
});
