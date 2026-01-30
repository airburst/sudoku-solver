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
    <div className="flex flex-col h-full overflow-hidden bg-stone-200">
      <div
        className="grid h-full p-2 gap-2
                   grid-rows-[min(calc(100vw-1rem),calc(100%-1rem))_1fr] grid-cols-1 justify-items-center
                   lg:p-8 lg:gap-8 lg:grid-rows-1 lg:grid-cols-[3fr_minmax(21rem,1fr)] m-auto"
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
