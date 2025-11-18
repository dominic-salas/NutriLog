"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { ConfirmImageModal } from "@/components/ConfirmImageModal";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function ScanPage() 
{
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        //Requesting back camera if available
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        const vid = videoRef.current;
        if (!vid || cancelled) return;

        vid.srcObject = stream;

        const onLoaded = () => {
          if (cancelled) return;
          vid.play().catch(() => {
          });
        };

        vid.addEventListener("loadedmetadata", onLoaded, { once: true });
      } catch (e: unknown) 
      {
        const message =
          e instanceof Error
            ? e.message
            : typeof e === "string"
            ? e
            : "Camera permission denied or unavailable.";
        setError(message);
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleScan = async () => {
    setBusy(true);
    const v = videoRef.current;
    const c = canvasRef.current;
    let dataUrl = "/food.jpg";

    if (v && c) {
      const w = v.videoWidth || 1080;
      const h = v.videoHeight || 1440;
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.drawImage(v, 0, 0, w, h);
        dataUrl = c.toDataURL("image/jpeg", 0.85);
      }
    }
    //flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 120);
    setCapturedImage(dataUrl);
    setConfirmOpen(true);
    setBusy(false);
  };
  //upload from phone
  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please choose a JPEG or PNG image.");
      return;
    }

    const maxBytes = 15 * 1024 * 1024; // 15MB Rekognition limit
    if (file.size > maxBytes) {
      setError("Image is too large. Please select a file under 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCapturedImage(result);
        setConfirmOpen(true);
        setError(null);
      } else {
        setError("Unable to read the selected image.");
      }
    };
    reader.onerror = () => setError("Failed to load the selected image.");
    reader.readAsDataURL(file);
  };

  const resetCapture = useCallback(() => {
    setConfirmOpen(false);
    setCapturedImage(null);
    setProcessingError(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setProcessingError(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: capturedImage }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Failed to analyze meal.");
      }

      const result = await response.json();
      resetCapture();
      router.push(`/scan/result/${result.analysisId}`);
    } catch (err: unknown) {
      setProcessingError(
        err instanceof Error ? err.message : "Unable to analyze meal. Try again."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [capturedImage, resetCapture, router]);

  const activeError = error ?? processingError;

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black text-white">
      {/* back btn */}
      <div className="absolute left-4 top-4 z-20">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 backdrop-blur hover:bg-white/30"
          aria-label="Back to profile"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
      {/* vid preview */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* flash */}
      {isFlashing && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/70 animate-pulse" />
      )}
      {/* gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
      {/* scan frame */}
      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
        <div className="relative h-[60vh] w-[85vw] max-w-[420px] rounded-3xl">
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-3xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-3xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-3xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-3xl border-b-4 border-r-4 border-white" />
        </div>
      </div>
      {/* text */}
      <div className="absolute top-20 left-0 right-0 z-10 mx-auto w-full max-w-[420px] px-6 text-center">
        <p className="text-sm text-white/90">
          Center your meal, then take a picture or upload one.
        </p>
      </div>
      {/* actions */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-4">
        {/* scan btn */}
        <button
          onClick={handleScan}
          disabled={busy}
          className="grid h-20 w-20 place-items-center rounded-full bg-white text-black shadow-lg active:scale-95 disabled:opacity-60"
          aria-label="Scan meal"
        >
          <Camera className="h-7 w-7" />
        </button>
        {/* upload btn */}
        <button
          onClick={onPickFile}
          className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white backdrop-blur-2xl hover:bg-white/20"
          aria-label="Upload photo"
        >
          <span className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Photo
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
      {/* errors */}
      {activeError && (
        <div className="absolute bottom-28 left-1/2 z-30 w-[90%] max-w-xl -translate-x-1/2">
          <ErrorBanner message={activeError} className="w-full" />
        </div>
      )}

      <ConfirmImageModal
        open={confirmOpen}
        imageSrc={capturedImage}
        onCancel={resetCapture}
        onConfirm={handleConfirm}
        isSubmitting={analyzing}
      />
    </div>
  );
}
