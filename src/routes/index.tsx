import { createFileRoute } from "@tanstack/react-router";
import PuzzleBoard from "@/features/puzzle/PuzzleBoard";
import Controls from "@/features/puzzle/Controls";
import PauseScreen from "@/components/PauseScreen";
import ImportModal from "@/features/puzzle/Import";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { resume } from "@/features/puzzle/puzzleSlice";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const paused = useAppSelector((state) => state.puzzle.paused);
  const dispatch = useAppDispatch();

  const resumePuzzle = () => dispatch(resume());

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-stone-200 px-2 lg:px-8">
      <div
        className="grid h-full gap-2
                   grid-rows-[auto_1fr] grid-cols-1 justify-items-center
                   lg:gap-8 lg:grid-rows-1 lg:grid-cols-[3fr_minmax(21rem,1fr)] mx-auto my-0"
      >
        <div className="@container w-full max-h-[min(100vw,calc(100vh-64px-9rem))] flex items-start justify-center">
          <PuzzleBoard />
        </div>
        <Controls />
      </div>

      {paused && <PauseScreen resumePuzzle={resumePuzzle} />}

      <ImportModal />
    </div>
  );
}
