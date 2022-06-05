import styled from "styled-components";
import solve from "../../../services/Solver";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { restart, reset, setBoard } from "../puzzleSlice";

const ButtonContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 3rem);
  grid-gap: 0.5rem;
  margin-top: 1rem;
`;

const GameControls = () => {
  const board = useSelector((state) => state.puzzle.board);
  const dispatch = useDispatch();

  return (
    <ButtonContainer>
      {/* <Button basic>Undo</Button>
      <Button basic>Redo</Button> */}
      <Button basic onClick={() => dispatch(restart())}>
        Restart
      </Button>
      <Button basic onClick={() => dispatch(setBoard(solve(board)))}>
        Solve
      </Button>
      <Button basic onClick={() => dispatch(reset())}>
        Reset
      </Button>
      {/* <Button basic>Check</Button> */}
    </ButtonContainer>
  );
};

export default GameControls;
