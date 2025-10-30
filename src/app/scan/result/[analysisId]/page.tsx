import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { summarizeMeal, type DetectedLabel, type IngredientBreakdown } from "@/lib/analysis/analyzeMealImage";
import { ScanResultBackdrop } from "@/components/scan/ScanResultBackdrop";
import { ScanResultHeader } from "@/components/scan/ScanResultHeader";
import { ScanResultSummary } from "@/components/scan/ScanResultSummary";
import { ScanResultLabels } from "@/components/scan/ScanResultLabels";
import { ScanResultActions } from "@/components/scan/ScanResultActions";

type RawDetectedEntry =
  | string
  | {
      name?: unknown;
      confidence?: unknown;
      macros?: { calories?: unknown; carbs?: unknown; protein?: unknown; fats?: unknown };
    };

function normalizeNumber(value: unknown, fallback = 0) {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function parseDetected(
  rawDetected: unknown,
  rawScores: unknown,
): { labels: DetectedLabel[]; breakdown: IngredientBreakdown[] | null } {
  if (!Array.isArray(rawDetected)) return { labels: [], breakdown: null };
  const scores = Array.isArray(rawScores) ? rawScores : [];

  const first = rawDetected[0];
  if (first && typeof first === "object" && !Array.isArray(first)) {
    const breakdown = (rawDetected as RawDetectedEntry[]).map((entry, index) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        const obj = entry as {
          name?: unknown;
          confidence?: unknown;
          macros?: { calories?: unknown; carbs?: unknown; protein?: unknown; fats?: unknown };
        };
        const macroSource = obj.macros ?? {};
        return {
          name:
            typeof obj.name === "string" && obj.name.trim().length > 0
              ? obj.name
              : String(obj.name ?? `Ingredient ${index + 1}`),
          confidence: normalizeNumber(obj.confidence, normalizeNumber(scores[index])),
          macros: {
            calories: normalizeNumber((macroSource as Record<string, unknown>).calories),
            carbs: normalizeNumber((macroSource as Record<string, unknown>).carbs),
            protein: normalizeNumber((macroSource as Record<string, unknown>).protein),
            fats: normalizeNumber((macroSource as Record<string, unknown>).fats),
          },
        };
      }
      return {
        name: String(entry ?? `Ingredient ${index + 1}`),
        confidence: normalizeNumber(scores[index]),
        macros: { calories: 0, carbs: 0, protein: 0, fats: 0 },
      };
    });

    return {
      labels: breakdown.map(({ name, confidence }) => ({ name, confidence })),
      breakdown,
    };
  }

  const labels = (rawDetected as RawDetectedEntry[]).map((entry, index) => ({
    name: String(entry ?? `Ingredient ${index + 1}`),
    confidence: normalizeNumber(scores[index]),
  }));
  return { labels, breakdown: null };
}

interface PageProps {
  params: Promise<{ analysisId: string }>;
}

export default async function ScanResultPage({ params }: PageProps) {
  const { analysisId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analysis, error: analysisError } = await supabase
    .from("meal_analyses")
    .select("id, user_id, image_url, detected_labels, confidence_scores, macros, created_at")
    .eq("id", analysisId)
    .single();

  if (analysisError || !analysis || analysis.user_id !== user.id) {
    notFound();
  }

  const { labels, breakdown } = parseDetected(analysis.detected_labels, analysis.confidence_scores);
  const summary = summarizeMeal(
    labels,
    breakdown,
    Array.isArray(analysis.macros) ? (analysis.macros as number[]) : null,
  );

  const { data: entry } = await supabase
    .from("meal_entries")
    .select("id, description, health_score, date, time, analysis_id, image_url, macros")
    .eq("analysis_id", analysis.id)
    .maybeSingle();

  const description = entry?.description ?? summary.description;
  const healthScore = entry?.health_score ?? summary.healthScore;
  const timestamp = new Date(analysis.created_at).toLocaleString();

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-neutral-950 text-white">
      <ScanResultBackdrop imageUrl={analysis.image_url} alt={description} />
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <ScanResultHeader title={description} timestamp={timestamp} />
        <ScanResultSummary
          imageUrl={analysis.image_url}
          description={description}
          healthScore={healthScore}
          macros={summary.macros}
        />
        <ScanResultLabels labels={labels} />
        <ScanResultActions />
      </div>
    </div>
  );
}
