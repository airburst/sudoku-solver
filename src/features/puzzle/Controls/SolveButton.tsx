import solvePuzzle from "@/services/Solver";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setBoard } from "../puzzleSlice";

const SolveButton = () => {
  const board = useAppSelector((state) => state.puzzle.board);
  const dispatch = useAppDispatch();

  const handleSolve = () => {
    const solved = solvePuzzle(board);
    if (solved) {
      dispatch(setBoard(solved));
    }
  };

  return (
    <Button onClick={handleSolve} className="flex items-center justify-center">
      Solve
    </Button>
  );
};

export default SolveButton;
