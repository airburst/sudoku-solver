import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";

interface ImportProgressProps {
  message?: string;
}

const ImportProgress = ({
  message = "Processing image...",
}: ImportProgressProps) => {
  const progress = useAppSelector((state) => state.import.importProgress);
  const importState = useAppSelector((state) => state.import.importState);

  const isLoadingLibs = importState === "loading-libs";
  const displayMessage = isLoadingLibs ? "Loading image tools..." : message;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg max-w-md w-full">
      <div className="flex items-center gap-3">
        {isLoadingLibs && (
          <Loader2 className="w-6 h-6 animate-spin text-fixed" />
        )}
        <h2 className="text-xl font-bold text-fixed">{displayMessage}</h2>
      </div>

      {isLoadingLibs ? (
        <p className="text-guess text-sm text-center">
          This may take a moment on first use...
        </p>
      ) : (
        <>
          <div className="w-full bg-btn rounded-full h-4 overflow-hidden">
            <div
              className="bg-selected h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-guess text-sm text-center">{progress}% complete</p>
        </>
      )}
    </div>
  );
};

export default ImportProgress;
