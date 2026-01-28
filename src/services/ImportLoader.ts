import type { createWorker, Worker } from "tesseract.js";

type OpenCVModule = typeof import("@techstark/opencv-js");

interface LoadedLibraries {
  cv: OpenCVModule;
  tesseractWorker: Worker;
}

let cachedLibraries: LoadedLibraries | null = null;
let loadingPromise: Promise<LoadedLibraries> | null = null;

/**
 * Lazily loads OpenCV.js and initializes a Tesseract worker.
 * Results are cached - subsequent calls return immediately.
 */
export async function loadLibraries(): Promise<LoadedLibraries> {
  if (cachedLibraries) {
    return cachedLibraries;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    // Load OpenCV first
    const cvModule = await import("@techstark/opencv-js");
    const cv = cvModule.default || cvModule;

    // Wait for OpenCV to be ready (it has async initialization)
    if (cv.onRuntimeInitialized === undefined) {
      await new Promise<void>((resolve) => {
        cv.onRuntimeInitialized = () => resolve();
      });
    }

    // Initialize Tesseract worker
    const tesseract = await import("tesseract.js");
    const createWorkerFn = tesseract.createWorker as typeof createWorker;
    const tesseractWorker = await createWorkerFn("eng", 1, {
      // Use CDN for language data
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
    });

    // Configure for digit recognition only
    await tesseractWorker.setParameters({
      tessedit_char_whitelist: "123456789",
    });

    cachedLibraries = { cv, tesseractWorker };
    return cachedLibraries;
  })();

  return loadingPromise;
}

/**
 * Terminates the Tesseract worker to free memory.
 * Call when import modal closes.
 */
export async function terminateWorker(): Promise<void> {
  if (cachedLibraries?.tesseractWorker) {
    await cachedLibraries.tesseractWorker.terminate();
    cachedLibraries = null;
    loadingPromise = null;
  }
}

/**
 * Check if libraries are already loaded
 */
export function isLoaded(): boolean {
  return cachedLibraries !== null;
}
