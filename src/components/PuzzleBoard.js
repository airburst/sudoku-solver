// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { useSelector, useDispatch } from "react-redux";
import { setCellValue } from "../features/puzzle/puzzleSlice";

const StyledBoard = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  max-width: 912px;
  border-right: 3px solid black;
  border-bottom: 3px solid black;
  margin-bottom: 1rem;

  @media (min-width: 912px) {
    margin: auto;
  }
`;

const PuzzleBoard = () => {
  const boardData = useSelector((state) => state.puzzle.board);
  // const locked = useSelector((state) => state.puzzle.locked);
  const dispatch = useDispatch();

  return (
    <StyledBoard>
      {boardData.map((rowData, rowIndex) =>
        rowData.map((cell, colIndex) => (
          <Cell
            key={`cell-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            data={cell}
            setCellValue={(val) =>
              dispatch(
                setCellValue({ row: rowIndex, col: colIndex, value: val })
              )
            }
          />
        ))
      )}
    </StyledBoard>
  );
};

export default PuzzleBoard;
