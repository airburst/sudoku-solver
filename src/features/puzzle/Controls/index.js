import styled from "styled-components";
import { useSelector } from "react-redux";
import PlayControls from "./PlayControls";
import GameControls from "./GameControls";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 912px) {
    margin: 0 2rem;
  }
`;

const Controls = () => {
  const locked = useSelector((state) => state.puzzle.locked);

  return (
    <Container>
      <PlayControls />
      {locked && <GameControls />}
    </Container>
  );
};

export default Controls;
