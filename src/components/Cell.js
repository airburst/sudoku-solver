import { useState } from "react";
import styled from "styled-components";

const StyledCell = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-basis: calc(25% - 10px);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 6vw, 4rem);

  // Thick borders for (3x3) square edges
  border-top: ${({ row }) =>
    row % 3 === 0 ? "3px solid black" : "1px solid black"};
  border-left: ${({ col }) =>
    col % 3 === 0 ? "3px solid black" : "1px solid black"};

  color: ${({ hasSetValue }) =>
    hasSetValue ? "var(--fixed-color)" : "var(--guess-color)"};
  cursor: ${({ hasSetValue }) => (hasSetValue ? "default" : "pointer")};
  background-color: ${({ selected }) =>
    selected ? "var(--selected-bg-color)" : "white"};

  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const Cell = ({ initialValue, row = 0, col = 0, handleClick }) => {
  const [selected, setSelected] = useState(0);
  // TODO: handle pencil marks
  const hasSetValue = initialValue !== 0;

  // TODO: emit selected event to store
  // Selected cells are the targets for keyboard input
  const handleClickCell = () => {
    if (!hasSetValue) {
      console.log(`Clicked cell: [${row}, ${col}]`); // FIXME: remove
      setSelected(!selected);
      handleClick?.(selected);
    }
  };

  return (
    <StyledCell
      onClick={handleClickCell}
      hasSetValue={hasSetValue}
      selected={selected}
      row={row}
      col={col}
      tabIndex={hasSetValue ? -1 : 1}
    >
      {initialValue > 0 ? initialValue : ""}
    </StyledCell>
  );
};

export default Cell;
