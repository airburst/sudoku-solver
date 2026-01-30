import { Save } from "lucide-react";
import {
  lockBoard,
  setSelectedCellsNotes,
  setSelectedCellsValue,
} from "../puzzleSlice";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const NumberControls = () => {
  const dispatch = useAppDispatch();
  const locked = useAppSelector((state) => state.puzzle.locked);
  const mode = useAppSelector((state) => state.puzzle.mode);

  const setValue = (val: number) => {
    if (val === 0) {
      // Eraser clears both value and notes
      dispatch(setSelectedCellsValue(0));
      return;
    }
    if (mode === "normal" || mode === "setup") {
      dispatch(setSelectedCellsValue(val));
    }
    if (mode === "notes") {
      dispatch(setSelectedCellsNotes(val));
    }
  };

  return (
    <div
      className={`grid grid-cols-[repeat(5,4rem)] gap-2 grid-rows-[repeat(4,4rem)] mt-2 lg:mt-0 mx-auto`}
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

      {/* Delete button (locked mode) */}
      {locked && (
        <Button
          primary
          onClick={() => setValue(0)}
          className="flex items-center justify-center"
        >
          X
        </Button>
      )}

      {/* Save button (setup mode) */}
      {!locked && (
        <Button
          primary
          onClick={() => dispatch(lockBoard())}
          className="flex items-center justify-center"
        >
          <Save size={20} />
        </Button>
      )}
    </div>
  );
};

export default NumberControls;
