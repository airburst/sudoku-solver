/* eslint-disable @typescript-eslint/no-explicit-any */

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
  opencv: any,
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
    // Use larger extraction for higher-res inputs to preserve detail
    const inputSize = Math.max(imageData.width, imageData.height);
    const gridSize = inputSize > 1400 ? 720 : 450;
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
function findLargestQuadrilateral(contours: any, opencv: any): any | null {
  let maxArea = 0;
  let bestContour: any | null = null;

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
function orderPoints(pts: any): number[][] {
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
  src: any,
  contour: any,
  size: number,
  opencv: any,
): any {
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
function extractCells(grid: any, opencv: any): ImageData[] {
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
function matToImageData(mat: any, opencv: any): ImageData {
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
 * Apply EXIF orientation transform to canvas context.
 * Must be called BEFORE drawing the image.
 */
function applyExifOrientation(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
): void {
  switch (orientation) {
    case 2: // Flip horizontal
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // Rotate 180
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4: // Flip vertical
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5: // Rotate 90 CW + flip horizontal
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      ctx.translate(0, -height);
      ctx.scale(1, -1);
      break;
    case 6: // Rotate 90 CW
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 7: // Rotate 90 CCW + flip horizontal
      ctx.translate(0, width);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-height, 0);
      ctx.scale(1, -1);
      break;
    case 8: // Rotate 270 CW (90 CCW)
      ctx.translate(0, width);
      ctx.rotate(-Math.PI / 2);
      break;
    // case 1 and default: no transform needed
  }
}

/**
 * Get output dimensions after applying EXIF orientation
 */
function getOrientedDimensions(
  width: number,
  height: number,
  orientation: number,
): { width: number; height: number } {
  // Orientations 5-8 swap width and height
  if (orientation >= 5 && orientation <= 8) {
    return { width: height, height: width };
  }
  return { width, height };
}

/**
 * Load an image from a data URL and return ImageData.
 * Large images are downscaled using high-quality multi-step resize.
 * Applies EXIF orientation transform if provided.
 */
export async function imageDataFromDataUrl(
  dataUrl: string,
  maxSize = 1500,
  orientation = 1,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const origWidth = img.width;
      const origHeight = img.height;

      // Get dimensions after orientation is applied
      const oriented = getOrientedDimensions(origWidth, origHeight, orientation);
      let { width, height } = oriented;

      // First, apply orientation to get correctly rotated image
      const rotatedCanvas = document.createElement("canvas");
      rotatedCanvas.width = width;
      rotatedCanvas.height = height;
      const rotatedCtx = rotatedCanvas.getContext("2d");
      if (!rotatedCtx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Apply orientation transform and draw
      if (orientation !== 1) {
        applyExifOrientation(rotatedCtx, orientation, origWidth, origHeight);
      }
      rotatedCtx.drawImage(img, 0, 0);

      const needsResize = width > maxSize || height > maxSize;

      if (!needsResize) {
        // No resize needed - return rotated image directly
        resolve(rotatedCtx.getImageData(0, 0, width, height));
        return;
      }

      // Multi-step downscale for better quality (halve until close to target)
      let srcCanvas = rotatedCanvas;

      // Step down by halves until within 2x of target
      while (width > maxSize * 2 || height > maxSize * 2) {
        const newWidth = Math.round(width / 2);
        const newHeight = Math.round(height / 2);

        const dstCanvas = document.createElement("canvas");
        dstCanvas.width = newWidth;
        dstCanvas.height = newHeight;
        const dstCtx = dstCanvas.getContext("2d");
        if (!dstCtx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        dstCtx.imageSmoothingEnabled = true;
        dstCtx.imageSmoothingQuality = "high";
        dstCtx.drawImage(srcCanvas, 0, 0, newWidth, newHeight);

        srcCanvas = dstCanvas;
        width = newWidth;
        height = newHeight;
      }

      // Final resize to target
      const scale = maxSize / Math.max(width, height);
      const finalWidth = Math.round(width * scale);
      const finalHeight = Math.round(height * scale);

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = finalWidth;
      finalCanvas.height = finalHeight;
      const finalCtx = finalCanvas.getContext("2d");
      if (!finalCtx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = "high";
      finalCtx.drawImage(srcCanvas, 0, 0, finalWidth, finalHeight);

      resolve(finalCtx.getImageData(0, 0, finalWidth, finalHeight));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
