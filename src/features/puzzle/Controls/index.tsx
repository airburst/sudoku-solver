import { useAppSelector } from "@/hooks/redux";
import NumberControls from "./NumberControls";
import PlacementControls from "./PlacementControls";
import GameControls from "./GameControls";

const Controls = () => {
  const locked = useAppSelector((state) => state.puzzle.locked);

  return (
    <div className="flex flex-col w-full">
      <NumberControls />
      {locked && (
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2 mt-2">
          <PlacementControls />
          <GameControls />
        </div>
      )}
    </div>
  );
};

export default Controls;
