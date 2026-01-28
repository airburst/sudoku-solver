import type { Worker } from "tesseract.js";

export interface RecognitionResult {
  value: number; // 0 = empty, 1-9 = digit
  confidence: number; // 0-1
}

export type ProgressCallback = (progress: number) => void;

const BATCH_SIZE = 9; // Process one row at a time
const EMPTY_CELL_THRESHOLD = 0.02; // 2% pixel density threshold

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
 * Check if a cell is empty using pixel density
 * This prevents noise from being misread as digits (especially 1 or 7)
 */
function isCellEmpty(cell: ImageData): boolean {
  const { data, width, height } = cell;
  const totalPixels = width * height;
  let darkPixels = 0;

  // Count dark pixels (potential ink)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale and check if dark
    const gray = (r + g + b) / 3;
    if (gray < 128) {
      darkPixels++;
    }
  }

  const density = darkPixels / totalPixels;
  return density < EMPTY_CELL_THRESHOLD;
}

/**
 * Recognize a single cell using Tesseract
 */
async function recognizeCell(
  cell: ImageData,
  worker: Worker,
): Promise<RecognitionResult> {
  // Convert ImageData to canvas for Tesseract
  const canvas = imageDataToCanvas(cell);

  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(canvas);

    // Parse the recognized text
    const cleanText = text.trim();
    const digit = parseInt(cleanText, 10);

    if (digit >= 1 && digit <= 9) {
      return {
        value: digit,
        confidence: confidence / 100, // Tesseract returns 0-100
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
 * Preprocess cell image for better OCR results
 * Converts to high contrast black and white
 */
export function preprocessCell(cell: ImageData): ImageData {
  const { data, width, height } = cell;
  const newData = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale
    const gray = (r + g + b) / 3;

    // Apply threshold for high contrast
    const value = gray < 128 ? 0 : 255;

    newData[i] = value;
    newData[i + 1] = value;
    newData[i + 2] = value;
    newData[i + 3] = 255; // Full opacity
  }

  return new ImageData(newData, width, height);
}
