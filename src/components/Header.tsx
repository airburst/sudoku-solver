import { useEffect } from "react";
import { Camera, Plus, RotateCcw, Save, Sparkles } from "lucide-react";
import DropdownMenu from "./DropdownMenu";
import PauseButton from "./PauseButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  incrementClock,
  lockBoard,
  pause,
  reset,
  restart,
  setBoard,
} from "@/features/puzzle/puzzleSlice";
import { setImportState } from "@/features/import/importSlice";
import solvePuzzle from "@/services/Solver";

export default function Header() {
  const dispatch = useAppDispatch();
  const locked = useAppSelector((state) => state.puzzle.locked);
  const clock = useAppSelector((state) => state.puzzle.clock);
  const paused = useAppSelector((state) => state.puzzle.paused);
  const board = useAppSelector((state) => state.puzzle.board);

  useEffect(() => {
    if (!locked || paused) return;
    const timer = setInterval(() => dispatch(incrementClock()), 1000);
    return () => clearInterval(timer);
  }, [dispatch, locked, paused]);

  const hours = Math.floor(clock / 3600);
  const minutes = Math.floor((clock % 3600) / 60);
  const seconds = clock % 60;
  const timeString =
    hours === 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleSolve = () => {
    const solved = solvePuzzle(board);
    if (solved) dispatch(setBoard(solved));
  };

  const setupMenuItems = [
    {
      icon: <Save size={20} />,
      label: "Save puzzle",
      onClick: () => dispatch(lockBoard()),
    },
    {
      icon: <Camera size={20} />,
      label: "Capture puzzle",
      onClick: () => dispatch(setImportState("capturing")),
    },
  ];

  const playMenuItems = [
    { icon: <Sparkles size={20} />, label: "Solve", onClick: handleSolve },
    {
      icon: <RotateCcw size={20} />,
      label: "Start again",
      onClick: () => dispatch(restart()),
    },
    {
      icon: <Plus size={20} />,
      label: "New puzzle",
      onClick: () => dispatch(reset()),
    },
    {
      icon: <Camera size={20} />,
      label: "Capture puzzle",
      onClick: () => dispatch(setImportState("capturing")),
    },
  ];

  const menuItems = locked ? playMenuItems : setupMenuItems;

  return (
    <header className="h-16 grid grid-cols-3 items-center bg-stone-200 text-stone-900">
      {locked && (
        <div className="flex items-center justify-center text-2xl col-start-2">
          <span className="w-24">{timeString}</span>
          <PauseButton onClick={() => dispatch(pause())} />
        </div>
      )}
      <div className="col-start-3 justify-end flex">
        <DropdownMenu items={menuItems} />
      </div>
    </header>
  );
}
