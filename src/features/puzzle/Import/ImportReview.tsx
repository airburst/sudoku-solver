import { useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/hooks/redux";
import Button from "@/components/Button";

interface ImportReviewProps {
  onConfirm: (digits: number[]) => void;
  onCancel: () => void;
}

const LOW_CONFIDENCE_THRESHOLD = 0.7;

const ImportReview = ({ onConfirm, onCancel }: ImportReviewProps) => {
  const recognizedDigits = useAppSelector(
    (state) => state.import.recognizedDigits,
  );

  // Local state for edits
  const [editedDigits, setEditedDigits] = useState<number[]>(() =>
    recognizedDigits?.map((c) => c.value) ?? Array(81).fill(0),
  );
  const [editingCell, setEditingCell] = useState<number | null>(null);

  const handleCellClick = useCallback((index: number) => {
    setEditingCell(index);
  }, []);

  const handleDigitInput = useCallback(
    (digit: number) => {
      if (editingCell === null) return;

      setEditedDigits((prev) => {
        const next = [...prev];
        next[editingCell] = digit;
        return next;
      });
      setEditingCell(null);
    },
    [editingCell],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(editedDigits);
  }, [editedDigits, onConfirm]);

  const isLowConfidence = (index: number): boolean => {
    const cell = recognizedDigits?.[index];
    return cell ? cell.confidence < LOW_CONFIDENCE_THRESHOLD : false;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-fixed">Review Import</h2>
      <p className="text-sm text-guess">
        Tap any cell to correct. Yellow cells have low confidence.
      </p>

      {/* Mini grid */}
      <div
        className="grid grid-cols-9 border-2 border-black mx-auto"
        style={{ width: "min(100%, 320px)" }}
      >
        {editedDigits.map((digit, index) => {
          const row = Math.floor(index / 9);
          const col = index % 9;

          const borderRight = col % 3 === 2 && col !== 8 ? "border-r-2 border-r-black" : "";
          const borderBottom = row % 3 === 2 && row !== 8 ? "border-b-2 border-b-black" : "";

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={cn(
                "aspect-square flex items-center justify-center",
                "text-lg font-bold border border-cell-border",
                "hover:bg-btn/50 transition-colors",
                borderRight,
                borderBottom,
                editingCell === index && "bg-selected",
                isLowConfidence(index) && editingCell !== index && "bg-yellow-200",
              )}
            >
              {digit > 0 ? digit : ""}
            </button>
          );
        })}
      </div>

      {/* Digit input panel (shown when editing) */}
      {editingCell !== null && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-guess text-center">
            Select digit for cell {Math.floor(editingCell / 9) + 1},{editingCell % 9 + 1}
          </p>
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => handleDigitInput(0)}
              className="p-2 bg-btn rounded text-lg font-bold hover:bg-selected"
            >
              ✕
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <button
                key={d}
                onClick={() => handleDigitInput(d)}
                className="p-2 bg-btn rounded text-lg font-bold hover:bg-selected"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button primary onClick={handleConfirm} className="flex-1">
          Import
        </Button>
      </div>
    </div>
  );
};

export default ImportReview;
