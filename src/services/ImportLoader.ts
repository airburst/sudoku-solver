import type { createWorker, Worker } from "tesseract.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OpenCVModule = any;

interface LoadedLibraries {
  cv: OpenCVModule;
  tesseractWorker: Worker;
}

let cachedLibraries: LoadedLibraries | null = null;
let loadingPromise: Promise<LoadedLibraries> | null = null;

const OPENCV_CDN_URL = "https://docs.opencv.org/4.9.0/opencv.js";

/**
 * Load OpenCV.js via script tag injection.
 * Returns a marker string - get cv from window.__opencv_cv after awaiting.
 * (Resolving with the cv object directly blocks promise resolution due to WASM Proxy)
 */
function loadOpenCVScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    // Check if already loaded
    if (win.cv?.Mat) {
      win.__opencv_cv = win.cv;
      // setTimeout needed to avoid WASM blocking the event loop
      setTimeout(() => resolve(), 0);
      return;
    }

    const script = document.createElement("script");
    script.src = OPENCV_CDN_URL;
    script.async = true;

    const timeoutId = setTimeout(() => {
      reject(new Error("OpenCV load timeout after 30s"));
    }, 30000);

    script.onload = () => {
      // OpenCV sets up cv on window, poll until WASM is ready
      const checkReady = () => {
        const cv = win.cv;
        if (cv?.Mat) {
          clearTimeout(timeoutId);
          win.__opencv_cv = cv;
          // setTimeout breaks out of synchronous WASM blocking
          setTimeout(() => resolve(), 0);
        } else if (cv?.onRuntimeInitialized !== undefined) {
          cv.onRuntimeInitialized = () => {
            clearTimeout(timeoutId);
            win.__opencv_cv = cv;
            setTimeout(() => resolve(), 0);
          };
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Failed to load OpenCV script"));
    };

    document.head.appendChild(script);
  });
}

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
    // Load OpenCV via script tag
    await loadOpenCVScript();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cv = (window as any).__opencv_cv;

    // Initialize Tesseract worker
    const tesseract = await import("tesseract.js");
    const createWorkerFn = tesseract.createWorker as typeof createWorker;
    const tesseractWorker = await createWorkerFn("eng", 1, {
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
