import { describe, it, expect } from "vitest";
import { isHeicFile, isHeicByMagicBytes } from "./ImageProcessor";

describe("ImageProcessor", () => {
  describe("isHeicFile", () => {
    it("detects HEIC by mime type", () => {
      const file = new File([], "test.jpg", { type: "image/heic" });
      expect(isHeicFile(file)).toBe(true);
    });

    it("detects HEIF by mime type", () => {
      const file = new File([], "test.jpg", { type: "image/heif" });
      expect(isHeicFile(file)).toBe(true);
    });

    it("detects HEIC sequence by mime type", () => {
      const file = new File([], "test.jpg", { type: "image/heic-sequence" });
      expect(isHeicFile(file)).toBe(true);
    });

    it("detects HEIC by extension", () => {
      const file = new File([], "photo.HEIC", { type: "" });
      expect(isHeicFile(file)).toBe(true);
    });

    it("detects HEIF by extension", () => {
      const file = new File([], "photo.heif", { type: "" });
      expect(isHeicFile(file)).toBe(true);
    });

    it("returns false for JPEG", () => {
      const file = new File([], "photo.jpg", { type: "image/jpeg" });
      expect(isHeicFile(file)).toBe(false);
    });

    it("returns false for PNG", () => {
      const file = new File([], "photo.png", { type: "image/png" });
      expect(isHeicFile(file)).toBe(false);
    });
  });

  describe("isHeicByMagicBytes", () => {
    it("detects HEIC by magic bytes (heic brand)", async () => {
      // HEIC magic: offset 4 = "ftyp", offset 8 = "heic"
      const bytes = new Uint8Array([
        0x00, 0x00, 0x00, 0x18, // box size
        0x66, 0x74, 0x79, 0x70, // "ftyp"
        0x68, 0x65, 0x69, 0x63, // "heic"
      ]);
      const file = new File([bytes], "test", { type: "" });
      expect(await isHeicByMagicBytes(file)).toBe(true);
    });

    it("detects HEIC by magic bytes (mif1 brand)", async () => {
      const bytes = new Uint8Array([
        0x00, 0x00, 0x00, 0x18,
        0x66, 0x74, 0x79, 0x70, // "ftyp"
        0x6d, 0x69, 0x66, 0x31, // "mif1"
      ]);
      const file = new File([bytes], "test", { type: "" });
      expect(await isHeicByMagicBytes(file)).toBe(true);
    });

    it("returns false for JPEG magic bytes", async () => {
      const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const file = new File([bytes], "test.jpg", { type: "image/jpeg" });
      expect(await isHeicByMagicBytes(file)).toBe(false);
    });

    it("returns false for PNG magic bytes", async () => {
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      const file = new File([bytes], "test.png", { type: "image/png" });
      expect(await isHeicByMagicBytes(file)).toBe(false);
    });

    it("returns false for empty file", async () => {
      const file = new File([], "test", { type: "" });
      expect(await isHeicByMagicBytes(file)).toBe(false);
    });
  });
});
