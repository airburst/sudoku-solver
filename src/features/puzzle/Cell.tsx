import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectCell, setDragging } from "./puzzleSlice";
import type { Cell as CellType } from "@/types/puzzle";
import type { KeyboardEvent } from "react";

interface CellProps {
  data: CellType;
  row: number;
  col: number;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const Cell = ({ data, row = 0, col = 0, onKeyDown, onKeyUp }: CellProps) => {
  const locked = useAppSelector((state) => state.puzzle.locked);
  const isDragging = useAppSelector((state) => state.puzzle.isDragging);
  const dispatch = useAppDispatch();
  const hasSetValue = locked && data.fixedVal !== 0;

  const handleClickCell = () => {
    dispatch(selectCell({ row, col }));
    dispatch(setDragging(true));
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
        ? "border-t-2 border-t-neutral-black"
        : "border-t border-t-cell-border border-t-neutral-400";
  const borderLeftClass =
    col === 0
      ? ""
      : col % 3 === 0
        ? "border-l-2 border-l-neutral-black"
        : "border-l border-l-cell-border border-l-neutral-400";
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
        "text-[clamp(1.6rem,6vw,6rem)] outline-none box-border",
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
      {/* Pencil marks (corner) */}
      {data.pencilMarks && data.pencilMarks.length > 0 && (
        <div className="absolute top-0 left-0 text-[clamp(0.5rem,1vw,1rem)] pl-0.5 text-pencil">
          {data.pencilMarks.join(" ")}
        </div>
      )}

      {/* Centre marks */}
      {data.centreMarks && data.centreMarks.length > 0 && (
        <div className="absolute text-[clamp(0.5rem,1vw,1rem)] text-pencil">
          {data.centreMarks.join(" ")}
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
        <div className="absolute text-fixed font-extrabold">
          {data.fixedVal}
        </div>
      )}
    </div>
  );
};

export default Cell;
