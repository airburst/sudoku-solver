import { useEffect } from "react";
import Cell from "./Cell";
import {
  changeMode,
  clearSelectedCells,
  move,
  setSelectedCellsNotes,
  setSelectedCellsValue,
} from "./puzzleSlice";
import type { Direction } from "@/types/puzzle";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useHighlight } from "./HighlightContext";

const PuzzleBoard = () => {
  const boardData = useAppSelector((state) => state.puzzle.board);
  const locked = useAppSelector((state) => state.puzzle.locked);
  const mode = useAppSelector((state) => state.puzzle.mode);
  const dispatch = useAppDispatch();
  const { highlight, setHighlight, clearHighlight } = useHighlight();

  const handleCellClick = (
    row: number,
    col: number,
    cell: Parameters<typeof setHighlight>[2],
  ) => setHighlight(row, col, cell, locked);

  // This enables onPointerEnter to work on mobile
  useEffect(() => {
    const handler = (event: PointerEvent) => {
      (event.target as Element).releasePointerCapture(event.pointerId);
    };
    document.body.addEventListener("gotpointercapture", handler);
    return () =>
      document.body.removeEventListener("gotpointercapture", handler);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (true) {
      case e.ctrlKey && /^Digit[1-9]$/i.test(e.code):
        if (locked) {
          dispatch(changeMode("notes"));
          const ctrlNum = parseInt(e.code.slice(5));
          dispatch(setSelectedCellsNotes(ctrlNum));
        }
        break;
      case /^Digit[1-9]$/i.test(e.code): {
        const num = parseInt(e.code.slice(5));
        if (mode === "normal" || mode === "setup") {
          dispatch(setSelectedCellsValue(num));
        } else {
          dispatch(setSelectedCellsNotes(num));
        }
        break;
      }
      case /^Arrow/i.test(e.code): {
        const direction = e.code.slice(5) as Direction;
        dispatch(move(direction));
        break;
      }
      case e.key === "Backspace" || e.key === "Delete":
        dispatch(setSelectedCellsValue(0));
        break;
      case e.key === "Enter" || e.key === "Escape":
        dispatch(clearSelectedCells());
        clearHighlight();
        break;
      case e.code === "Space":
        if (locked) {
          dispatch(changeMode(mode === "normal" ? "notes" : "normal"));
        }
        break;
      default:
        break;
    }
  };

  // Note: calc(100vh-64px-1rem) accounts for header and 1rem bottom margin
  return (
    <div
      className="grid grid-rows-9 grid-cols-9
                 size-[min(100cqw,100cqh)]
                 lg:size-[min(100cqw,100cqh,calc(100vh-64px-1rem))]
                 touch-none border-2 rounded-md"
    >
      {boardData.map((rowData, rowIndex) =>
        rowData.map((cell, colIndex) => (
          <Cell
            key={`cell-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            data={cell}
            onKeyDown={handleKeyPress}
            highlightValue={highlight.value}
            highlightCell={highlight.cell}
            onCellClick={handleCellClick}
          />
        )),
      )}
    </div>
  );
};

export default PuzzleBoard;
