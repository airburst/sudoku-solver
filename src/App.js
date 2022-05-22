// import Tesseract from "tesseract.js";
// import { useState, useCallback, useEffect } from "react";
// import { Image } from "image-js";
import "./App.css";
import Square from "./Square";
// import PuzzleImage from "./puzzle.jpg";

// async function execute() {
//   let image = await Image.load(PuzzleImage);

//   const convertedImage = await image.grey().resize({ width: 200 });
//   // return grey.save("puzzleConverted.png");
//   return convertedImage;
// }

function App() {
  // const [puzzleImage, setPuzzleImage] = useState(null);
  // const [converted, setConverted] = useState(false);

  // Read an image (from camera in future)

  // Process image to grey scale and resize if > 1000px
  // const convert = useCallback(() => {
  //   execute()
  //     .then((convertedImage) => {
  //       convertedImage.src = "converted.jpg";
  //       setPuzzleImage(convertedImage);
  //     })
  //     .catch(console.error);
  // }, []);

  // useEffect(() => {
  //   if (!converted) {
  //     convert();
  //     setConverted(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Remove horizontal and vertical lines

  // Chop image into 9 x 9 squares

  // Use tesseract to recognize the number in each square
  // Tesseract.recognize("./puzzle.png", "eng", {
  //   logger: (m) => console.info(m),
  // }).then(({ data: { text } }) => {
  //   console.log(text);
  // });

  // Solve the puzzle

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
      <h1>Sudoku Solver</h1>
      <div className="puzzle">
        {puzzleData.map((rowData, rowIndex) => (
          <Square key={`row-${rowIndex}`} row={rowIndex} data={rowData} />
        ))}
      </div>
    </div>
  );
}

export default App;
