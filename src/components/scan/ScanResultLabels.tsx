import { GlassCard } from "@/components/ui/GlassCard";
import type { DetectedLabel } from "@/lib/analysis/analyzeMealImage";

interface ScanResultLabelsProps {
  labels: DetectedLabel[];
}

export function ScanResultLabels({ labels }: ScanResultLabelsProps) {
  return (
    <GlassCard className="bg-white/10 text-white">
      <h2 className="text-lg font-semibold">Detected ingredients</h2>
      {labels.length === 0 ? (
        <p className="mt-3 text-sm text-white/70">No labels detected.</p>
      ) : (
        <ul className="mt-4 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
          {labels.map((label, index) => (
            <li
              key={`${label.name}-${label.confidence}-${index}`}
              className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2"
            >
              <span>{label.name}</span>
              <span className="text-xs text-white/60">{label.confidence.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
