import { describe, it, expect, vi, beforeAll } from "vitest";
import { recognizeDigits, preprocessCell } from "./DigitRecognizer";
import type { Worker } from "tesseract.js";

// Polyfill ImageData for Node environment
beforeAll(() => {
  if (typeof globalThis.ImageData === "undefined") {
    globalThis.ImageData = class ImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;

      constructor(data: Uint8ClampedArray, width: number, height?: number) {
        this.data = data;
        this.width = width;
        this.height = height ?? data.length / 4 / width;
      }
    } as typeof globalThis.ImageData;
  }
});

// Helper to create ImageData with specific pixel density
function createImageData(
  width: number,
  height: number,
  darkPixelRatio: number,
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  const totalPixels = width * height;
  const darkPixelCount = Math.floor(totalPixels * darkPixelRatio);

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const isDark = i < darkPixelCount;
    const value = isDark ? 0 : 255;

    data[idx] = value; // R
    data[idx + 1] = value; // G
    data[idx + 2] = value; // B
    data[idx + 3] = 255; // A
  }

  return new ImageData(data, width, height);
}

// Mock Tesseract worker
function createMockWorker(recognizeResult: {
  text: string;
  confidence: number;
}) {
  return {
    recognize: vi.fn().mockResolvedValue({
      data: recognizeResult,
    }),
  } as unknown as Worker;
}

describe("DigitRecognizer", () => {
  describe("recognizeDigits", () => {
    it("should detect empty cells via pixel density", async () => {
      // Create cells with very low pixel density (empty)
      const emptyCells = [
        createImageData(50, 50, 0.01), // 1% dark pixels - empty
        createImageData(50, 50, 0.005), // 0.5% dark pixels - empty
      ];

      const mockWorker = createMockWorker({ text: "", confidence: 0 });
      const results = await recognizeDigits(emptyCells, mockWorker);

      expect(results).toHaveLength(2);
      expect(results[0].value).toBe(0);
      expect(results[0].confidence).toBe(1);
      expect(results[1].value).toBe(0);
      expect(results[1].confidence).toBe(1);

      // Worker should not be called for empty cells
      expect(mockWorker.recognize).not.toHaveBeenCalled();
    });

    it("should call OCR for non-empty cells", async () => {
      // Create cell with significant pixel density
      const nonEmptyCell = createImageData(50, 50, 0.1); // 10% dark pixels

      const mockWorker = createMockWorker({ text: "5", confidence: 95 });
      const results = await recognizeDigits([nonEmptyCell], mockWorker);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(5);
      expect(results[0].confidence).toBeCloseTo(0.95);
      expect(mockWorker.recognize).toHaveBeenCalledTimes(1);
    });

    it("should handle mixed empty and non-empty cells", async () => {
      const cells = [
        createImageData(50, 50, 0.01), // Empty
        createImageData(50, 50, 0.15), // Has digit
        createImageData(50, 50, 0.005), // Empty
      ];

      const mockWorker = createMockWorker({ text: "7", confidence: 90 });
      const results = await recognizeDigits(cells, mockWorker);

      expect(results).toHaveLength(3);
      expect(results[0].value).toBe(0); // Empty
      expect(results[1].value).toBe(7); // Recognized
      expect(results[2].value).toBe(0); // Empty

      // Only non-empty cell triggers OCR
      expect(mockWorker.recognize).toHaveBeenCalledTimes(1);
    });

    it("should report progress during batch processing", async () => {
      const cells = Array(18)
        .fill(null)
        .map(() => createImageData(50, 50, 0.01)); // All empty

      const mockWorker = createMockWorker({ text: "", confidence: 0 });
      const progressUpdates: number[] = [];

      await recognizeDigits(cells, mockWorker, (progress) => {
        progressUpdates.push(progress);
      });

      // Should have progress updates for batches
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
    });

    it("should return 0 for invalid OCR results", async () => {
      const cell = createImageData(50, 50, 0.1);
      const mockWorker = createMockWorker({ text: "X", confidence: 50 });

      const results = await recognizeDigits([cell], mockWorker);

      expect(results[0].value).toBe(0);
    });
  });

  describe("preprocessCell", () => {
    it("should convert to high contrast black and white", () => {
      // Create grayscale image with mid-tones
      const data = new Uint8ClampedArray(4 * 4 * 4);
      for (let i = 0; i < 16; i++) {
        const idx = i * 4;
        const value = i < 8 ? 64 : 192; // Dark and light pixels
        data[idx] = value;
        data[idx + 1] = value;
        data[idx + 2] = value;
        data[idx + 3] = 255;
      }
      const input = new ImageData(data, 4, 4);

      const result = preprocessCell(input);

      // Check first pixel (was dark, should be black)
      expect(result.data[0]).toBe(0);
      expect(result.data[1]).toBe(0);
      expect(result.data[2]).toBe(0);

      // Check last pixel (was light, should be white)
      const lastIdx = 15 * 4;
      expect(result.data[lastIdx]).toBe(255);
      expect(result.data[lastIdx + 1]).toBe(255);
      expect(result.data[lastIdx + 2]).toBe(255);
    });
  });
});
