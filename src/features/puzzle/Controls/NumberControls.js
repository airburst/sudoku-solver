import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  lockBoard,
  setSelectedCellsValue,
  setSelectedCellsPencilMarks,
} from "../puzzleSlice";

const NumbersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 3rem);
  grid-gap: 0.5rem;
  width: 100%;

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 4rem);
  }
`;

const DeleteContainer = styled.div`
  height: 3rem;

  @media (min-width: 760px) {
    height: 4rem;
    grid-row: 4 / 4;
    grid-column: 1 / 4;
  }
`;

const SaveSpan = styled.div`
  grid-row: 3 / 3;
  grid-column: 1 / 6;

  @media (min-width: 760px) {
    grid-row: 4 / 4;
    grid-column: 1 / 4;
  }
`;

const Controls = () => {
  const dispatch = useDispatch();
  const locked = useSelector((state) => state.puzzle.locked);
  const mode = useSelector((state) => state.puzzle.mode);

  const setValue = (val) => {
    if (mode === "normal" || mode === "setup") {
      dispatch(setSelectedCellsValue(val));
    }
    if (mode === "corner" || mode === "centre") {
      dispatch(setSelectedCellsPencilMarks(val));
    }
  };

  return (
    <NumbersContainer locked={locked}>
      <Button primary onClick={() => setValue(1)}>
        1
      </Button>
      <Button primary onClick={() => setValue(2)}>
        2
      </Button>
      <Button primary onClick={() => setValue(3)}>
        3
      </Button>

      <Button primary onClick={() => setValue(4)}>
        4
      </Button>
      <Button primary onClick={() => setValue(5)}>
        5
      </Button>
      <Button primary onClick={() => setValue(6)}>
        6
      </Button>
      <Button primary onClick={() => setValue(7)}>
        7
      </Button>
      <Button primary onClick={() => setValue(8)}>
        8
      </Button>
      <Button primary onClick={() => setValue(9)}>
        9
      </Button>
      <DeleteContainer>
        <Button primary onClick={() => setValue(0)}>
          X
        </Button>
      </DeleteContainer>

      {!locked && (
        <SaveSpan>
          <Button primary onClick={() => dispatch(lockBoard())}>
            Save
          </Button>
        </SaveSpan>
      )}
    </NumbersContainer>
  );
};

export default Controls;
