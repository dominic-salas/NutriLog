"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { MoreVertical } from "lucide-react";
import ingredientProfilesData from "@/lib/analysis/data/ingredient-profiles.json";

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

export type EditableIngredientRow = {
  name: string;
  confidence: number;
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
};

export interface MealUpdatePayload {
  rows: EditableIngredientRow[];
  totals: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
  healthScore: number;
  description: string;
}

export interface MealDetailModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onSave: (payload: MealUpdatePayload) => Promise<void>;
  entry: {
    id: string;
    description: string;
    health_score: number;
    macros?: number[] | null;
    image_url?: string | null;
  } | null;
  analysis: {
    id: string;
    image_url: string | null;
    detected_labels: EditableIngredientRow[];
    macros: number[] | null;
  } | null;
}

const profiles = ingredientProfilesData as IngredientProfile[];
const defaultProfile =
  profiles.find((profile) => profile.name === "Mixed Meal") ?? ({
    name: "Mixed Meal",
    keywords: [],
    macros: { calories: 450, carbs: 45, protein: 25, fats: 18 },
    healthScore: 65,
  } as IngredientProfile);

function summarizeIngredientNames(rows: EditableIngredientRow[], fallback: string) {
  const distinctNames = Array.from(
    new Set(
      rows
        .map((row) => row.name.trim())
        .filter((name) => name.length > 0),
    ),
  );

  if (!distinctNames.length) return fallback;

  const maxNames = 4;
  if (distinctNames.length > maxNames) {
    const trimmed = distinctNames.slice(0, maxNames);
    trimmed[maxNames - 1] = `${trimmed[maxNames - 1]} and more`;
    return trimmed.join(", ");
  }

  if (distinctNames.length === 1) return distinctNames[0];
  if (distinctNames.length === 2) return `${distinctNames[0]} and ${distinctNames[1]}`;

  const leading = distinctNames.slice(0, -1).join(", ");
  const trailing = distinctNames[distinctNames.length - 1];
  return `${leading}, and ${trailing}`;
}

export function MealDetailModal({
  open,
  onClose,
  onDelete,
  onSave,
  entry,
  analysis,
}: MealDetailModalProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState<EditableIngredientRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const imageUrl = analysis?.image_url ?? entry?.image_url ?? "";
  const baseDescription = entry?.description ?? "Meal details";

  useEffect(() => {
    if (!open) {
      setRows([]);
      setEditMode(false);
      setMenuOpen(false);
      setIsSaving(false);
      return;
    }

    if (analysis && analysis.detected_labels.length) {
      setRows(analysis.detected_labels.map((row) => ({ ...row, macros: { ...row.macros } })));
      return;
    }

    setRows([
      {
        name: defaultProfile.name,
        confidence: 0,
        macros: { ...defaultProfile.macros },
      },
    ]);
  }, [analysis, open]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          calories: acc.calories + (Number.isFinite(row.macros.calories) ? row.macros.calories : 0),
          carbs: acc.carbs + (Number.isFinite(row.macros.carbs) ? row.macros.carbs : 0),
          protein: acc.protein + (Number.isFinite(row.macros.protein) ? row.macros.protein : 0),
          fats: acc.fats + (Number.isFinite(row.macros.fats) ? row.macros.fats : 0),
        }),
        { calories: 0, carbs: 0, protein: 0, fats: 0 },
      ),
    [rows],
  );

  const healthScore = useMemo(() => {
    if (!rows.length) return defaultProfile.healthScore;
    const sum = rows.reduce((acc, row) => {
      const profile = profiles.find((item) => item.name === row.name) ?? defaultProfile;
      return acc + profile.healthScore;
    }, 0);
    return Math.round(sum / rows.length);
  }, [rows]);

  const description = useMemo(() => summarizeIngredientNames(rows, baseDescription), [rows, baseDescription]);

  const handleClose = () => {
    if (isSaving || editMode) return;
    setEditMode(false);
    setMenuOpen(false);
    onClose();
  };

  const resetRows = () => {
    if (analysis?.detected_labels?.length) {
      setRows(analysis.detected_labels.map((row) => ({ ...row, macros: { ...row.macros } })));
      return;
    }
    setRows([
      {
        name: defaultProfile.name,
        confidence: 0,
        macros: { ...defaultProfile.macros },
      },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        rows,
        totals,
        healthScore,
        description,
      });
      setEditMode(false);
      setMenuOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const renderValue = (value: number, unit?: string) =>
    `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}${unit ?? ""}`;

  return (
    <Modal open={open} onClose={handleClose}>
      <GlassCard className="relative flex max-h-[85svh] flex-col rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-6 pb-6">
            <header className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{description}</h3>
              </div>
              <div className="relative flex justify-end gap-2">
                
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Actions"
                  disabled={!analysis}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#3b3a42] text-sm text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={() => {
                        setEditMode(true);
                        setMenuOpen(false);
                      }}
                      disabled={editMode || !analysis}
                    >
                      Edit ingredients
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={async () => {
                        setMenuOpen(false);
                        await onDelete();
                      }}
                      disabled={!entry}
                    >
                      Delete meal
                    </button>
                  </div>
                )}
              </div>
            </header>

            {imageUrl && (
              <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-black/10">
                <Image
                  src={imageUrl}
                  alt={description}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            )}

            <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
              <div className="flex flex-col gap-4">
                {rows.map((row, index) => (
                  <div
                    key={`${row.name}-${index}`}
                    className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                  >
                    <table className="w-full table-fixed text-sm text-white/90">
                      <tbody className="divide-y divide-white/10">
                        <tr>
                          <th
                            colSpan={2}
                            scope="col"
                            className="bg-white/10 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65"
                          >
                            Ingredient Name
                          </th>
                        </tr>
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-lg font-semibold text-white">
                            {editMode ? (
                              <input
                                type="text"
                                value={row.name}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setRows((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            name: value,
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                              />
                            ) : (
                              row.name
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th
                            colSpan={2}
                            scope="col"
                            className="bg-white/10 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>NutriLog Accuracy</span>
                              {editMode ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={0.1}
                                  value={row.confidence}
                                  onChange={(event) => {
                                    const rawValue = Number(event.target.value);
                                    const value = Number.isFinite(rawValue) ? Math.min(Math.max(rawValue, 0), 100) : 0;
                                    setRows((prev) =>
                                      prev.map((item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              confidence: value,
                                            }
                                          : item,
                                      ),
                                    );
                                  }}
                                  className="w-24 rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-right text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                                />
                              ) : (
                                <span className="text-sm font-medium text-white/85">
                                  {renderValue(row.confidence, "%")}
                                </span>
                              )}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th className="bg-white/5 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65">
                            Calories (cal)
                          </th>
                          <th className="bg-white/5 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65">
                            Protein (g)
                          </th>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-base font-semibold text-white">
                            {editMode ? (
                              <input
                                type="number"
                                step={0.1}
                                value={row.macros.calories}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  setRows((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            macros: {
                                              ...item.macros,
                                              calories: Number.isFinite(value) ? value : 0,
                                            },
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                              />
                            ) : (
                              <span>{`${renderValue(row.macros.calories)} cal`}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-base font-semibold text-white">
                            {editMode ? (
                              <input
                                type="number"
                                step={0.1}
                                value={row.macros.protein}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  setRows((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            macros: {
                                              ...item.macros,
                                              protein: Number.isFinite(value) ? value : 0,
                                            },
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                              />
                            ) : (
                              <span>{`${renderValue(row.macros.protein)} g`}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-white/5 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65">
                            Carbohydrates (g)
                          </th>
                          <th className="bg-white/5 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/65">
                            Fats (g)
                          </th>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-base font-semibold text-white">
                            {editMode ? (
                              <input
                                type="number"
                                step={0.1}
                                value={row.macros.carbs}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  setRows((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            macros: {
                                              ...item.macros,
                                              carbs: Number.isFinite(value) ? value : 0,
                                            },
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                              />
                            ) : (
                              <span>{`${renderValue(row.macros.carbs)} g`}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-base font-semibold text-white">
                            {editMode ? (
                              <input
                                type="number"
                                step={0.1}
                                value={row.macros.fats}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  setRows((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            macros: {
                                              ...item.macros,
                                              fats: Number.isFinite(value) ? value : 0,
                                            },
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                              />
                            ) : (
                              <span>{`${renderValue(row.macros.fats)} g`}</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
          {editMode ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetRows();
                  setEditMode(false);
                }}
                disabled={isSaving}
                className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
              >
                Discard changes
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save & Apply"}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={handleClose} className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15">
              Close
            </Button>
          )}
        </footer>
      </GlassCard>
    </Modal>
  );
}


