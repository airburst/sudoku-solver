import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleCellSelected } from "../features/puzzle/puzzleSlice";

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

const Content = styled.div`
  position: absolute;
`;

const Cell = ({ data, row = 0, col = 0, setCellValue }) => {
  const locked = useSelector((state) => state.puzzle.locked);
  const dispatch = useDispatch();
  // TODO: handle pencil marks
  const hasSetValue = data.val !== 0;

  // TODO: emit selected event to store
  // Selected cells are the targets for keyboard input
  const handleClickCell = () => {
    // if (!hasSetValue) {
    dispatch(toggleCellSelected({ row, col }));
    setCellValue?.(9);
    // }
  };

  return (
    <StyledCell
      onClick={handleClickCell}
      hasSetValue={hasSetValue}
      selected={data.selected}
      row={row}
      col={col}
      locked={locked}
      tabIndex={hasSetValue ? -1 : 1}
    >
      <Content>{data.val > 0 ? data.val : ""}</Content>
    </StyledCell>
  );
};

export default Cell;
