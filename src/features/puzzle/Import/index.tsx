import { useCallback, useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setImportState,
  setImportProgress,
  setRecognizedDigits,
  resetImport,
} from "@/features/import/importSlice";
import { setBoard } from "@/features/puzzle/puzzleSlice";
import { loadLibraries, terminateWorker } from "@/services/ImportLoader";
import {
  detectGrid,
  imageDataFromDataUrl,
  GridDetectionError,
} from "@/services/GridDetector";
import { recognizeDigits } from "@/services/DigitRecognizer";
import CameraCapture from "./CameraCapture";
import ImportProgress from "./ImportProgress";
import ImportReview from "./ImportReview";
import type { Board } from "@/types/puzzle";

const ImportModal = () => {
  const dispatch = useAppDispatch();
  const importState = useAppSelector((state) => state.import.importState);
  const [error, setError] = useState<string | null>(null);

  // Store cells outside Redux (ImageData not serializable)
  const cellsRef = useRef<ImageData[] | null>(null);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      cellsRef.current = null;
      terminateWorker();
    };
  }, []);

  const handleCapture = useCallback(
    async (dataUrl: string) => {
      setError(null);
      console.log("[Import] Starting capture processing...");

      try {
        // Load libraries
        console.log("[Import] Loading libraries...");
        dispatch(setImportState("loading-libs"));
        dispatch(setImportProgress(0));
        const { cv, tesseractWorker } = await loadLibraries();
        console.log("[Import] Libraries loaded");

        // Process image
        console.log("[Import] Processing image...");
        dispatch(setImportState("processing"));
        dispatch(setImportProgress(10));

        console.log("[Import] Converting dataUrl to ImageData...");
        const imageData = await imageDataFromDataUrl(dataUrl);
        console.log("[Import] ImageData created:", imageData.width, "x", imageData.height);
        dispatch(setImportProgress(20));

        console.log("[Import] Detecting grid...");
        const { cells } = await detectGrid(imageData, cv);
        console.log("[Import] Grid detected, cells:", cells.length);
        cellsRef.current = cells;
        dispatch(setImportProgress(40));

        // Run digit recognition
        console.log("[Import] Starting digit recognition...");
        const results = await recognizeDigits(
          cells,
          tesseractWorker,
          (ocrProgress) => {
            // Map OCR progress (0-100) to overall progress (40-95)
            const overall = 40 + Math.round(ocrProgress * 0.55);
            dispatch(setImportProgress(overall));
          },
        );
        console.log("[Import] Digit recognition complete");

        dispatch(setRecognizedDigits(results));
        dispatch(setImportProgress(100));
        dispatch(setImportState("reviewing"));
        console.log("[Import] Processing complete, showing review");
      } catch (err) {
        console.error("[Import] Error:", err);

        // Provide specific error messages
        let errorMessage = "Failed to process image. Please try again.";
        if (err instanceof GridDetectionError) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          if (err.message.includes("load")) {
            errorMessage = "Failed to load image processing tools. Check your connection and try again.";
          } else if (err.message.includes("memory") || err.message.includes("Memory")) {
            errorMessage = "Not enough memory to process image. Try a smaller image.";
          }
        }

        setError(errorMessage);
        dispatch(setImportState("capturing"));
      }
    },
    [dispatch],
  );

  const handleCancel = useCallback(async () => {
    cellsRef.current = null;
    setError(null);
    await terminateWorker();
    dispatch(resetImport());
  }, [dispatch]);

  const handleConfirm = useCallback(
    async (digits: number[]) => {
      // Convert flat array of digits to Board format
      const board: Board = [];
      for (let row = 0; row < 9; row++) {
        const rowCells = [];
        for (let col = 0; col < 9; col++) {
          const index = row * 9 + col;
          rowCells.push({
            val: 0,
            fixedVal: digits[index],
            pencilMarks: [],
            centreMarks: [],
            selected: false,
            error: false,
          });
        }
        board.push(rowCells);
      }

      // Set the board and reset import state
      dispatch(setBoard(board));
      cellsRef.current = null;
      await terminateWorker();
      dispatch(resetImport());
    },
    [dispatch],
  );

  if (importState === "idle") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {importState === "capturing" && (
        <CameraCapture
          onCapture={handleCapture}
          onCancel={handleCancel}
          error={error}
        />
      )}

      {(importState === "loading-libs" || importState === "processing") && (
        <ImportProgress />
      )}

      {importState === "reviewing" && (
        <ImportReview onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default ImportModal;
