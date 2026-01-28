import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Upload, X } from "lucide-react";
import Button from "@/components/Button";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  error?: string | null;
}

const CameraCapture = ({
  onCapture,
  onCancel,
  error: externalError,
}: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Camera access denied";
      setCameraError(message);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    onCapture(imageData);
  }, [stopCamera, onCapture]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          stopCamera();
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [stopCamera, onCapture],
  );

  const handleCancel = useCallback(() => {
    stopCamera();
    onCancel();
  }, [stopCamera, onCancel]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg max-w-md w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-fixed">Import Puzzle</h2>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-btn rounded-full"
          aria-label="Cancel"
        >
          <X size={24} />
        </button>
      </div>

      {externalError && (
        <div className="bg-error/10 border border-error rounded p-3">
          <p className="text-error text-sm">{externalError}</p>
        </div>
      )}

      {cameraError ? (
        <div className="flex flex-col gap-4 items-center py-8">
          <p className="text-error text-center">{cameraError}</p>
          <p className="text-guess text-sm text-center">
            Use the button below to select an image instead
          </p>
        </div>
      ) : (
        <div className="relative aspect-square bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-white">Starting camera...</p>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        {!cameraError && isCameraReady && (
          <Button primary onClick={capturePhoto} className="flex-1">
            <span className="flex items-center justify-center gap-2">
              <Camera size={20} />
              Capture
            </span>
          </Button>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          className={cameraError || !isCameraReady ? "flex-1" : ""}
        >
          <span className="flex items-center justify-center gap-2">
            <Upload size={20} />
            {cameraError || !isCameraReady ? "Select Image" : ""}
          </span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CameraCapture;
