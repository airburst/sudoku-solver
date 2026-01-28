import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CameraCapture from "./CameraCapture";

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
const mockStopTrack = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
  });
});

describe("CameraCapture", () => {
  const mockOnCapture = vi.fn();
  const mockOnCancel = vi.fn();

  it("renders cancel button", () => {
    mockGetUserMedia.mockRejectedValue(new Error("No camera"));

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", async () => {
    mockGetUserMedia.mockRejectedValue(new Error("No camera"));

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    fireEvent.click(screen.getByLabelText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("shows error message when camera access denied", async () => {
    const error = new Error("Permission denied");
    error.name = "NotAllowedError";
    mockGetUserMedia.mockRejectedValue(error);

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    expect(await screen.findByText(/Camera permission denied/)).toBeInTheDocument();
  });

  it("shows file input fallback when camera unavailable", async () => {
    mockGetUserMedia.mockRejectedValue(new Error("Camera error"));

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    await screen.findByText(/Could not access camera/);
    expect(screen.getByText("Select Image")).toBeInTheDocument();
  });

  it("handles file selection", async () => {
    mockGetUserMedia.mockRejectedValue(new Error("Camera error"));

    // Mock FileReader as a class
    const mockResult = "data:image/jpeg;base64,test";
    class MockFileReader {
      result = mockResult;
      onload: (() => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal("FileReader", MockFileReader);

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    await screen.findByText(/Could not access camera/);

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    // Wait for FileReader onload to fire
    await vi.waitFor(() => {
      expect(mockOnCapture).toHaveBeenCalledWith(mockResult);
    });
  });

  it("starts camera on mount", async () => {
    const mockStream = {
      getTracks: () => [{ stop: mockStopTrack }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    render(
      <CameraCapture onCapture={mockOnCapture} onCancel={mockOnCancel} />,
    );

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: "environment", width: { ideal: 1280 } },
    });
  });
});
