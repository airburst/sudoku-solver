import { useEffect } from "react";
import styled from "styled-components";
import PauseButton from "./PauseButton";
import { useSelector, useDispatch } from "react-redux";
import { incrementClock, pause } from "../features/puzzle/puzzleSlice";

const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 2rem;
  background-color: var(--btn-color);
  color: #262626;
  padding-left: 1rem;
  font-size: 1.5rem;
`;

const TimerBar = () => {
  const clock = useSelector((state) => state.puzzle.clock);
  const paused = useSelector((state) => state.puzzle.paused);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!paused) {
      const timer = setInterval(() => dispatch(incrementClock()), 1000);

      return () => clearInterval(timer);
    }
  }, [dispatch, paused]);

  // Convert seconds into time format hh:mm:ss
  const hours = Math.floor(clock / 3600);
  const minutes = Math.floor((clock % 3600) / 60);
  const seconds = clock % 60;
  const timeString =
    hours === 0
      ? `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
      : `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

  return (
    <HeaderBar>
      {timeString}
      <PauseButton onClick={() => dispatch(pause())} />
    </HeaderBar>
  );
};

export default TimerBar;
