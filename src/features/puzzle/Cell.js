import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { selectCell, setDragging } from "./puzzleSlice";

const StyledCell = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-basis: calc(25% - 10px);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.6rem, 6vw, 3rem);
  outline: none;

  // Thick borders for (3x3) square edges
  border-top: ${({ row }) =>
    row % 3 === 0 ? "4px solid black" : "1px solid black"};
  border-left: ${({ col }) =>
    col % 3 === 0 ? "4px solid black" : "1px solid black"};

  cursor: ${({ hasSetValue }) => (hasSetValue ? "default" : "pointer")};
  background-color: ${({ selected }) =>
    selected ? "var(--selected-bg-color)" : "white"};

  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const FixedContent = styled.div`
  position: absolute;
  color: var(--fixed-color);
`;

const Content = styled.div`
  position: absolute;
  color: ${({ error }) =>
    error ? "var(--error-color)" : "var(--guess-color)"};
`;

const PencilMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: clamp(0.7rem, 1vw, 1rem);
  padding-left: 2px;
  color: var(--guess-color);
`;

const CentreMark = styled.div`
  position: absolute;
  font-size: clamp(0.7rem, 1vw, 1rem);
  color: var(--guess-color);
`;

const Cell = ({ data, row = 0, col = 0, onKeyDown, onKeyUp }) => {
  const locked = useSelector((state) => state.puzzle.locked);
  const isDragging = useSelector((state) => state.puzzle.isDragging);
  const dispatch = useDispatch();
  const hasSetValue = locked && data.fixedVal !== 0;

  const handleClickCell = () => {
    dispatch(selectCell({ row, col }));
    dispatch(setDragging(true));
  };
  const handleMouseUp = () => dispatch(setDragging(false));
  const handleMouseOver = () => {
    if (isDragging) {
      dispatch(selectCell({ row, col }));
    }
  };

  return (
    <StyledCell
      {...data}
      onMouseDown={handleClickCell}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseOver}
      hasSetValue={hasSetValue}
      row={row}
      col={col}
      locked={locked}
      tabIndex={hasSetValue ? -1 : 0}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <PencilMark>{data.pencilMarks?.join(" ")}</PencilMark>
      <CentreMark>{data.centreMarks?.join(" ")}</CentreMark>
      {data.val > 0 && <Content error={data.error ? 1 : 0}>{data.val}</Content>}
      {data.fixedVal > 0 && <FixedContent>{data.fixedVal}</FixedContent>}
    </StyledCell>
  );
};

export default Cell;
