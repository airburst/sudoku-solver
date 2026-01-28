import { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setImportState,
  setImportProgress,
  setRecognizedDigits,
  resetImport,
} from "@/features/import/importSlice";
import { loadLibraries, terminateWorker } from "@/services/ImportLoader";
import {
  detectGrid,
  imageDataFromDataUrl,
  GridDetectionError,
} from "@/services/GridDetector";
import { recognizeDigits } from "@/services/DigitRecognizer";
import CameraCapture from "./CameraCapture";
import ImportProgress from "./ImportProgress";

const ImportModal = () => {
  const dispatch = useAppDispatch();
  const importState = useAppSelector((state) => state.import.importState);
  const [error, setError] = useState<string | null>(null);

  // Store cells outside Redux (ImageData not serializable)
  const cellsRef = useRef<ImageData[] | null>(null);

  const handleCapture = useCallback(
    async (dataUrl: string) => {
      setError(null);

      try {
        // Load libraries
        dispatch(setImportState("loading-libs"));
        dispatch(setImportProgress(0));
        const { cv, tesseractWorker } = await loadLibraries();

        // Process image
        dispatch(setImportState("processing"));
        dispatch(setImportProgress(10));

        const imageData = await imageDataFromDataUrl(dataUrl);
        dispatch(setImportProgress(20));

        const { cells } = await detectGrid(imageData, cv);
        cellsRef.current = cells;
        dispatch(setImportProgress(40));

        // Run digit recognition
        const results = await recognizeDigits(
          cells,
          tesseractWorker,
          (ocrProgress) => {
            // Map OCR progress (0-100) to overall progress (40-95)
            const overall = 40 + Math.round(ocrProgress * 0.55);
            dispatch(setImportProgress(overall));
          },
        );

        dispatch(setRecognizedDigits(results));
        dispatch(setImportProgress(100));
        dispatch(setImportState("reviewing"));
      } catch (err) {
        console.error("Import error:", err);
        if (err instanceof GridDetectionError) {
          setError(err.message);
        } else {
          setError("Failed to process image. Please try again.");
        }
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
        // TODO Phase 5: ImportReview component
        <div className="bg-white p-4 rounded-lg">
          <p>Review component placeholder</p>
          <button onClick={handleCancel}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ImportModal;
