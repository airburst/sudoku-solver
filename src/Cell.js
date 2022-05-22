import { useState } from "react";
import styled from "styled-components";

const StyledCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  font-size: 48px;
  color: ${(props) => (props.hasSetValue ? "blue" : "black")};
  cursor: ${(props) => (props.hasSetValue ? "default" : "pointer")};
  background-color: ${(props) => (props.selected ? "yellow" : "white")};
`;

const Cell = ({ initialValue, handleClick }) => {
  const [selected, setSelected] = useState(0);
  // TODO: handle pencil marks
  const hasSetValue = initialValue !== 0;

  // TODO: emit selected event to store
  // Selected cells are the targets for keyboard input
  const handleClickCell = () => {
    if (!hasSetValue) {
      setSelected(!selected);
      handleClick(selected);
    }
  };

  return (
    <StyledCell
      onClick={handleClickCell}
      hasSetValue={hasSetValue}
      selected={selected}
    >
      {initialValue > 0 ? initialValue : ""}
    </StyledCell>
  );
};

export default Cell;
