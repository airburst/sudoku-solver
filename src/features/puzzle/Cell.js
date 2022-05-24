import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleCellSelected } from "./puzzleSlice";

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
    row % 3 === 0 ? "4px solid black" : "1px solid black"};
  border-left: ${({ col }) =>
    col % 3 === 0 ? "4px solid black" : "1px solid black"};

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

const Content = styled.div`
  position: absolute;
`;

const PencilMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1rem;
  padding-left: 2px;
`;

const Cell = ({ data, row = 0, col = 0, onKeyDown }) => {
  const locked = useSelector((state) => state.puzzle.locked);
  const dispatch = useDispatch();
  const hasSetValue = data.val !== 0;

  const handleClickCell = () => {
    if (!hasSetValue) {
      dispatch(toggleCellSelected({ row, col }));
    }
  };

  // const setValue = (val) => {
  //   dispatch(setCellValue({ row, col, value: val }));
  // };

  return (
    <StyledCell
      onClick={handleClickCell}
      hasSetValue={hasSetValue}
      selected={data.selected}
      pencilMarks={data.pencilMarks}
      row={row}
      col={col}
      locked={locked}
      tabIndex={hasSetValue ? -1 : 1}
      onKeyDown={onKeyDown}
    >
      <PencilMark>{data.pencilMarks?.join(" ")}</PencilMark>
      <Content>{data.val > 0 ? data.val : ""}</Content>
    </StyledCell>
  );
};

export default Cell;
