"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";

export default function ScanPage() 
{
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    sessionStorage.setItem("scan:lastImage", dataUrl);
    router.push("/result");
  };

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
        <p className="text-sm text-white/90">Center your meal, then take a picture!</p>
      </div>

      {/* scan btn */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center">
        <button
          onClick={handleScan}
          disabled={busy}
          className="grid h-20 w-20 place-items-center rounded-full bg-white text-black shadow-lg active:scale-95 disabled:opacity-60"
          aria-label="Scan meal"
        >
          <Camera className="h-7 w-7" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* errors */}
      {error && (
        <div className="absolute bottom-28 left-1/2 z-30 w-[90%] max-w-xl -translate-x-1/2 rounded-xl bg-red-600/90 px-4 py-2 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
