"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";

interface ConfirmImageModalProps {
  open: boolean;
  imageSrc: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ConfirmImageModal({
  open,
  imageSrc,
  onCancel,
  onConfirm,
  isSubmitting = false,
}: ConfirmImageModalProps) {
  if (!open || !imageSrc) return null;

  return (
    <Modal open={open} onClose={onCancel}>
      <GlassCard className="relative z-10 w-full max-w-lg">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Use this photo?</h2>
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-black">
            <Image
              src={imageSrc}
              alt="Captured meal preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          </div>
          <p className="text-sm text-white">Confirm to analyze and save this meal to your history.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
            >
              Retake
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="h-11 rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500 disabled:opacity-70"
            >
              {isSubmitting ? "Analyzing..." : "Confirm & Scan"}
            </Button>
          </div>
        </div>
      </GlassCard>
    </Modal>
  );
}
