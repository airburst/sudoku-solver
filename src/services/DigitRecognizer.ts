import type { Worker } from "tesseract.js";

export interface RecognitionResult {
  value: number; // 0 = empty, 1-9 = digit
  confidence: number; // 0-1
}

export type ProgressCallback = (progress: number) => void;

const BATCH_SIZE = 9; // Process one row at a time
const EMPTY_CELL_THRESHOLD = 0.03; // 3% pixel density threshold
const MIN_OCR_CONFIDENCE = 0.5; // Reject OCR results below 50% confidence
const UPSCALE_FACTOR = 3; // Scale cells 3x for better OCR

/**
 * Recognize digits in cell images using Tesseract OCR
 * Empty cells are detected via pixel density before OCR
 */
export async function recognizeDigits(
  cells: ImageData[],
  worker: Worker,
  onProgress?: ProgressCallback,
): Promise<RecognitionResult[]> {
  const results: RecognitionResult[] = [];
  const totalCells = cells.length;

  for (let i = 0; i < totalCells; i += BATCH_SIZE) {
    const batch = cells.slice(i, Math.min(i + BATCH_SIZE, totalCells));
    const batchResults = await processBatch(batch, worker);
    results.push(...batchResults);

    // Report progress
    const progress = Math.round(((i + batch.length) / totalCells) * 100);
    onProgress?.(progress);
  }

  return results;
}

/**
 * Process a batch of cells
 */
async function processBatch(
  cells: ImageData[],
  worker: Worker,
): Promise<RecognitionResult[]> {
  const results: RecognitionResult[] = [];

  for (const cell of cells) {
    // Check if cell is empty using pixel density
    if (isCellEmpty(cell)) {
      results.push({ value: 0, confidence: 1 });
      continue;
    }

    // Run OCR on non-empty cell
    const result = await recognizeCell(cell, worker);
    results.push(result);
  }

  return results;
}

/**
 * Check if a cell is empty using pixel density with adaptive threshold
 * This prevents noise from being misread as digits (especially 1 or 7)
 */
function isCellEmpty(cell: ImageData): boolean {
  const { data, width, height } = cell;
  const totalPixels = width * height;

  // Get grayscale values and calculate adaptive threshold
  const grayValues = getGrayscaleValues(data);
  const threshold = calculateOtsuThreshold(grayValues);

  // Count dark pixels using adaptive threshold
  let darkPixels = 0;
  for (const gray of grayValues) {
    if (gray <= threshold) {
      darkPixels++;
    }
  }

  const density = darkPixels / totalPixels;
  return density < EMPTY_CELL_THRESHOLD;
}

/**
 * Upscale ImageData using bilinear interpolation
 */
function upscaleCell(
  cell: ImageData,
  factor: number = UPSCALE_FACTOR,
): ImageData {
  const { data, width, height } = cell;
  const newWidth = width * factor;
  const newHeight = height * factor;
  const newData = new Uint8ClampedArray(newWidth * newHeight * 4);

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      // Map back to source coordinates
      const srcX = x / factor;
      const srcY = y / factor;

      // Get surrounding pixel coords
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, width - 1);
      const y1 = Math.min(y0 + 1, height - 1);

      // Bilinear interpolation weights
      const xWeight = srcX - x0;
      const yWeight = srcY - y0;

      const dstIdx = (y * newWidth + x) * 4;

      for (let c = 0; c < 4; c++) {
        const v00 = data[(y0 * width + x0) * 4 + c];
        const v10 = data[(y0 * width + x1) * 4 + c];
        const v01 = data[(y1 * width + x0) * 4 + c];
        const v11 = data[(y1 * width + x1) * 4 + c];

        const top = v00 * (1 - xWeight) + v10 * xWeight;
        const bottom = v01 * (1 - xWeight) + v11 * xWeight;
        newData[dstIdx + c] = Math.round(
          top * (1 - yWeight) + bottom * yWeight,
        );
      }
    }
  }

  return new ImageData(newData, newWidth, newHeight);
}

/**
 * Recognize a single cell using Tesseract
 */
async function recognizeCell(
  cell: ImageData,
  worker: Worker,
): Promise<RecognitionResult> {
  // Upscale then preprocess for better OCR accuracy
  const upscaled = upscaleCell(cell);
  const processedCell = preprocessCell(upscaled);

  // Convert ImageData to canvas for Tesseract
  const canvas = imageDataToCanvas(processedCell);

  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(canvas);

    // Parse the recognized text
    const cleanText = text.trim();
    const digit = parseInt(cleanText, 10);

    const normalizedConfidence = confidence / 100; // Tesseract returns 0-100

    if (
      digit >= 1 &&
      digit <= 9 &&
      normalizedConfidence >= MIN_OCR_CONFIDENCE
    ) {
      return {
        value: digit,
        confidence: normalizedConfidence,
      };
    }

    // If OCR didn't find a valid digit, treat as empty
    return { value: 0, confidence: 0.5 };
  } catch {
    // OCR failed, treat as empty with low confidence
    return { value: 0, confidence: 0.3 };
  }
}

/**
 * Convert ImageData to canvas element for Tesseract
 */
function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

/**
 * Calculate grayscale values from ImageData
 */
function getGrayscaleValues(data: Uint8ClampedArray): number[] {
  const grayValues: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    grayValues.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  return grayValues;
}

/**
 * Calculate optimal threshold using Otsu's method
 * Finds threshold that maximizes between-class variance
 */
function calculateOtsuThreshold(grayValues: number[]): number {
  const histogram = new Array(256).fill(0);
  grayValues.forEach((v) => histogram[Math.floor(v)]++);

  const total = grayValues.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let maxVariance = 0;
  let threshold = 128; // fallback

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;

    const wF = total - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const variance = wB * wF * (mB - mF) * (mB - mF);
    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * Preprocess cell image with adaptive Otsu thresholding
 * Converts to high contrast black and white
 */
export function preprocessCell(cell: ImageData): ImageData {
  const { data, width, height } = cell;
  const newData = new Uint8ClampedArray(data.length);

  // Get grayscale values and calculate adaptive threshold
  const grayValues = getGrayscaleValues(data);
  const threshold = calculateOtsuThreshold(grayValues);

  // Apply threshold
  for (let i = 0; i < data.length; i += 4) {
    const value = grayValues[i / 4] <= threshold ? 0 : 255;
    newData[i] = value;
    newData[i + 1] = value;
    newData[i + 2] = value;
    newData[i + 3] = 255;
  }

  return new ImageData(newData, width, height);
}
