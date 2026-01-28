import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import importReducer, { type ImportState } from "@/features/import/importSlice";
import ImportProgress from "./ImportProgress";

function renderWithStore(progress: number, importState: ImportState = "processing") {
  const store = configureStore({
    reducer: { import: importReducer },
    preloadedState: {
      import: {
        importState,
        importProgress: progress,
        recognizedDigits: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <ImportProgress />
    </Provider>,
  );
}

describe("ImportProgress", () => {
  it("displays progress percentage", () => {
    renderWithStore(45);
    expect(screen.getByText("45% complete")).toBeInTheDocument();
  });

  it("displays 0% at start", () => {
    renderWithStore(0);
    expect(screen.getByText("0% complete")).toBeInTheDocument();
  });

  it("displays 100% when complete", () => {
    renderWithStore(100);
    expect(screen.getByText("100% complete")).toBeInTheDocument();
  });

  it("shows loading message when loading libs", () => {
    renderWithStore(0, "loading-libs");
    expect(screen.getByText("Loading image tools...")).toBeInTheDocument();
  });

  it("shows processing message by default", () => {
    renderWithStore(50, "processing");
    expect(screen.getByText("Processing image...")).toBeInTheDocument();
  });

  it("renders progress bar with correct width", () => {
    renderWithStore(75);
    const progressBar = document.querySelector(".bg-selected");
    expect(progressBar).toHaveStyle({ width: "75%" });
  });

  it("shows spinner when loading libs", () => {
    renderWithStore(0, "loading-libs");
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("shows first-use message when loading libs", () => {
    renderWithStore(0, "loading-libs");
    expect(screen.getByText(/first use/i)).toBeInTheDocument();
  });

  it("hides progress bar when loading libs", () => {
    renderWithStore(0, "loading-libs");
    const progressBar = document.querySelector(".bg-selected");
    expect(progressBar).not.toBeInTheDocument();
  });
});
