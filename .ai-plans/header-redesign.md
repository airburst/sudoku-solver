# Header Redesign Plan

## Overview
Redesign Header with centered timer (play mode), ellipsis dropdown menu (top right), remove sidebar nav.

## Files to Modify

1. **`src/components/Header.tsx`** - Complete rewrite
2. **`src/components/DropdownMenu.tsx`** - New component
3. **`src/components/TimerBar.tsx`** - Delete
4. **`src/routes/index.tsx`** - Remove TimerBar import and usage

## Implementation

### 1. DropdownMenu Component (new)
Native dropdown using React state + click-outside detection:
```tsx
interface MenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: MenuItem[];
}
```
- Trigger: `MoreVertical` (ellipsis) icon
- Portal to body for z-index issues
- Click outside to close
- Escape key to close

### 2. Header Component (rewrite)
Layout: `justify-between` with 3 sections
```
[Logo]          [Timer + Pause]          [Dropdown]
```

- **Left**: Sudoku logo/title (link to home)
- **Center**: Timer display + pause button (only when `locked === true`)
- **Right**: DropdownMenu with items:
  - Solve (Sparkles icon) → `solvePuzzle()` + `setBoard()`
  - Start again (RotateCcw icon) → `restart()`
  - New puzzle (Plus icon) → `reset()`
  - Capture puzzle (Camera icon) → `setImportState("capturing")`

Timer logic from TimerBar moves into Header (useEffect for interval).

### 3. Remove TimerBar
- Delete `src/components/TimerBar.tsx`
- Update any imports (check routes/index.tsx)

## Menu Actions
| Menu Item | Icon | Action |
|-----------|------|--------|
| Solve | Sparkles | `dispatch(setBoard(solvePuzzle(board)))` |
| Start again | RotateCcw | `dispatch(restart())` |
| New puzzle | Plus | `dispatch(reset())` |
| Capture puzzle | Camera | `dispatch(setImportState("capturing"))` |

## Verification
1. `bun run build` - no TS errors
2. Manual test:
   - Timer shows in center when puzzle locked
   - Timer hidden in setup mode
   - Dropdown opens/closes on click
   - Each menu item triggers correct action
   - Click outside closes dropdown
