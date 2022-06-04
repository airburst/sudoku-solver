import styled from "styled-components";
import { useSelector } from "react-redux";
import NumberControls from "./NumberControls";
import PlacementControls from "./PlacementControls";
import GameControls from "./GameControls";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 1rem);

  @media (min-width: 760px) {
    max-width: 320px;
    margin: 2rem;
  }
`;

const Controls = () => {
  const locked = useSelector((state) => state.puzzle.locked);

  return (
    <Container>
      <NumberControls />
      {locked && (
        <>
          <PlacementControls />
          <GameControls />
        </>
      )}
    </Container>
  );
};

export default Controls;
