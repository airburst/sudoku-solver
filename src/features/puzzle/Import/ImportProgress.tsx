import { useAppSelector } from "@/hooks/redux";

interface ImportProgressProps {
  message?: string;
}

const ImportProgress = ({
  message = "Processing image...",
}: ImportProgressProps) => {
  const progress = useAppSelector((state) => state.import.importProgress);
  const importState = useAppSelector((state) => state.import.importState);

  const displayMessage =
    importState === "loading-libs" ? "Loading image tools..." : message;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-fixed">{displayMessage}</h2>

      <div className="w-full bg-btn rounded-full h-4 overflow-hidden">
        <div
          className="bg-selected h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-guess text-sm text-center">{progress}% complete</p>
    </div>
  );
};

export default ImportProgress;
