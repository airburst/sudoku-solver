/**
 * Image processing utilities for handling iPhone photos:
 * - HEIC to JPEG conversion
 * - EXIF orientation extraction and application
 */

export interface ProcessedImage {
  dataUrl: string;
  orientation: number;
}

/**
 * Detect if file is HEIC format via mime type, extension, or magic bytes
 */
export function isHeicFile(file: File): boolean {
  // Check mime type
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.type === "image/heic-sequence" ||
    file.type === "image/heif-sequence"
  ) {
    return true;
  }

  // Check extension
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "heic" || ext === "heif") {
    return true;
  }

  return false;
}

/**
 * Check magic bytes for HEIC format (async)
 */
export async function isHeicByMagicBytes(file: File): Promise<boolean> {
  const slice = file.slice(0, 12);

  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(slice);
  });

  const view = new Uint8Array(buffer);

  // HEIC files have 'ftyp' at byte 4, then heic/heix/hevc/hevx/mif1
  if (view[4] === 0x66 && view[5] === 0x74 && view[6] === 0x79 && view[7] === 0x70) {
    const brand = String.fromCharCode(view[8], view[9], view[10], view[11]);
    return ["heic", "heix", "hevc", "hevx", "mif1"].includes(brand);
  }

  return false;
}

/**
 * Convert HEIC file to JPEG using lazy-loaded heic2any
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  // Lazy load heic2any only when needed
  const heic2any = (await import("heic2any")).default;

  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  // heic2any may return array for multi-image HEIC, take first
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Extract EXIF orientation tag (1-8) from file
 * Returns 1 (normal) if no orientation found
 */
export async function getExifOrientation(file: File | Blob): Promise<number> {
  try {
    const exifr = await import("exifr");
    const orientation = await exifr.orientation(file);
    return orientation ?? 1;
  } catch {
    return 1;
  }
}

/**
 * Process image file: convert HEIC if needed, extract orientation
 */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  let imageBlob: Blob = file;
  let orientation = 1;

  // Check for HEIC and convert
  const heicByType = isHeicFile(file);
  const heicByMagic = !heicByType && (await isHeicByMagicBytes(file));

  if (heicByType || heicByMagic) {
    // Extract orientation before conversion (HEIC has EXIF)
    orientation = await getExifOrientation(file);
    imageBlob = await convertHeicToJpeg(file);
  } else {
    // Extract orientation from original file
    orientation = await getExifOrientation(file);
  }

  // Convert blob to data URL
  const dataUrl = await blobToDataUrl(imageBlob);

  return { dataUrl, orientation };
}

/**
 * Convert Blob to data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
