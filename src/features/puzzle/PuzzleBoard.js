// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCellsValue, clearSelectedCells } from "./puzzleSlice";

const StyledBoard = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  max-width: 760px;
  border-right: 3px solid black;
  border-bottom: 3px solid black;
  margin-bottom: 1rem;

  @media (min-width: 760px) {
    margin: auto;
  }
`;

const PuzzleBoard = () => {
  const boardData = useSelector((state) => state.puzzle.board);
  const dispatch = useDispatch();

  const handleKeyPress = ({ key }) => {
    console.log("🚀 handleKeyPress ~ key", key); // FIXME:
    switch (true) {
      case /^[0-9]$/i.test(key):
        dispatch(setSelectedCellsValue(key));
        break;
      case key === "Enter":
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
            onKeyPress={handleKeyPress}
          />
        ))
      )}
    </StyledBoard>
  );
};

export default PuzzleBoard;
