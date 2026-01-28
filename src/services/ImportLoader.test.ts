import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the external libraries
vi.mock("@techstark/opencv-js", () => ({
  default: {
    onRuntimeInitialized: undefined,
  },
}));

vi.mock("tesseract.js", () => ({
  createWorker: vi.fn().mockResolvedValue({
    setParameters: vi.fn().mockResolvedValue(undefined),
    terminate: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("ImportLoader", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should export loadLibraries function", async () => {
    const { loadLibraries } = await import("./ImportLoader");
    expect(typeof loadLibraries).toBe("function");
  });

  it("should export terminateWorker function", async () => {
    const { terminateWorker } = await import("./ImportLoader");
    expect(typeof terminateWorker).toBe("function");
  });

  it("should export isLoaded function", async () => {
    const { isLoaded } = await import("./ImportLoader");
    expect(typeof isLoaded).toBe("function");
  });

  it("should report not loaded initially", async () => {
    const { isLoaded } = await import("./ImportLoader");
    expect(isLoaded()).toBe(false);
  });
});
