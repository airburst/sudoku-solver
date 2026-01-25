import { useEffect } from "react";
import PauseButton from "./PauseButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { incrementClock, pause } from "@/features/puzzle/puzzleSlice";

const TimerBar = () => {
  const clock = useAppSelector((state) => state.puzzle.clock);
  const paused = useAppSelector((state) => state.puzzle.paused);
  const dispatch = useAppDispatch();

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
    <div className="flex flex-row items-center justify-center h-8 bg-btn text-fixed pl-4 text-2xl">
      {timeString}
      <PauseButton onClick={() => dispatch(pause())} />
    </div>
  );
};

export default TimerBar;
