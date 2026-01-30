import { useHighlight } from "../HighlightContext";
import NumberControls from "./NumberControls";
import NotesToggle from "./NotesToggle";
import UndoButton from "./UndoButton";
import { useAppSelector } from "@/hooks/redux";

const Controls = () => {
  const locked = useAppSelector((state) => state.puzzle.locked);
  const { clearHighlight } = useHighlight();

  return (
    <div
      className={`grid grid-cols-[repeat(5,4rem)] gap-2 grid-rows-[repeat(3,3rem)] mt-2 lg:mt-0 mx-auto`}
      onClick={clearHighlight}
    >
      {locked && (
        <>
          <div className="col-span-3">
            <NotesToggle />
          </div>
          <div className="col-start-5">
            <UndoButton />
          </div>
        </>
      )}
      <NumberControls />
    </div>
  );
};

export default Controls;
