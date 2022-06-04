import styled from "styled-components";
import PuzzleBoard from "./features/puzzle/PuzzleBoard";
import Controls from "./features/puzzle/Controls";
import TimerBar from "./components/TimerBar";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

  return (
    <Container>
      {locked && <TimerBar />}
      <Content>
        <PuzzleBoard />
        <Controls />
      </Content>
    </Container>
  );
}

export default App;
