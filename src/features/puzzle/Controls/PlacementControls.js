import styled from "styled-components";
import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { changeMode } from "../puzzleSlice";

const ToggleButton = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% - 4px);
  border: 2px solid var(--btn-color);
  border-radius: 5px;
  margin-top: 0.5rem;

  & > * {
    border: 0;
    border-radius: 0;

    &:not(:last-child) {
      border-right: 2px solid var(--btn-color);
    }
    &:last-child {
      border-right: 0px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
  }
`;

const PlacementControls = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.puzzle.mode);

  const setMode = (m) => dispatch(changeMode(m));

  return (
    <ToggleButton>
      <Button primary={mode === "normal"} onClick={() => setMode("normal")}>
        Normal
      </Button>
      <Button primary={mode === "corner"} onClick={() => setMode("corner")}>
        Corner
      </Button>
      <Button primary={mode === "centre"} onClick={() => setMode("centre")}>
        Centre
      </Button>
    </ToggleButton>
  );
};

export default PlacementControls;
