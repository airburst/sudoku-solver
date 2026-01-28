import { createFileRoute } from "@tanstack/react-router";
import PuzzleBoard from "@/features/puzzle/PuzzleBoard";
import Controls from "@/features/puzzle/Controls";
import TimerBar from "@/components/TimerBar";
import PauseScreen from "@/components/PauseScreen";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { resume } from "@/features/puzzle/puzzleSlice";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const locked = useAppSelector((state) => state.puzzle.locked);
  const paused = useAppSelector((state) => state.puzzle.paused);
  const dispatch = useAppDispatch();

  const resumePuzzle = () => dispatch(resume());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {locked && <TimerBar />}
      <div className="flex flex-col items-center h-full md:flex-row md:items-start md:justify-center">
        <PuzzleBoard />
        <Controls />
      </div>
      {paused && <PauseScreen resumePuzzle={resumePuzzle} />}
    </div>
  );
}
