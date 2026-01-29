import { Eraser, Import, Save } from "lucide-react";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  lockBoard,
  setSelectedCellsValue,
  setSelectedCellsPencilMarks,
} from "../puzzleSlice";
import { setImportState } from "@/features/import/importSlice";

const NumberControls = () => {
  const dispatch = useAppDispatch();
  const locked = useAppSelector((state) => state.puzzle.locked);
  const mode = useAppSelector((state) => state.puzzle.mode);

  const setValue = (val: number) => {
    if (mode === "normal" || mode === "setup") {
      dispatch(setSelectedCellsValue(val));
    }
    if (mode === "corner" || mode === "centre") {
      dispatch(setSelectedCellsPencilMarks(val));
    }
  };

  const gridRows = locked ? 4 : 5;

  return (
    <div
      className={`grid grid-cols-[repeat(3,4rem)] gap-2 grid-rows-[repeat(${gridRows},4rem)] mt-2 md:mt-0 mx-auto`}
    >
      <Button primary onClick={() => setValue(1)}>
        1
      </Button>
      <Button primary onClick={() => setValue(2)}>
        2
      </Button>
      <Button primary onClick={() => setValue(3)}>
        3
      </Button>
      <Button primary onClick={() => setValue(4)}>
        4
      </Button>
      <Button primary onClick={() => setValue(5)}>
        5
      </Button>
      <Button primary onClick={() => setValue(6)}>
        6
      </Button>
      <Button primary onClick={() => setValue(7)}>
        7
      </Button>
      <Button primary onClick={() => setValue(8)}>
        8
      </Button>
      <Button primary onClick={() => setValue(9)}>
        9
      </Button>

      {/* Delete button */}
      {locked && (
        <div className="col-start-2">
          <Button
            primary
            onClick={() => setValue(0)}
            className="flex items-center justify-center"
          >
            <Eraser size={20} />
          </Button>
        </div>
      )}

      {/* Import and Save buttons - only in setup mode */}
      {!locked && (
        <>
          <div>
            <Button
              primary
              onClick={() => dispatch(setImportState("capturing"))}
              className="flex items-center justify-center gap-2"
              title="Import Puzzle"
              aria-label="Import Puzzle"
            >
              <Import size={24} />
            </Button>
          </div>
          <div className="col-start-3">
            <Button
              primary
              onClick={() => dispatch(lockBoard())}
              className="flex items-center justify-center gap-2"
              title="Save Puzzle"
              aria-label="Save Puzzle"
            >
              <Save size={24} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NumberControls;
