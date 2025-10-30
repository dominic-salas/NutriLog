"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";

interface NoticeDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function NoticeDialog({ open, message, onClose }: NoticeDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <GlassCard className="w-full max-w-sm bg-white px-6 py-6 text-gray-900">
        <p className="text-sm leading-relaxed">{message}</p>
        <div className="mt-4 text-right">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </GlassCard>
    </Modal>
  );
}

