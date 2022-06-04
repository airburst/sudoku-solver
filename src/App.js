import { useState } from "react";
import styled from "styled-components";
import PuzzleBoard from "./features/puzzle/PuzzleBoard";
import Controls from "./features/puzzle/Controls";
import TimerBar from "./components/TimerBar";
import { useSelector } from "react-redux";

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
  const [resetTimer, setResetTimer] = useState(false);
  const locked = useSelector((state) => state.puzzle.locked);

  const doResetTimer = () => {
    setResetTimer(true);
    setTimeout(() => setResetTimer(false), 50);
  };

  return (
    <Container>
      {locked && <TimerBar reset={resetTimer} />}
      <Content>
        <PuzzleBoard />
        <Controls reset={doResetTimer} />
      </Content>
    </Container>
  );
}

export default App;
