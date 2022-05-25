// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { lockBoard } from "../puzzleSlice";

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 8rem 3rem 3rem 3rem;
  grid-template-rows: repeat(4, 3rem);
  grid-gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const ColSpan = styled.div`
  grid-row: 4 / 4;
  grid-column: 2 / 5;
`;

const Controls = () => {
  // const dispatch = useDispatch();
  // const boardLocked = useSelector((state) => state.puzzle.locked);

  return (
    <ButtonContainer>
      <Button>Normal</Button>
      <Button>1</Button>
      <Button>2</Button>
      <Button>3</Button>
      <Button basic>Corner</Button>
      <Button>4</Button>
      <Button>5</Button>
      <Button>6</Button>
      <Button basic>Centre</Button>
      <Button>7</Button>
      <Button>8</Button>
      <Button>9</Button>
      <Button basic>Colour</Button>
      <ColSpan>
        <Button basic>Delete</Button>
      </ColSpan>
    </ButtonContainer>
  );
};

export default Controls;
