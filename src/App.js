// import { useState, useCallback, useEffect } from "react";
import PuzzleBoard from "./components/PuzzleBoard";

function App() {
  // Render the puzzle
  const puzzleData = [
    [6, 3, 0, 0, 0, 0, 0, 8, 1],
    [0, 2, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 1, 7, 4, 3, 0],
    [0, 9, 6, 4, 0, 0, 5, 7, 0],
    [0, 0, 0, 7, 6, 2, 0, 0, 0],
    [0, 8, 0, 0, 0, 0, 6, 0, 0],
    [0, 6, 0, 0, 2, 0, 0, 0, 0],
    [3, 0, 9, 0, 0, 0, 0, 6, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 9],
  ];

  return (
    <div className="App">
      <PuzzleBoard data={puzzleData} />
    </div>
  );
}

export default App;
