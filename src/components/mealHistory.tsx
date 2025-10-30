"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { NoticeDialog } from "@/components/ui/NoticeDialog";
import {
  MealHistoryTable,
  type MealHistoryEntry,
} from "@/components/meal/MealHistoryTable";
import { MealDetailModal, type MealUpdatePayload, type EditableIngredientRow } from "@/components/meal/MealDetailModal";
import ingredientProfilesData from "@/lib/analysis/data/ingredient-profiles.json";

type MealDetailState = {
  open: boolean;
  entry: MealHistoryEntry | null;
  analysis: {
    id: string;
    image_url: string | null;
    detected_labels: EditableIngredientRow[];
    macros: number[] | null;
  } | null;
};

type IngredientProfile = {
  name: string;
  keywords: string[];
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
  healthScore: number;
};

const profiles = ingredientProfilesData as IngredientProfile[];
const defaultProfile =
  profiles.find((profile) => profile.name === "Mixed Meal") ?? ({
    name: "Mixed Meal",
    keywords: [],
    macros: { calories: 450, carbs: 45, protein: 25, fats: 18 },
    healthScore: 65,
  } as IngredientProfile);

function normalizeNumber(value: unknown, fallback = 0) {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function ensureMacros(obj: unknown) {
  if (obj && typeof obj === "object") {
    const macros = obj as { calories?: unknown; carbs?: unknown; protein?: unknown; fats?: unknown };
    return {
      calories: normalizeNumber(macros.calories, defaultProfile.macros.calories),
      carbs: normalizeNumber(macros.carbs, defaultProfile.macros.carbs),
      protein: normalizeNumber(macros.protein, defaultProfile.macros.protein),
      fats: normalizeNumber(macros.fats, defaultProfile.macros.fats),
    };
  }
  return { ...defaultProfile.macros };
}

function normalizeIngredientRows(raw: unknown, rawScores?: unknown): EditableIngredientRow[] {
  if (!Array.isArray(raw)) return [];
  const scores = Array.isArray(rawScores) ? rawScores : [];
  return raw.map((entry, index) => {
    if (entry && typeof entry === "object") {
      const item = entry as {
        name?: unknown;
        confidence?: unknown;
        macros?: { calories?: unknown; carbs?: unknown; protein?: unknown; fats?: unknown };
      };
      const displayName = typeof item.name === "string" && item.name.trim().length > 0 ? item.name : `Ingredient ${index + 1}`;
      return {
        name: displayName,
        confidence: normalizeNumber(item.confidence, normalizeNumber(scores[index])),
        macros: ensureMacros(item.macros),
      };
    }
    const label = typeof entry === "string" ? entry : String(entry ?? `Ingredient ${index + 1}`);
    const profile = profiles.find((item) => item.name.toLowerCase() === label.toLowerCase()) ?? defaultProfile;
    return {
      name: profile.name,
      confidence: normalizeNumber(scores[index]),
      macros: { ...profile.macros },
    };
  });
}

export default function MealHistory({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<MealHistoryEntry[]>([]);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [viewBusy, setViewBusy] = useState(false);
  const [detail, setDetail] = useState<MealDetailState>({
    open: false,
    entry: null,
    analysis: null,
  });
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      return;
    }

    const { data, error } = await supabase
      .from("meal_entries")
      .select("id, date, time, health_score, description, analysis_id, image_url")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error) {
      console.error("Error fetching meal entries:", error);
      setEntries([]);
    } else {
      setEntries((data as MealHistoryEntry[]) || []);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const closeDialogError = () => setDialogError(null);

  const viewEntry = async (entry: MealHistoryEntry & { macros?: number[] | null }) => {
    if (viewBusy) return;
    if (!entry.analysis_id) {
      setDialogError("No scan analysis is linked with this meal entry.");
      return;
    }

    setViewBusy(true);
    try {
      const { data, error } = await supabase
        .from("meal_analyses")
        .select("id, image_url, detected_labels, confidence_scores, macros")
        .eq("id", entry.analysis_id)
        .single();

      if (error || !data) {
        console.error("Error fetching meal analysis:", error);
        setDialogError("Unable to load meal analysis details.");
        return;
      }

      setDetail({
        open: true,
        entry,
        analysis: {
          id: data.id,
          image_url: data.image_url,
          detected_labels: normalizeIngredientRows(data.detected_labels ?? [], data.confidence_scores ?? []),
          macros: Array.isArray(data.macros) ? (data.macros as number[]) : null,
        },
      });
    } finally {
      setViewBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!detail.entry) return;
    try {
      await supabase.from("meal_entries").delete().eq("id", detail.entry.id);
      if (detail.analysis) {
        await supabase.from("meal_analyses").delete().eq("id", detail.analysis.id);
      }
      setDetail({ open: false, entry: null, analysis: null });
      fetchEntries();
    } catch (error) {
      console.error("Error deleting meal:", error);
      setDialogError("Failed to delete meal. Please try again.");
    }
  };

  const handleSave = async (payload: MealUpdatePayload) => {
    if (!detail.entry || !detail.analysis) return;

    const confidences = payload.rows.map((row) => Number(row.confidence));
    const breakdown = payload.rows;
    const macrosArray = [
      Number(payload.totals.calories.toFixed(2)),
      Number(payload.totals.carbs.toFixed(2)),
      Number(payload.totals.protein.toFixed(2)),
      Number(payload.totals.fats.toFixed(2)),
    ];

    try {
      await supabase
        .from("meal_analyses")
        .update({
          detected_labels: breakdown,
          confidence_scores: confidences,
          macros: macrosArray,
        })
        .eq("id", detail.analysis.id);

      await supabase
        .from("meal_entries")
        .update({
          description: payload.description,
          health_score: payload.healthScore,
        })
        .eq("id", detail.entry.id);

      setDetail((prev) =>
        prev.entry && prev.analysis
          ? {
              open: true,
              entry: {
                ...prev.entry,
                description: payload.description,
                health_score: payload.healthScore,
              },
              analysis: {
                ...prev.analysis,
                detected_labels: breakdown,
                macros: macrosArray,
              },
            }
          : prev,
      );

      fetchEntries();
    } catch (error) {
      console.error("Error saving meal changes:", error);
      setDialogError("Failed to save changes. Please try again.");
    }
  };

  return (
    <>
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
        <h2 className="relative z-10 mb-4 text-xl font-semibold">Meal History</h2>
        {entries.length === 0 ? (
          <p className="relative z-10 text-white/80">No meal entries yet.</p>
        ) : (
          <MealHistoryTable entries={entries} onSelect={viewEntry} />
        )}
      </div>

      <MealDetailModal
        open={detail.open}
        entry={detail.entry}
        analysis={detail.analysis}
        onClose={() => setDetail({ open: false, entry: null, analysis: null })}
        onDelete={handleDelete}
        onSave={handleSave}
      />

      <NoticeDialog open={Boolean(dialogError)} message={dialogError ?? ""} onClose={closeDialogError} />
    </>
  );
}
