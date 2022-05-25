// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedCellsValue,
  clearSelectedCells,
  setSelectedCellsPencilMarks,
  move,
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
  const dispatch = useDispatch();

  const handleKeyPress = (e) => {
    console.log("🚀 handleKeyPress ~ key", e.code); // FIXME: remove

    switch (true) {
      case /^[0-9]$/i.test(e.key):
        dispatch(setSelectedCellsValue(Number(e.key)));
        break;
      case e.shiftKey && /^Digit[0-9]$/i.test(e.code):
        const num = parseInt(e.code.slice(5));
        dispatch(setSelectedCellsPencilMarks(num));
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
          />
        ))
      )}
    </StyledBoard>
  );
};

export default PuzzleBoard;
