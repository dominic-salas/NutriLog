import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import type { MealAnalysisResult } from "@/lib/analysis/analyzeMealImage";

interface ScanResultSummaryProps {
  imageUrl: string;
  description: string;
  healthScore: number;
  macros: MealAnalysisResult["macros"];
}

export function ScanResultSummary({ imageUrl, description, healthScore, macros }: ScanResultSummaryProps) {
  return (
    <GlassCard className="grid gap-6 bg-white/10 lg:grid-cols-2">
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-black/40">
        <Image src={imageUrl} alt={description} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
      </div>
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl bg-white/10 p-4 text-white shadow-inner">
          <h2 className="text-lg font-semibold">Estimated nutrition</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Calories" value={`${macros.calories} kcal`} />
            <Stat label="Carbs" value={`${macros.carbs} g`} />
            <Stat label="Protein" value={`${macros.protein} g`} />
            <Stat label="Fats" value={`${macros.fats} g`} />
          </div>
        </section>
        <section className="rounded-2xl bg-white/10 p-4 text-white">
          <div className="flex items-center justify-between text-sm text-white/75">
            <span>Health score</span>
            <span>{healthScore}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${Math.min(100, Math.max(0, healthScore))}%` }}
            />
          </div>
        </section>
      </div>
    </GlassCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2">
      <strong className="block text-xs uppercase text-white/60">{label}</strong>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

