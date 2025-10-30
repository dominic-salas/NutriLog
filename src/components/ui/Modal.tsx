"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils/utils";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function Modal({ open, onClose, children, className, overlayClassName }: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6", overlayClassName)}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn("relative w-full max-w-lg", className)}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

