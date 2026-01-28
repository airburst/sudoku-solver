import solvePuzzle from "@/services/Solver";
import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { restart, reset, setBoard } from "../puzzleSlice";

const GameControls = () => {
  const board = useAppSelector((state) => state.puzzle.board);
  const dispatch = useAppDispatch();

  const handleSolve = () => {
    const solved = solvePuzzle(board);
    if (solved) {
      dispatch(setBoard(solved));
    }
  };

  return (
    <div className="grid w-full grid-cols-2 grid-rows-[repeat(2,3rem)] gap-2 mt-4">
      <Button onClick={() => dispatch(restart())}>Restart</Button>
      <Button onClick={handleSolve}>Solve</Button>
      <Button onClick={() => dispatch(reset())}>Reset</Button>
    </div>
  );
};

export default GameControls;
