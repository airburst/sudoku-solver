// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import PuzzleBoard from "./features/puzzle/PuzzleBoard";
import Controls from "./features/puzzle/Controls";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  @media (min-width: 912px) {
    flex-direction: row;
    justify-content: center;
  }
`;

function App() {
  // const puzzleData = [
  //   [6, 3, 0, 0, 0, 0, 0, 8, 1],
  //   [0, 2, 0, 0, 0, 3, 0, 0, 0],
  //   [0, 0, 0, 0, 1, 7, 4, 3, 0],
  //   [0, 9, 6, 4, 0, 0, 5, 7, 0],
  //   [0, 0, 0, 7, 6, 2, 0, 0, 0],
  //   [0, 8, 0, 0, 0, 0, 6, 0, 0],
  //   [0, 6, 0, 0, 2, 0, 0, 0, 0],
  //   [3, 0, 9, 0, 0, 0, 0, 6, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 9],
  // ];

  return (
    <Container>
      <PuzzleBoard />
      <Controls />
    </Container>
  );
}

export default App;
