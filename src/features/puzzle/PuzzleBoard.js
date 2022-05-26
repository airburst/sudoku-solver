// import { useState, useCallback, useEffect } from "react";
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
  flex-grow: 1;
  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  width: calc(100vw - 16px);
  max-width: 760px;
  max-height: calc(100vw - 16px);
  border-right: 4px solid black;
  border-bottom: 4px solid black;
  margin: 1rem;

  @media (min-width: 760px) {
    margin: auto;
  }
`;

const PuzzleBoard = () => {
  const boardData = useSelector((state) => state.puzzle.board);
  const mode = useSelector((state) => state.puzzle.mode);
  const dispatch = useDispatch();

  const handleKeyPress = (e) => {
    switch (true) {
      case e.shiftKey && /^Digit[0-9]$/i.test(e.code):
        dispatch(changeMode("corner"));
        const shiftNum = parseInt(e.code.slice(5));
        dispatch(setSelectedCellsPencilMarks(shiftNum));
        break;
      case e.ctrlKey && /^Digit[0-9]$/i.test(e.code):
        dispatch(changeMode("centre"));
        const ctrlNum = parseInt(e.code.slice(5));
        dispatch(setSelectedCellsPencilMarks(ctrlNum));
        break;
      case /^Digit[0-9]$/i.test(e.code):
        const num = parseInt(e.code.slice(5));
        if (mode === "normal") {
          dispatch(setSelectedCellsValue(num));
        }
        if (mode === "corner") {
          dispatch(setSelectedCellsPencilMarks(num));
        }
        if (mode === "centre") {
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
      default:
        break;
    }
  };

  const handleKeyUp = () => dispatch(changeMode("normal"));

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
            onKeyUp={handleKeyUp}
          />
        ))
      )}
    </StyledBoard>
  );
};

export default PuzzleBoard;
