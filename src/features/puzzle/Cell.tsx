import { selectCell, setDragging } from "./puzzleSlice";
import type { Cell as CellType } from "@/types/puzzle";
import type { KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/cn";

interface CellProps {
  data: CellType;
  row: number;
  col: number;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLDivElement>) => void;
  highlightValue?: number | null;
  highlightCell?: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number, cell: CellType) => void;
}

const Cell = ({
  data,
  row = 0,
  col = 0,
  onKeyDown,
  onKeyUp,
  highlightValue,
  highlightCell,
  onCellClick,
}: CellProps) => {
  const locked = useAppSelector((state) => state.puzzle.locked);
  const isDragging = useAppSelector((state) => state.puzzle.isDragging);
  const dispatch = useAppDispatch();
  const hasSetValue = locked && data.fixedVal !== 0;

  // Highlight logic
  const cellValue = data.fixedVal || data.val;
  const isSameValue = highlightValue && cellValue === highlightValue;
  const inHighlightRow = highlightCell?.row === row;
  const inHighlightCol = highlightCell?.col === col;
  const inHighlightBox =
    highlightCell &&
    Math.floor(row / 3) === Math.floor(highlightCell.row / 3) &&
    Math.floor(col / 3) === Math.floor(highlightCell.col / 3);
  const isHighlightedCell =
    highlightCell?.row === row && highlightCell.col === col;

  const overlayClass = isSameValue
    ? "bg-highlight/50"
    : (inHighlightRow || inHighlightCol || inHighlightBox) && !isHighlightedCell
      ? "bg-highlight/25"
      : null;

  const handleClickCell = () => {
    dispatch(selectCell({ row, col }));
    dispatch(setDragging(true));
    onCellClick?.(row, col, data);
  };
  const handleMouseUp = () => dispatch(setDragging(false));
  const handleMouseOver = () => {
    if (isDragging) {
      dispatch(selectCell({ row, col }));
    }
  };

  // Determine border classes for 3x3 grid sections
  // Outside edges of puzzle are handled by the container
  // and have no borders here
  const borderTopClass =
    row === 0
      ? ""
      : row % 3 === 0
        ? "border-t-2 border-t-stone-900"
        : "border-t border-t-cell-border border-t-stone-400";
  const borderLeftClass =
    col === 0
      ? ""
      : col % 3 === 0
        ? "border-l-2 border-l-stone-900"
        : "border-l border-l-cell-border border-l-stone-400";
  // Corner cells are rounded on their outside corner
  const cornerClass =
    row === 0 && col === 0
      ? "rounded-tl-md"
      : row === 0 && col === 8
        ? "rounded-tr-md"
        : row === 8 && col === 0
          ? "rounded-bl-md"
          : row === 8 && col === 8
            ? "rounded-br-md"
            : "";

  // Background color
  const bgClass = data.selected
    ? "bg-blue-300"
    : data.fixedVal
      ? "bg-fixed-bg"
      : "bg-white";

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center justify-center",
        "text-[clamp(1rem,7cqw,4rem)] lg:text-[clamp(1.6rem,8cqw,6rem)] outline-none box-border  font-extrabold",
        "aspect-square",
        borderTopClass,
        borderLeftClass,
        bgClass,
        cornerClass,
        hasSetValue ? "cursor-default" : "cursor-pointer",
      )}
      onPointerDown={handleClickCell}
      onPointerUp={handleMouseUp}
      onPointerOver={handleMouseOver}
      tabIndex={hasSetValue ? -1 : 0}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      {/* Highlight overlay */}
      {overlayClass && (
        <div
          className={cn("absolute inset-0 pointer-events-none", overlayClass)}
        />
      )}

      {/* Notes grid */}
      {data.notes.length > 0 && !data.val && !data.fixedVal && (
        <div className="grid grid-cols-3 grid-rows-3 absolute inset-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className="flex items-center justify-center text-[clamp(0.4rem,2cqw,1rem)] text-stone-900 leading-none"
            >
              {data.notes.includes(n) ? n : ""}
            </div>
          ))}
        </div>
      )}

      {/* User-entered value */}
      {data.val > 0 && (
        <div
          className={cn("absolute", data.error ? "text-error" : "text-guess")}
        >
          {data.val}
        </div>
      )}

      {/* Fixed value (given clue) */}
      {data.fixedVal > 0 && (
        <div className="absolute text-fixed">{data.fixedVal}</div>
      )}
    </div>
  );
};

export default Cell;
