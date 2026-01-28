import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeMode } from "../puzzleSlice";
import type { Mode } from "@/types/puzzle";

const PlacementControls = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.puzzle.mode);

  const setMode = (m: Mode) => dispatch(changeMode(m));

  return (
    <div className="flex flex-row w-[calc(100%-4px)] border-2 border-btn rounded-[5px] mt-2">
      <Button
        primary={mode === "normal"}
        onClick={() => setMode("normal")}
        className="border-0 rounded-none first:rounded-l-[3px]"
      >
        Normal
      </Button>
      <Button
        primary={mode === "corner"}
        onClick={() => setMode("corner")}
        className="border-0 rounded-none border-x-2 border-x-btn"
      >
        Corner
      </Button>
      <Button
        primary={mode === "centre"}
        onClick={() => setMode("centre")}
        className="border-0 rounded-none last:rounded-r-[3px]"
      >
        Centre
      </Button>
    </div>
  );
};

export default PlacementControls;
