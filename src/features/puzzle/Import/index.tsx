import { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setImportState,
  setImportProgress,
  resetImport,
} from "@/features/import/importSlice";
import { loadLibraries, terminateWorker } from "@/services/ImportLoader";
import {
  detectGrid,
  imageDataFromDataUrl,
  GridDetectionError,
} from "@/services/GridDetector";
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
        const { cv } = await loadLibraries();

        // Process image
        dispatch(setImportState("processing"));
        dispatch(setImportProgress(10));

        const imageData = await imageDataFromDataUrl(dataUrl);
        dispatch(setImportProgress(20));

        const { cells } = await detectGrid(imageData, cv);
        cellsRef.current = cells;
        dispatch(setImportProgress(50));

        // TODO Phase 4: Run digit recognition on cells
        // For now, go to reviewing state
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
