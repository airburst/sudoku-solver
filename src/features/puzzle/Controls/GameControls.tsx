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
    <div className="grid w-full grid-cols-3 grid-rows-[repeat(3,4rem)] gap-2 mt-2">
      <Button
        onClick={() => dispatch(restart())}
        className="flex items-center justify-center"
      >
        Restart
      </Button>
      <Button onClick={() => dispatch(reset())}>Reset</Button>
      <Button
        onClick={handleSolve}
        className="flex items-center justify-center"
      >
        Solve
      </Button>
    </div>
  );
};

export default GameControls;
