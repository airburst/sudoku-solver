# Highlight Fixed Cell Feature

## Overview
When user selects a fixed (set) number in locked mode, highlight:
1. Selected cell with overlay
2. All cells with same value (fixed + user-entered)
3. Row, column, 3x3 box of selected cell only

Click another fixed cell → transfer highlight to new cell
Clear highlights on: click non-fixed cell, control click, Escape

## Design Decision: Local State (not Redux)
Overlays not persisted → use React state in PuzzleBoard, pass to Cell via props

## Color Variables
Define in `src/styles.css` under `@theme` so color is configurable in one place:
```css
--color-highlight: #facc15;  /* yellow-400 base */
```

Usage with opacity:
- Same value cells: `bg-highlight/50` (50% opacity)
- Row/col/box: `bg-highlight/25` (25% opacity)

## State Shape
```tsx
interface HighlightState {
  cell: { row: number; col: number } | null;  // selected fixed cell
  value: number | null;                        // value to highlight
}
```

## Files to Modify

### 1. `src/styles.css`
- Add `--color-highlight: #facc15;` under `@theme`

### 2. `src/features/puzzle/PuzzleBoard.tsx`
- Add `useState<HighlightState>`
- Pass highlight props to Cell
- Clear highlights on Escape (existing handler)

### 3. `src/features/puzzle/Cell.tsx`
- New props: `highlightValue`, `highlightCell`
- Add overlay div for each highlight type:
  - Same value → `bg-highlight/50`
  - Row/col/box → `bg-highlight/25`

### 4. `src/features/puzzle/Controls/index.tsx`
- On any control click, call `clearHighlights` callback

## Implementation Details

### PuzzleBoard.tsx Changes
```tsx
const [highlight, setHighlight] = useState<{
  cell: { row: number; col: number } | null;
  value: number | null;
}>({ cell: null, value: null });

// Callback for Cell click
const handleCellClick = (row: number, col: number, cell: CellType) => {
  if (locked && cell.fixedVal > 0) {
    setHighlight({ cell: { row, col }, value: cell.fixedVal });
  } else {
    setHighlight({ cell: null, value: null });
  }
};

// In handleKeyPress, case Escape:
setHighlight({ cell: null, value: null });

// Pass to Cell:
<Cell
  ...
  highlightValue={highlight.value}
  highlightCell={highlight.cell}
  onCellClick={handleCellClick}
/>
```

### Cell.tsx Changes
```tsx
interface CellProps {
  // existing...
  highlightValue: number | null;
  highlightCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number, cell: CellType) => void;
}

// Compute highlight flags
const cellValue = data.fixedVal || data.val;
const isSameValue = highlightValue && cellValue === highlightValue;
const isHighlightedCell = highlightCell?.row === row && highlightCell?.col === col;
const inHighlightRow = highlightCell?.row === row;
const inHighlightCol = highlightCell?.col === col;
const inHighlightBox = highlightCell &&
  Math.floor(row / 3) === Math.floor(highlightCell.row / 3) &&
  Math.floor(col / 3) === Math.floor(highlightCell.col / 3);

// Overlay: same value (50% opacity) takes precedence over row/col/box (25% opacity)
const overlayClass = isSameValue
  ? "bg-highlight/50"
  : (inHighlightRow || inHighlightCol || inHighlightBox) && !isHighlightedCell
    ? "bg-highlight/25"
    : null;

// In JSX, add overlay div:
{overlayClass && (
  <div className={cn("absolute inset-0 pointer-events-none", overlayClass)} />
)}
```

### Controls Click Handler
Pass `clearHighlights` prop from parent and call on any button click.

## Visual Hierarchy
| Highlight Type | Class | Opacity |
|----------------|-------|---------|
| Same value | bg-highlight/50 | 50% |
| Row/col/box | bg-highlight/25 | 25% |
| Selected cell | Same value wins | 50% |

Single color (`--color-highlight`) with different opacities for visual distinction.

## Verification
1. `bun run build` - no errors
2. Test: click fixed cell → same values highlighted (incl user-entered)
3. Test: row/col/box gets light highlight
4. Test: click another fixed cell → transfers highlight
5. Test: Escape clears all
6. Test: clicking control clears all
7. Test: clicking non-fixed cell clears all

## Decisions
- Click another fixed cell → transfer highlight (clear then highlight new)
- User-entered vals included in "same value" highlight
