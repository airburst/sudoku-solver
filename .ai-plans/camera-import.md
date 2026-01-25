# Camera-Based Sudoku Puzzle Import

Capture a photo of a newspaper sudoku puzzle, use OpenCV.js for grid detection and Tesseract.js for digit recognition (all on-device), with lazy loading, progress feedback, and a review step before importing.

## File Structure

```
src/features/puzzle/Import/
    index.tsx             # Flow orchestrator
    CameraCapture.tsx     # Camera/file input UI
    ImportReview.tsx      # Review & correct UI
    ImportProgress.tsx    # Progress bar component
src/services/
    ImportLoader.ts       # Lazy loads OpenCV + Tesseract
    GridDetector.ts       # OpenCV grid detection
    DigitRecognizer.ts    # Tesseract OCR
```

---

## Phase 1: Foundation & Lazy Loading

Set up dependencies and infrastructure for on-demand library loading.

### Steps

1. **Install dependencies** — Add `tesseract.js` and `@techstark/opencv-js` with Bun.

2. **Create lazy-loader utility** — Add `src/services/ImportLoader.ts` that dynamically imports OpenCV.js only when needed, shows "Loading image tools..." on first use, then pre-initializes a Tesseract worker in the background once OpenCV is ready.

3. **Extend Redux state** — Add to `src/features/puzzle/puzzleSlice.ts`: `importState: 'idle' | 'loading-libs' | 'capturing' | 'processing' | 'reviewing'`, `importProgress: number` (0-100), and actions `setImportState`, `setImportProgress`.

### Acceptance Criteria

- [ ] Libraries install without errors
- [ ] `ImportLoader.loadLibraries()` returns a promise that resolves when both libs are ready
- [ ] Subsequent calls to `loadLibraries()` return immediately (cached)
- [ ] Redux state updates correctly through import states

---

## Phase 2: Image Capture UI

Build the camera and file input interface.

### Steps

1. **Create capture component** — Add `src/features/puzzle/Import/CameraCapture.tsx` with:
   - `getUserMedia()` for live camera with capture button
   - `<input type="file" accept="image/*" capture="environment">` fallback
   - Cancel button to abort

2. **Create progress component** — Add `src/features/puzzle/Import/ImportProgress.tsx` showing a progress bar driven by `importProgress` from Redux.

3. **Add Import button** — Modify `src/features/puzzle/Controls/NumberControls.tsx` to show "Import" button when `!locked` (setup mode only).

4. **Create flow orchestrator** — Add `src/features/puzzle/Import/index.tsx` to manage modal visibility and coordinate between capture/progress/review states.

### Acceptance Criteria

- [ ] "Import" button appears in setup mode only
- [ ] Tapping Import opens camera modal (or file picker on unsupported browsers)
- [ ] User can capture photo or select from gallery
- [ ] Cancel closes modal and resets state

---

## Phase 3: Grid Detection

Implement OpenCV-based puzzle extraction.

### Steps

1. **Build grid detector** — Create `src/services/GridDetector.ts` using OpenCV.js:
   - Convert to grayscale
   - Apply adaptive threshold
   - Find contours
   - Identify largest quadrilateral (puzzle boundary)
   - Apply perspective transform to get square image
   - Slice into 81 equal cell images (as canvas elements or image data)

2. **Add error handling** — Detect when no valid grid is found, prompt user to retake photo.

### Acceptance Criteria

- [ ] Given a clear puzzle photo, returns array of 81 cell images
- [ ] Handles rotated/angled photos via perspective correction
- [ ] Shows helpful error if grid cannot be detected

---

## Phase 4: Digit Recognition

Implement Tesseract-based OCR with progress feedback.

### Steps

1. **Build digit recognizer** — Create `src/services/DigitRecognizer.ts` using Tesseract.js:
   - Configure with `tessedit_char_whitelist: '123456789'`
   - Process cells in batches of ~10 to keep UI responsive
   - Emit progress events after each batch
   - Return 0 for empty cells, 1-9 for detected digits
   - Include confidence score for each recognition

2. **Wire progress to UI** — Update `importProgress` in Redux as cells are processed, display in `ImportProgress.tsx`.

### Acceptance Criteria

- [ ] Correctly recognizes printed digits 1-9
- [ ] Empty cells return 0
- [ ] Progress bar updates smoothly during processing
- [ ] Each result includes confidence score (0-1)

---

## Phase 5: Review & Approval UI

Build the correction interface before final import.

### Steps

1. **Create review component** — Add `src/features/puzzle/Import/ImportReview.tsx`:
   - Display recognized puzzle in mini-grid matching app style
   - Highlight low-confidence cells (e.g., < 0.7) with warning color
   - Tap cell to edit digit (0-9 input, 0 = empty)
   - "Confirm" and "Cancel" buttons

2. **Complete the flow** — On confirm:
   - Convert recognized digits to board format (9×9 array of cell objects with `fixedVal`)
   - Dispatch `setBoard()` action
   - Reset import state to `'idle'`
   - Close modal, user is in setup mode for final adjustments

### Acceptance Criteria

- [ ] All 81 cells display correctly in review grid
- [ ] Low-confidence cells are visually distinct
- [ ] Tapping cell allows digit correction
- [ ] Confirm imports puzzle to main board
- [ ] Cancel discards and returns to setup mode

---

## Phase 6: Polish & Edge Cases

Refine UX and handle edge cases.

### Steps

1. **Loading states** — Show "Loading image tools..." spinner on first import (during library load).

2. **Error recovery** — Handle camera permission denied, OCR failures, invalid images gracefully with user-friendly messages.

3. **Mobile optimization** — Test on iOS Safari and Android Chrome, ensure camera capture works on both.

4. **Cleanup** — Terminate Tesseract worker when modal closes to free memory.

### Acceptance Criteria

- [ ] First-time load shows appropriate spinner
- [ ] Camera permission denial shows helpful message
- [ ] Works on mobile Safari and Chrome
- [ ] No memory leaks from OCR workers
