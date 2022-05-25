// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { lockBoard } from "../puzzleSlice";
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
  const dispatch = useDispatch();
  const boardLocked = useSelector((state) => state.puzzle.locked);

  return (
    <Container>
      {!boardLocked ? (
        <div>
          <Button size="large" onClick={() => dispatch(lockBoard())}>
            Save
          </Button>
        </div>
      ) : (
        <>
          <PlayControls />
          <GameControls />
        </>
      )}
    </Container>
  );
};

export default Controls;
