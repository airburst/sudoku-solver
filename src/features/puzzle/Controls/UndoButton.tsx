import { Undo2 } from "lucide-react";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { undo } from "../puzzleSlice";

const UndoButton = () => {
  const dispatch = useAppDispatch();
  const hasHistory = useAppSelector(
    (state) => (state.puzzle.history?.length ?? 0) > 0,
  );

  return (
    <Button
      onClick={() => dispatch(undo())}
      disabled={!hasHistory}
      className="flex items-center justify-center"
      title="Undo"
      aria-label="Undo"
    >
      <Undo2 size={20} />
    </Button>
  );
};

export default UndoButton;
