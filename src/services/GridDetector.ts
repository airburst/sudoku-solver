import type cv from "@techstark/opencv-js";

export interface GridDetectionResult {
  cells: ImageData[];
  gridImage: ImageData;
}

export class GridDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GridDetectionError";
  }
}

/**
 * Detect and extract a sudoku grid from an image
 */
export async function detectGrid(
  imageData: ImageData,
  opencv: typeof cv,
): Promise<GridDetectionResult> {
  const src = opencv.matFromImageData(imageData);
  const gray = new opencv.Mat();
  const thresh = new opencv.Mat();
  const contours = new opencv.MatVector();
  const hierarchy = new opencv.Mat();

  try {
    // Convert to grayscale
    opencv.cvtColor(src, gray, opencv.COLOR_RGBA2GRAY);

    // Apply Gaussian blur to reduce noise
    opencv.GaussianBlur(gray, gray, new opencv.Size(5, 5), 0);

    // Apply adaptive threshold
    opencv.adaptiveThreshold(
      gray,
      thresh,
      255,
      opencv.ADAPTIVE_THRESH_GAUSSIAN_C,
      opencv.THRESH_BINARY_INV,
      11,
      2,
    );

    // Find contours
    opencv.findContours(
      thresh,
      contours,
      hierarchy,
      opencv.RETR_EXTERNAL,
      opencv.CHAIN_APPROX_SIMPLE,
    );

    // Find the largest quadrilateral contour (the puzzle)
    const gridContour = findLargestQuadrilateral(contours, opencv);
    if (!gridContour) {
      throw new GridDetectionError(
        "Could not find puzzle grid. Try taking a clearer photo with the puzzle filling more of the frame.",
      );
    }

    // Get perspective transform to extract square grid
    const gridSize = 450; // Output size for the grid
    const warped = perspectiveTransform(src, gridContour, gridSize, opencv);

    // Extract grid ImageData
    const gridImage = matToImageData(warped, opencv);

    // Slice into 81 cells
    const cells = extractCells(warped, opencv);

    warped.delete();

    return { cells, gridImage };
  } finally {
    // Clean up OpenCV matrices
    src.delete();
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

/**
 * Find the largest 4-sided contour in the image
 */
function findLargestQuadrilateral(
  contours: cv.MatVector,
  opencv: typeof cv,
): cv.Mat | null {
  let maxArea = 0;
  let bestContour: cv.Mat | null = null;

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = opencv.contourArea(contour);

    // Skip small contours
    if (area < 1000) continue;

    // Approximate the contour to a polygon
    const peri = opencv.arcLength(contour, true);
    const approx = new opencv.Mat();
    opencv.approxPolyDP(contour, approx, 0.02 * peri, true);

    // Check if it's a quadrilateral and larger than current best
    if (approx.rows === 4 && area > maxArea) {
      if (bestContour) bestContour.delete();
      maxArea = area;
      bestContour = approx;
    } else {
      approx.delete();
    }
  }

  return bestContour;
}

/**
 * Order points clockwise starting from top-left
 */
function orderPoints(pts: cv.Mat): number[][] {
  const points: number[][] = [];
  for (let i = 0; i < 4; i++) {
    points.push([pts.data32S[i * 2], pts.data32S[i * 2 + 1]]);
  }

  // Sort by y coordinate to get top and bottom pairs
  points.sort((a, b) => a[1] - b[1]);

  // Top two points - leftmost is top-left
  const top = points.slice(0, 2).sort((a, b) => a[0] - b[0]);
  // Bottom two points - leftmost is bottom-left
  const bottom = points.slice(2, 4).sort((a, b) => a[0] - b[0]);

  // Return in order: top-left, top-right, bottom-right, bottom-left
  return [top[0], top[1], bottom[1], bottom[0]];
}

/**
 * Apply perspective transform to get a square image of the grid
 */
function perspectiveTransform(
  src: cv.Mat,
  contour: cv.Mat,
  size: number,
  opencv: typeof cv,
): cv.Mat {
  const ordered = orderPoints(contour);

  // Source points from the contour
  const srcPts = opencv.matFromArray(4, 1, opencv.CV_32FC2, [
    ordered[0][0],
    ordered[0][1],
    ordered[1][0],
    ordered[1][1],
    ordered[2][0],
    ordered[2][1],
    ordered[3][0],
    ordered[3][1],
  ]);

  // Destination points for square output
  const dstPts = opencv.matFromArray(4, 1, opencv.CV_32FC2, [
    0,
    0,
    size,
    0,
    size,
    size,
    0,
    size,
  ]);

  const M = opencv.getPerspectiveTransform(srcPts, dstPts);
  const warped = new opencv.Mat();
  opencv.warpPerspective(
    src,
    warped,
    M,
    new opencv.Size(size, size),
    opencv.INTER_LINEAR,
    opencv.BORDER_CONSTANT,
    new opencv.Scalar(255, 255, 255, 255),
  );

  srcPts.delete();
  dstPts.delete();
  M.delete();
  contour.delete();

  return warped;
}

/**
 * Extract 81 cell images from the warped grid
 */
function extractCells(grid: cv.Mat, opencv: typeof cv): ImageData[] {
  const cells: ImageData[] = [];
  const cellSize = Math.floor(grid.cols / 9);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Add small margin to avoid grid lines
      const margin = Math.floor(cellSize * 0.1);
      const x = col * cellSize + margin;
      const y = row * cellSize + margin;
      const w = cellSize - margin * 2;
      const h = cellSize - margin * 2;

      const rect = new opencv.Rect(x, y, w, h);
      const cell = grid.roi(rect);

      cells.push(matToImageData(cell, opencv));
      cell.delete();
    }
  }

  return cells;
}

/**
 * Convert OpenCV Mat to ImageData
 */
function matToImageData(mat: cv.Mat, opencv: typeof cv): ImageData {
  // Ensure we have RGBA format
  const rgba = new opencv.Mat();
  if (mat.channels() === 1) {
    opencv.cvtColor(mat, rgba, opencv.COLOR_GRAY2RGBA);
  } else if (mat.channels() === 3) {
    opencv.cvtColor(mat, rgba, opencv.COLOR_RGB2RGBA);
  } else {
    mat.copyTo(rgba);
  }

  const imageData = new ImageData(
    new Uint8ClampedArray(rgba.data),
    rgba.cols,
    rgba.rows,
  );

  rgba.delete();
  return imageData;
}

/**
 * Load an image from a data URL and return ImageData
 */
export async function imageDataFromDataUrl(
  dataUrl: string,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
