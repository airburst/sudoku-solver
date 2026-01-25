import Button from "./Button";

interface PauseScreenProps {
  resumePuzzle: () => void;
}

const PauseScreen = ({ resumePuzzle }: PauseScreenProps) => {
  return (
    <div className="absolute top-0 left-0 z-10 flex items-center justify-center h-screen w-screen bg-selected text-fixed">
      <div className="flex flex-col items-center justify-center h-40 w-full max-w-80 m-4 bg-white rounded-[7px] shadow-[0_4px_23px_0_rgba(0,0,0,0.08)] p-8">
        <span className="flex-1 flex items-center justify-center">
          Your game has been paused
        </span>
        <Button primary onClick={resumePuzzle} className="h-12 mb-4">
          Resume
        </Button>
      </div>
    </div>
  );
};

export default PauseScreen;
