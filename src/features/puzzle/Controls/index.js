import styled from "styled-components";
import { useSelector } from "react-redux";
import NumberControls from "./NumberControls";
import PlacementControls from "./PlacementControls";
import GameControls from "./GameControls";

const Container = styled.div`
  --max-width: 300px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 1rem);

  @media (min-width: 760px) {
    max-width: var(--max-width);
    margin: 2rem;
    min-height: 200px;
  }
`;

const Controls = ({ reset }) => {
  const locked = useSelector((state) => state.puzzle.locked);

  return (
    <Container>
      <NumberControls />
      {locked && (
        <>
          <PlacementControls />
          <GameControls resetTimer={reset} />
        </>
      )}
    </Container>
  );
};

export default Controls;
