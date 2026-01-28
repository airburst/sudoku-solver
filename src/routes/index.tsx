import { createFileRoute } from "@tanstack/react-router";
import PuzzleBoard from "@/features/puzzle/PuzzleBoard";
import Controls from "@/features/puzzle/Controls";
import TimerBar from "@/components/TimerBar";
import PauseScreen from "@/components/PauseScreen";
import ImportModal from "@/features/puzzle/Import";
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
      <div
        className="grid h-full p-2 gap-2
                   grid-rows-[min(calc(100vw-1rem),calc(100%-1rem))_1fr] grid-cols-1 justify-items-center
                   md:p-8 md:gap-8 md:grid-rows-1 md:grid-cols-[minmax(0,calc(100%-14rem))_minmax(12rem,auto)]"
      >
        <div className="@container h-full w-full flex items-start justify-center">
          <PuzzleBoard />
        </div>
        <Controls />
      </div>
      {paused && <PauseScreen resumePuzzle={resumePuzzle} />}
      <ImportModal />
    </div>
  );
}
