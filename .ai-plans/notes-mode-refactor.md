# Notes Mode Refactor Plan

## Summary

Consolidate corner/centre pencil marks into single "notes" mode with 3x3 grid layout per cell.

---

## Changes

### 1. Types (`src/types/puzzle.ts`)

- Remove `pencilMarks` and `centreMarks` from Cell interface
- Add `notes: number[]`
- Change Mode: `"setup" | "normal" | "notes"`

### 2. Redux Slice (`src/features/puzzle/puzzleSlice.ts`)

- Update `emptyCell`: `notes: []` instead of both mark arrays
- Rename `setSelectedCellsPencilMarks` → `setSelectedCellsNotes`
- Remove mode-based mark type selection (always uses `notes`)
- Update `lockBoard`, `restart`, `reset` to clear `notes`

### 3. Cell Component (`src/features/puzzle/Cell.tsx`)

Replace corner/centre rendering with 3x3 CSS grid:

```tsx
{
  data.notes.length > 0 && !data.val && !data.fixedVal && (
    <div className="grid grid-cols-3 grid-rows-3 absolute inset-0">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <div
          key={n}
          className="flex items-center justify-center text-[clamp(0.6rem,2vw,1.2rem)] text-stone-900"
        >
          {data.notes.includes(n) ? n : ""}
        </div>
      ))}
    </div>
  );
}
```

### 4. NotesToggle (`src/features/puzzle/Controls/NotesToggle.tsx`)

- Two buttons: "Normal" and "Notes"
- "Notes" sets `mode = "notes"`

### 5. PuzzleBoard (`src/features/puzzle/PuzzleBoard.tsx`)

- Spacebar toggles `normal` ↔ `notes`
- Keep Ctrl+num to enter note from any mode
- Remove Shift+num corner behavior
- Remove `cycleMode()`

### 6. NumberControls (`src/features/puzzle/Controls/NumberControls.tsx`)

- Check for `mode === "notes"` instead of corner/centre

### 7. Persistence (`src/store.ts`)

- Bump persist version to force localStorage reset

---

## Files to Modify

1. `src/types/puzzle.ts`
2. `src/features/puzzle/puzzleSlice.ts`
3. `src/features/puzzle/Cell.tsx`
4. `src/features/puzzle/Controls/NotesToggle.tsx`
5. `src/features/puzzle/PuzzleBoard.tsx`
6. `src/features/puzzle/Controls/NumberControls.tsx`
7. `src/store.ts`

---

## Verification

1. Toggle Normal/Notes via button and spacebar
2. Enter notes 1-9, verify 3x3 grid positioning
3. Toggle notes off by re-entering same number
4. Ctrl+num enters note from normal mode
5. Enter value in Normal mode - notes hidden
6. Clear value - notes reappear
7. Multi-cell selection applies notes to all
8. Fresh start (localStorage reset) works
