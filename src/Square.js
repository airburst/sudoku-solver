import styled from "styled-components";
import Cell from "./Cell";

const StyledSquare = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3, 100px);
  border: 2px solid black;
`;

const Square = ({ data = [], row = 0 }) => {
  return (
    <StyledSquare>
      {data.map((initialValue, index) => (
        <Cell key={`cell-${row}-${index}`} initialValue={initialValue} />
      ))}
    </StyledSquare>
  );
};

export default Square;
