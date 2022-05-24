// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Cell from "./Cell";

const StyledBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  margin: 1rem 0.25rem 1rem 0.25rem;
  max-width: 912px;
  border-right: 3px solid black;
  border-bottom: 3px solid black;

  @media (min-width: 912px) {
    margin: auto;
    margin-top: 2rem;
  }
`;

const PuzzleBoard = ({ data = [] }) => {
  return (
    <div className="App">
      <StyledBoard>
        {data.map((rowData, rowIndex) =>
          rowData.map((value, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              initialValue={value}
            />
          ))
        )}
      </StyledBoard>
    </div>
  );
};

export default PuzzleBoard;
