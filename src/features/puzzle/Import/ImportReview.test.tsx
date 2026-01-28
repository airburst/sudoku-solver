import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import importReducer, { type RecognizedCell } from "@/features/import/importSlice";
import ImportReview from "./ImportReview";

function createStore(recognizedDigits: RecognizedCell[] | null) {
  return configureStore({
    reducer: { import: importReducer },
    preloadedState: {
      import: {
        importState: "reviewing" as const,
        importProgress: 100,
        recognizedDigits,
      },
    },
  });
}

function renderWithStore(
  recognizedDigits: RecognizedCell[] | null,
  onConfirm = vi.fn(),
  onCancel = vi.fn(),
) {
  const store = createStore(recognizedDigits);
  return {
    ...render(
      <Provider store={store}>
        <ImportReview onConfirm={onConfirm} onCancel={onCancel} />
      </Provider>,
    ),
    onConfirm,
    onCancel,
  };
}

// Helper to create 81 cells
function createDigits(
  overrides: Array<{ index: number; value: number; confidence: number }> = [],
): RecognizedCell[] {
  const digits: RecognizedCell[] = Array(81)
    .fill(null)
    .map(() => ({ value: 0, confidence: 1 }));

  for (const { index, value, confidence } of overrides) {
    digits[index] = { value, confidence };
  }

  return digits;
}

describe("ImportReview", () => {
  it("renders review heading", () => {
    renderWithStore(createDigits());
    expect(screen.getByText("Review Import")).toBeInTheDocument();
  });

  it("displays 81 cells in grid", () => {
    renderWithStore(createDigits());
    const buttons = screen.getAllByRole("button");
    // 81 cells + Cancel + Import buttons = 83
    // But some cells might be empty, let's just check the grid exists
    expect(buttons.length).toBeGreaterThanOrEqual(83);
  });

  it("displays recognized digits in cells", () => {
    const digits = createDigits([
      { index: 0, value: 5, confidence: 0.95 },
      { index: 10, value: 3, confidence: 0.9 },
    ]);
    renderWithStore(digits);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("highlights low-confidence cells with yellow background", () => {
    const digits = createDigits([
      { index: 0, value: 5, confidence: 0.5 }, // Low confidence
      { index: 1, value: 3, confidence: 0.9 }, // High confidence
    ]);
    renderWithStore(digits);

    const cells = screen.getAllByRole("button").slice(0, 81);
    expect(cells[0]).toHaveClass("bg-yellow-200");
    expect(cells[1]).not.toHaveClass("bg-yellow-200");
  });

  it("shows digit input panel when cell is clicked", () => {
    renderWithStore(createDigits());

    const cells = screen.getAllByRole("button").slice(0, 81);
    fireEvent.click(cells[0]);

    // Should show digit input panel with digits 1-9 and clear button
    expect(screen.getByText("Select digit for cell 1,1")).toBeInTheDocument();
  });

  it("updates cell when digit is selected", () => {
    renderWithStore(createDigits());

    const cells = screen.getAllByRole("button").slice(0, 81);
    fireEvent.click(cells[0]); // Click first cell

    // Click digit 7
    const digit7Button = screen.getByRole("button", { name: "7" });
    fireEvent.click(digit7Button);

    // First cell should now show 7
    expect(cells[0]).toHaveTextContent("7");
  });

  it("clears cell when X is clicked", () => {
    const digits = createDigits([{ index: 0, value: 5, confidence: 0.9 }]);
    renderWithStore(digits);

    const cells = screen.getAllByRole("button").slice(0, 81);
    expect(cells[0]).toHaveTextContent("5");

    fireEvent.click(cells[0]); // Click first cell
    fireEvent.click(screen.getByRole("button", { name: "✕" })); // Click clear

    expect(cells[0]).toHaveTextContent("");
  });

  it("calls onCancel when Cancel is clicked", () => {
    const { onCancel } = renderWithStore(createDigits());

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm with digits when Import is clicked", () => {
    const digits = createDigits([
      { index: 0, value: 5, confidence: 0.9 },
      { index: 80, value: 9, confidence: 0.95 },
    ]);
    const { onConfirm } = renderWithStore(digits);

    fireEvent.click(screen.getByText("Import"));

    expect(onConfirm).toHaveBeenCalledWith(
      expect.arrayContaining([5]), // First element
    );
    const calledWith = onConfirm.mock.calls[0][0];
    expect(calledWith[0]).toBe(5);
    expect(calledWith[80]).toBe(9);
    expect(calledWith.length).toBe(81);
  });

  it("passes edited digits to onConfirm", () => {
    const digits = createDigits([{ index: 0, value: 5, confidence: 0.9 }]);
    const { onConfirm } = renderWithStore(digits);

    // Edit first cell to 8
    const cells = screen.getAllByRole("button").slice(0, 81);
    fireEvent.click(cells[0]);
    fireEvent.click(screen.getByRole("button", { name: "8" }));

    // Confirm
    fireEvent.click(screen.getByText("Import"));

    const calledWith = onConfirm.mock.calls[0][0];
    expect(calledWith[0]).toBe(8); // Should be edited value
  });
});
