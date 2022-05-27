import styled from "styled-components";
import Button from "../../../components/Button";
import solve from "../../../services/Solver";
import { useSelector, useDispatch } from "react-redux";
import {
  lockBoard,
  setSelectedCellsValue,
  setSelectedCellsPencilMarks,
  changeMode,
  setBoard,
} from "../puzzleSlice";

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ locked }) =>
    locked ? "8rem 3rem 3rem 3rem" : "repeat(3, 3rem)"};
  grid-template-rows: repeat(4, 3rem);
  grid-gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const ColSpan = styled.div`
  grid-row: 4 / 4;
  grid-column: 2 / 5;
`;

const SaveSpan = styled.div`
  grid-row: ${({ locked }) => (locked ? "4 / 4" : "")};
  grid-column: ${({ locked }) => (locked ? "1 / 5" : "1 / 4")};
`;

const Controls = () => {
  const dispatch = useDispatch();
  const locked = useSelector((state) => state.puzzle.locked);
  const board = useSelector((state) => state.puzzle.board);
  const mode = useSelector((state) => state.puzzle.mode);

  const setValue = (val) => {
    if (mode === "normal" || mode === "setup") {
      dispatch(setSelectedCellsValue(val));
    }
    if (mode === "corner" || mode === "centre") {
      dispatch(setSelectedCellsPencilMarks(val));
    }
  };
  const setMode = (m) => dispatch(changeMode(m));

  return (
    <ButtonContainer locked={locked}>
      {locked && (
        <Button primary={mode === "normal"} onClick={() => setMode("normal")}>
          Normal
        </Button>
      )}
      <Button primary onClick={() => setValue(1)}>
        1
      </Button>
      <Button primary onClick={() => setValue(2)}>
        2
      </Button>
      <Button primary onClick={() => setValue(3)}>
        3
      </Button>
      {locked && (
        <Button primary={mode === "corner"} onClick={() => setMode("corner")}>
          Corner
        </Button>
      )}
      <Button primary onClick={() => setValue(4)}>
        4
      </Button>
      <Button primary onClick={() => setValue(5)}>
        5
      </Button>
      <Button primary onClick={() => setValue(6)}>
        6
      </Button>
      {locked && (
        <Button primary={mode === "centre"} onClick={() => setMode("centre")}>
          Centre
        </Button>
      )}
      <Button primary onClick={() => setValue(7)}>
        7
      </Button>
      <Button primary onClick={() => setValue(8)}>
        8
      </Button>
      <Button primary onClick={() => setValue(9)}>
        9
      </Button>
      {locked && (
        <>
          <Button onClick={() => dispatch(setBoard(solve(board)))}>
            Solve
          </Button>
          <ColSpan>
            <Button onClick={() => setValue(0)}>Delete</Button>
          </ColSpan>
        </>
      )}
      {!locked && (
        <SaveSpan>
          <Button primary onClick={() => dispatch(lockBoard())}>
            Save
          </Button>
        </SaveSpan>
      )}
    </ButtonContainer>
  );
};

export default Controls;
