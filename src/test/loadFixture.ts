import { readFileSync } from "node:fs";
import { join } from "node:path";

const FIXTURES_DIR = join(__dirname, "fixtures");

/**
 * Load an image fixture as a File object (for simulating file upload)
 */
export function loadImageFixture(filename: string): File {
  const path = join(FIXTURES_DIR, filename);
  const buffer = readFileSync(path);
  const blob = new Blob([buffer], { type: getMimeType(filename) });
  return new File([blob], filename, { type: getMimeType(filename) });
}

/**
 * Load an image fixture as ImageData (for direct OpenCV processing)
 */
export async function loadImageAsImageData(
  filename: string,
): Promise<ImageData> {
  const file = loadImageFixture(filename);
  const bitmap = await createImageBitmap(file);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);

  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

/**
 * Load an image fixture as base64 data URL
 */
export function loadImageAsDataUrl(filename: string): string {
  const path = join(FIXTURES_DIR, filename);
  const buffer = readFileSync(path);
  const base64 = buffer.toString("base64");
  return `data:${getMimeType(filename)};base64,${base64}`;
}

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
