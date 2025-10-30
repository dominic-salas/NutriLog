import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function ScanResultActions() {
  return (
    <GlassCard className="flex flex-col gap-3 bg-white/10 text-white sm:flex-row sm:justify-end">
      <Link
        href="/scan"
        className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
      >
        Scan another meal
      </Link>
      <Link
        href="/profile"
        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-80"
      >
        View history
      </Link>
    </GlassCard>
  );
}

