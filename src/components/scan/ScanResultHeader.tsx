import { GlassCard } from "@/components/ui/GlassCard";

interface ScanResultHeaderProps {
  title: string;
  timestamp: string;
}

export function ScanResultHeader({ title, timestamp }: ScanResultHeaderProps) {
  return (
    <GlassCard className="bg-white/10 text-center text-white">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-white/70">Captured on {timestamp}</p>
    </GlassCard>
  );
}

