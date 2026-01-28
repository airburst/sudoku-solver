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
        <>
          <PlacementControls />
          <GameControls />
        </>
      )}
    </div>
  );
};

export default Controls;
