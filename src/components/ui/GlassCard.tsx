import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_18px_60px_-25px_rgba(0,0,0,0.65)] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
