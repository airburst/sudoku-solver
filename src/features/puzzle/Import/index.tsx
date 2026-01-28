import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setImportState, resetImport } from "@/features/import/importSlice";
import CameraCapture from "./CameraCapture";
import ImportProgress from "./ImportProgress";

const ImportModal = () => {
  const dispatch = useAppDispatch();
  const importState = useAppSelector((state) => state.import.importState);

  const handleCapture = useCallback(
    async (imageData: string) => {
      dispatch(setImportState("loading-libs"));

      // TODO Phase 3: Load libraries and process image
      // For now, just log the capture
      console.log("Image captured, length:", imageData.length);

      // Placeholder: simulate processing
      dispatch(setImportState("processing"));
    },
    [dispatch],
  );

  const handleCancel = useCallback(() => {
    dispatch(resetImport());
  }, [dispatch]);

  if (importState === "idle") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {importState === "capturing" && (
        <CameraCapture onCapture={handleCapture} onCancel={handleCancel} />
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
