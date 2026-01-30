import { changeMode } from "../puzzleSlice";
import type { Mode } from "@/types/puzzle";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const NotesToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.puzzle.mode);

  const setMode = (m: Mode) => dispatch(changeMode(m));

  return (
    <div className="flex flex-row h-full">
      <Button
        active={mode === "normal"}
        onClick={() => setMode("normal")}
        className="border-0 rounded-none first:rounded-l-md text-lg"
      >
        Normal
      </Button>
      <Button
        active={mode === "notes"}
        onClick={() => setMode("notes")}
        className="border-0 rounded-none last:rounded-r-md text-lg"
      >
        Notes
      </Button>
    </div>
  );
};

export default NotesToggle;
