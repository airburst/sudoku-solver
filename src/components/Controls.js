// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import { useSelector, useDispatch } from "react-redux";
import { lockBoard } from "../features/puzzle/puzzleSlice";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 912px) {
    width: 25%;
  }
`;

const Controls = () => {
  const dispatch = useDispatch();
  const boardLocked = useSelector((state) => state.puzzle.locked);

  return (
    <Container>
      {!boardLocked && (
        <div>
          <Button onClick={() => dispatch(lockBoard())}>Save</Button>
        </div>
      )}
    </Container>
  );
};

export default Controls;
