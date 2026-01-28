import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import importReducer, { type ImportState } from "@/features/import/importSlice";
import ImportModal from "./index";

// Mock navigator.mediaDevices for CameraCapture
beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn().mockRejectedValue(new Error("No camera")),
    },
    writable: true,
  });
});

function renderWithState(importState: ImportState) {
  const store = configureStore({
    reducer: { import: importReducer },
    preloadedState: {
      import: {
        importState,
        importProgress: 0,
        recognizedDigits: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <ImportModal />
    </Provider>,
  );
}

describe("ImportModal", () => {
  it("renders nothing when idle", () => {
    const { container } = renderWithState("idle");
    expect(container.firstChild).toBeNull();
  });

  it("renders CameraCapture when capturing", async () => {
    renderWithState("capturing");
    expect(await screen.findByText("Import Puzzle")).toBeInTheDocument();
  });

  it("renders ImportProgress when loading-libs", () => {
    renderWithState("loading-libs");
    expect(screen.getByText("Loading image tools...")).toBeInTheDocument();
  });

  it("renders ImportProgress when processing", () => {
    renderWithState("processing");
    expect(screen.getByText("Processing image...")).toBeInTheDocument();
  });

  it("renders ImportReview when reviewing", () => {
    renderWithState("reviewing");
    expect(screen.getByText("Review Import")).toBeInTheDocument();
  });

  it("has modal overlay", () => {
    renderWithState("capturing");
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
  });
});
