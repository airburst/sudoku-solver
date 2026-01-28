import { describe, it, expect } from "vitest";
import { GridDetectionError } from "./GridDetector";

describe("GridDetector", () => {
  describe("GridDetectionError", () => {
    it("should create error with correct name", () => {
      const error = new GridDetectionError("Test error");
      expect(error.name).toBe("GridDetectionError");
      expect(error.message).toBe("Test error");
    });

    it("should be instanceof Error", () => {
      const error = new GridDetectionError("Test");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof GridDetectionError).toBe(true);
    });
  });

  describe("imageDataFromDataUrl", () => {
    it("should export the function", async () => {
      const { imageDataFromDataUrl } = await import("./GridDetector");
      expect(typeof imageDataFromDataUrl).toBe("function");
    });
  });

  describe("detectGrid", () => {
    it("should export the function", async () => {
      const { detectGrid } = await import("./GridDetector");
      expect(typeof detectGrid).toBe("function");
    });
  });
});
