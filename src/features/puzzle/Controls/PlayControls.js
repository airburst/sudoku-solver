// import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { lockBoard, setSelectedCellsValue, restart } from "../puzzleSlice";

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

const SaveSpan = styled.div`
  grid-row: 4 / 4;
  grid-column: 1 / 5;
`;

const Controls = () => {
  const dispatch = useDispatch();
  const locked = useSelector((state) => state.puzzle.locked);

  const setValue = (val) => dispatch(setSelectedCellsValue(val));

  return (
    <ButtonContainer>
      <Button onClick={() => console.log("// TODO")}>Normal</Button>
      <Button onClick={() => setValue(1)}>1</Button>
      <Button onClick={() => setValue(2)}>2</Button>
      <Button onClick={() => setValue(3)}>3</Button>
      <Button basic onClick={() => console.log("// TODO")}>
        Corner
      </Button>
      <Button onClick={() => setValue(4)}>4</Button>
      <Button onClick={() => setValue(5)}>5</Button>
      <Button onClick={() => setValue(6)}>6</Button>
      <Button basic onClick={() => console.log("// TODO")}>
        Centre
      </Button>
      <Button onClick={() => setValue(7)}>7</Button>
      <Button onClick={() => setValue(8)}>8</Button>
      <Button onClick={() => setValue(9)}>9</Button>
      {locked && (
        <>
          <Button basic onClick={() => console.log("// TODO")}>
            Solve
          </Button>
          <ColSpan>
            <Button basic onClick={() => setValue(0)}>
              Delete
            </Button>
          </ColSpan>
        </>
      )}
      {!locked && (
        <SaveSpan>
          <Button onClick={() => dispatch(lockBoard())}>Save</Button>
        </SaveSpan>
      )}
    </ButtonContainer>
  );
};

export default Controls;
