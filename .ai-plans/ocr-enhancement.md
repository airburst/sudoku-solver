# OCR Enhancement Plan: 4-Phase Implementation

## Summary

Enhance sudoku digit recognition accuracy by implementing 4 improvements to the OCR pipeline. Each phase is independent and testable.

## Files to Modify

- `src/services/ImportLoader.ts` - Phase 1
- `src/services/DigitRecognizer.ts` - Phases 2-4
- `src/services/DigitRecognizer.test.ts` - All phases

---

## Phase 1: Add PSM 10 to Tesseract

**File:** `ImportLoader.ts` (lines 99-102)

Add single-character mode:

```typescript
await tesseractWorker.setParameters({
  tessedit_char_whitelist: "123456789",
  tessedit_pageseg_mode: "10", // Single character mode
});
```

---

## Phase 2: Integrate preprocessCell()

**File:** `DigitRecognizer.ts`

Modify `recognizeCell()` to use existing `preprocessCell()`:

```typescript
async function recognizeCell(
  cell: ImageData,
  worker: Worker,
): Promise<RecognitionResult> {
  const processedCell = preprocessCell(cell);
  const canvas = imageDataToCanvas(processedCell);
  // ... rest unchanged
}
```

---

## Phase 3: Adaptive Thresholding (Otsu's Method)

**File:** `DigitRecognizer.ts`

Replace fixed threshold (128) with dynamic calculation:

1. Add `calculateOtsuThreshold()` function - builds histogram, finds optimal threshold
2. Update `preprocessCell()` to use calculated threshold
3. Update `isCellEmpty()` to use adaptive threshold (consistency)

This handles varying lighting/contrast in photos.

---

## Phase 4: Upscale Cells 3x

**File:** `DigitRecognizer.ts`

Add `upscaleCell()` with bilinear interpolation:

- Scale 40x40px cells to 120x120px
- Apply before preprocessing

Final pipeline: `cell` -> `upscale(3x)` -> `preprocess(Otsu)` -> `OCR`

---

## Test Updates

Each phase adds tests to `DigitRecognizer.test.ts`:

- Phase 1: Verify PSM config in mock
- Phase 2: Verify preprocessing applied
- Phase 3: Test adaptive threshold with low/high contrast
- Phase 4: Test upscale dimensions and interpolation

---

## Verification

After each phase:

1. Run `npm test` - all tests pass
2. Run app, import test fixture `sudoku-01.jpg`
3. Count missed digits (baseline: ~3-5 per image)
4. Compare confidence scores in review UI

---

## Performance

Estimated overhead: <200ms for 81 cells. Acceptable for mobile.

---

## Notes

- Using 3x upscale for better accuracy (vs 2x)
- Updated both `preprocessCell()` and `isCellEmpty()` for consistent adaptive thresholding

---

## Phase 5: Confidence Filtering (Added)

Added `MIN_OCR_CONFIDENCE = 0.5` - rejects OCR results below 50% confidence. This eliminated false positives in noisy images like newspaper scans.

---

## E2E Test Added

- Installed Playwright (`bun add -D @playwright/test`)
- Created `e2e/ocr-accuracy.spec.ts` - automated accuracy test against `sudoku-01.jpg`
- Created `src/test/fixtures/sudoku-01.expected.ts` - expected values and comparison utility
- Run with: `bun run test:e2e`

## Final Results (sudoku-01.jpg)
- **96.3% accuracy** (78/81 correct)
- **0 false positives**
- **3 missed digits** (8, 9, 9 - low confidence)
