import { useAppSelector } from "@/hooks/redux";
import NumberControls from "./NumberControls";
import PlacementControls from "./PlacementControls";
import GameControls from "./GameControls";

const Controls = () => {
  const locked = useAppSelector((state) => state.puzzle.locked);

  return (
    <div className="flex-1 flex flex-col w-[calc(100%-1rem)] md:max-w-75 md:m-8 md:min-h-50">
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
