import { useEffect } from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
  move,
  changeMode,
} from "./puzzleSlice";

const StyledBoard = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  width: calc(min(100vh, 100vw) - 1rem);
  max-height: calc(min(100vh, 100vw) - 1rem);
  max-width: calc(min(100vh, 100vw) - 1rem);
  border-right: 4px solid black;
  border-bottom: 4px solid black;
  margin: 0.5rem;
  touch-action: none; /* Prevent pull down */

  @media (min-width: 620px) {
    margin: 2rem;
    max-height: calc(min(100vh, 100vw) - 6rem);
    max-width: calc(min(100vh, 100vw) - 6rem);
  }
`;

const cycleMode = (mode) => {
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
  const boardData = useSelector((state) => state.puzzle.board);
  const locked = useSelector((state) => state.puzzle.locked);
  const mode = useSelector((state) => state.puzzle.mode);
  const dispatch = useDispatch();

  // This enables onPointerEnter to work on mobile
  useEffect(() => {
    document.body.addEventListener("gotpointercapture", (event) => {
      event.target.releasePointerCapture(event.pointerId);
    });
  }, []);

  const handleKeyPress = (e) => {
    switch (true) {
      case e.shiftKey && /^Digit[0-9]$/i.test(e.code):
        if (locked) {
          dispatch(changeMode("corner"));
          const shiftNum = parseInt(e.code.slice(5));
          dispatch(setSelectedCellsPencilMarks(shiftNum));
        }
        break;
      case e.ctrlKey && /^Digit[0-9]$/i.test(e.code):
        if (locked) {
          dispatch(changeMode("centre"));
          const ctrlNum = parseInt(e.code.slice(5));
          dispatch(setSelectedCellsPencilMarks(ctrlNum));
        }
        break;
      case /^Digit[0-9]$/i.test(e.code):
        const num = parseInt(e.code.slice(5));
        if (mode === "normal" || mode === "setup") {
          dispatch(setSelectedCellsValue(num));
        } else {
          // Centre or corner pencil marks
          dispatch(setSelectedCellsPencilMarks(num));
        }
        break;
      case e.shiftKey:
        dispatch(changeMode("corner"));
        break;
      case e.ctrlKey:
        dispatch(changeMode("centre"));
        break;
      case /^Arrow/i.test(e.code):
        const direction = e.code.slice(5);
        dispatch(move(direction));
        break;
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

  // const handleKeyUp = () => dispatch(changeMode("normal"));

  return (
    <StyledBoard>
      {boardData.map((rowData, rowIndex) =>
        rowData.map((cell, colIndex) => (
          <Cell
            key={`cell-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            data={cell}
            onKeyDown={handleKeyPress}
            // onKeyUp={handleKeyUp}
          />
        ))
      )}
    </StyledBoard>
  );
};

export default PuzzleBoard;
