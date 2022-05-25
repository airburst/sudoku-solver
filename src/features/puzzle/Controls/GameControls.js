// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { lockBoard } from "../puzzleSlice";

const ButtonContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 3rem);
  grid-gap: 0.5rem;
`;

const GameControls = () => {
  // const dispatch = useDispatch();
  // const boardLocked = useSelector((state) => state.puzzle.locked);

  return (
    <ButtonContainer>
      <Button basic>Undo</Button>
      <Button basic>Redo</Button>
      <Button basic>Restart</Button>
      <Button basic>Check</Button>
    </ButtonContainer>
  );
};

export default GameControls;
