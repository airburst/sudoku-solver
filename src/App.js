import styled from "styled-components";
import PuzzleBoard from "./features/puzzle/PuzzleBoard";
import Controls from "./features/puzzle/Controls";
import TimerBar from "./components/TimerBar";
import PauseScreen from "./components/PauseScreen";
import { useSelector, useDispatch } from "react-redux";
import { resume } from "./features/puzzle/puzzleSlice";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  @media (min-width: 760px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

function App() {
  const locked = useSelector((state) => state.puzzle.locked);
  const paused = useSelector((state) => state.puzzle.paused);
  const dispatch = useDispatch();

  const resumePuzzle = () => dispatch(resume());

  return (
    <Container>
      {locked && <TimerBar />}
      <Content>
        <PuzzleBoard />
        <Controls />
      </Content>
      {paused && <PauseScreen resumePuzzle={resumePuzzle} />}
    </Container>
  );
}

export default App;
