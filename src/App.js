// import Tesseract from "tesseract.js";
import { useState } from "react";
import { Image } from "image-js";
import "./App.css";
import PuzzleImage from "./puzzle.jpg";

async function execute() {
  let image = await Image.load(PuzzleImage);
  console.log("🚀 ~ file: App.js ~ line 9 ~ execute ~ image", image);

  const convertedImage = image
    .grey() // convert the image to greyscale.
    .resize({ width: 200 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
    .rotate(30); // rotate the image clockwise by 30 degrees.
  // return grey.save("puzzleConverted.png");
  return convertedImage;
}

function App() {
  const [puzzleImage, setPuzzleImage] = useState(PuzzleImage);
  // Read an image (from camera in future)
  execute()
    .then((convertedImage) => console.log(convertedImage))
    .catch(console.error);

  // Process image to grey scale and resize if > 1000px

  // Remove horizontal and vertical lines

  // Chop image into 9 x 9 squares

  // Use tesseract to recognize the number in each square
  // Tesseract.recognize("./puzzle.png", "eng", {
  //   logger: (m) => console.info(m),
  // }).then(({ data: { text } }) => {
  //   console.log(text);
  // });

  // Solve the puzzle

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <img src={puzzleImage} alt="Sudoku puzzle" className="puzzle" />
    </div>
  );
}

export default App;
