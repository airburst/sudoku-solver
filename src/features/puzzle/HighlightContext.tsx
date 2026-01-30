import { createContext, useContext, useState, type ReactNode } from "react";
import type { Cell } from "@/types/puzzle";

interface HighlightState {
  cell: { row: number; col: number } | null;
  value: number | null;
}

interface HighlightContextValue {
  highlight: HighlightState;
  setHighlight: (
    row: number,
    col: number,
    cell: Cell,
    locked: boolean,
  ) => void;
  clearHighlight: () => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  const [highlight, setHighlightState] = useState<HighlightState>({
    cell: null,
    value: null,
  });

  const setHighlight = (
    row: number,
    col: number,
    cell: Cell,
    locked: boolean,
  ) => {
    if (locked && cell.fixedVal > 0) {
      setHighlightState({ cell: { row, col }, value: cell.fixedVal });
    } else {
      setHighlightState({ cell: null, value: null });
    }
  };

  const clearHighlight = () => setHighlightState({ cell: null, value: null });

  return (
    <HighlightContext.Provider
      value={{ highlight, setHighlight, clearHighlight }}
    >
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const ctx = useContext(HighlightContext);
  if (!ctx) throw new Error("useHighlight must be used within HighlightProvider");
  return ctx;
};
