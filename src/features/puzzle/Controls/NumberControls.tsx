import { Camera } from "lucide-react";
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

  return (
    <div className="grid grid-cols-3 gap-2 w-full grid-rows-[repeat(3,3rem)]">
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
        <div className="h-12 col-span-3">
          <Button primary onClick={() => setValue(0)}>
            X
          </Button>
        </div>
      )}

      {/* Import and Save buttons - only in setup mode */}
      {!locked && (
        <>
          <div className="col-span-3 h-12">
            <Button onClick={() => dispatch(setImportState("capturing"))}>
              <span className="flex items-center justify-center gap-2">
                <Camera size={20} />
                Import
              </span>
            </Button>
          </div>
          <div className="col-span-3 h-12">
            <Button primary onClick={() => dispatch(lockBoard())}>
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NumberControls;
