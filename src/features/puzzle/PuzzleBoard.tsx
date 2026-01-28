import { useEffect } from "react";
import Cell from "./Cell";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
  move,
  changeMode,
} from "./puzzleSlice";
import type { Direction } from "@/types/puzzle";

const cycleMode = (mode: string) => {
  switch (mode) {
    case "normal":
      return "corner";
    case "corner":
      return "centre";
    default:
      return "normal";
  }
};

const PuzzleBoard = () => {
  const boardData = useAppSelector((state) => state.puzzle.board);
  const locked = useAppSelector((state) => state.puzzle.locked);
  const mode = useAppSelector((state) => state.puzzle.mode);
  const dispatch = useAppDispatch();

  // This enables onPointerEnter to work on mobile
  useEffect(() => {
    const handler = (event: PointerEvent) => {
      (event.target as Element)?.releasePointerCapture?.(event.pointerId);
    };
    document.body.addEventListener("gotpointercapture", handler);
    return () =>
      document.body.removeEventListener("gotpointercapture", handler);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (true) {
      case e.shiftKey && /^Digit[1-9]$/i.test(e.code):
        if (locked) {
          dispatch(changeMode("corner"));
          const shiftNum = parseInt(e.code.slice(5));
          dispatch(setSelectedCellsPencilMarks(shiftNum));
        }
        break;
      case e.ctrlKey && /^Digit[1-9]$/i.test(e.code):
        if (locked) {
          dispatch(changeMode("centre"));
          const ctrlNum = parseInt(e.code.slice(5));
          dispatch(setSelectedCellsPencilMarks(ctrlNum));
        }
        break;
      case /^Digit[1-9]$/i.test(e.code): {
        const num = parseInt(e.code.slice(5));
        if (mode === "normal" || mode === "setup") {
          dispatch(setSelectedCellsValue(num));
        } else {
          dispatch(setSelectedCellsPencilMarks(num));
        }
        break;
      }
      case e.shiftKey:
        dispatch(changeMode("corner"));
        break;
      case e.ctrlKey:
        dispatch(changeMode("centre"));
        break;
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
        break;
      case e.code === "Space":
        dispatch(changeMode(cycleMode(mode)));
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="grid grid-rows-[repeat(9,1fr)] grid-cols-[repeat(9,1fr)]
                 aspect-square w-full
                 md:w-[min(100cqw,100cqh-1rem)] md:max-h-[calc(100cqh-1rem)]
                 border-r-4 border-b-4 border-black touch-none"
    >
      {boardData.map((rowData, rowIndex) =>
        rowData.map((cell, colIndex) => (
          <Cell
            key={`cell-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            data={cell}
            onKeyDown={handleKeyPress}
          />
        )),
      )}
    </div>
  );
};

export default PuzzleBoard;
