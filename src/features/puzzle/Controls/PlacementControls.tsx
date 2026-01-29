import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeMode } from "../puzzleSlice";
import type { Mode } from "@/types/puzzle";

const PlacementControls = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.puzzle.mode);

  const setMode = (m: Mode) => dispatch(changeMode(m));

  return (
    <div className="flex flex-row col-span-2">
      <Button
        active={mode === "normal"}
        onClick={() => setMode("normal")}
        className="border-0 rounded-none first:rounded-l-md"
      >
        Normal
      </Button>
      <Button
        active={mode === "notes"}
        onClick={() => setMode("notes")}
        className="border-0 rounded-none last:rounded-r-md"
      >
        Notes
      </Button>
    </div>
  );
};

export default PlacementControls;
