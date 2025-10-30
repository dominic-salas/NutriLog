import { cn } from "@/lib/utils/utils";

interface ErrorBannerProps {
  message: string;
  className?: string;
}

export function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "rounded-xl bg-red-600/90 px-4 py-2 text-sm text-white shadow-[0_12px_30px_-15px_rgba(0,0,0,0.65)] backdrop-blur",
        className,
      )}
    >
      {message}
    </div>
  );
}

