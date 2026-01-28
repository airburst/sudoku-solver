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
    console.log("[ImportLoader] Starting library load...");

    // Load OpenCV first
    console.log("[ImportLoader] Importing OpenCV module...");
    const cvModule = await import("@techstark/opencv-js");
    console.log("[ImportLoader] OpenCV module imported, getting default...");
    const cv = cvModule.default || cvModule;

    // Wait for OpenCV to be ready (it has async initialization)
    // Check if already ready by testing if Mat constructor exists
    console.log("[ImportLoader] Checking OpenCV ready state, cv.Mat:", typeof cv.Mat);
    if (typeof cv.Mat === "undefined") {
      console.log("[ImportLoader] Waiting for OpenCV runtime initialization...");
      await new Promise<void>((resolve) => {
        cv.onRuntimeInitialized = () => {
          console.log("[ImportLoader] OpenCV runtime initialized");
          resolve();
        };
      });
    } else {
      console.log("[ImportLoader] OpenCV already ready");
    }

    // Initialize Tesseract worker
    console.log("[ImportLoader] Importing Tesseract...");
    const tesseract = await import("tesseract.js");
    console.log("[ImportLoader] Creating Tesseract worker...");
    const createWorkerFn = tesseract.createWorker as typeof createWorker;
    const tesseractWorker = await createWorkerFn("eng", 1, {
      // Use CDN for language data
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
    });
    console.log("[ImportLoader] Tesseract worker created");

    // Configure for digit recognition only
    console.log("[ImportLoader] Configuring Tesseract parameters...");
    await tesseractWorker.setParameters({
      tessedit_char_whitelist: "123456789",
    });
    console.log("[ImportLoader] Libraries loaded successfully");

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
