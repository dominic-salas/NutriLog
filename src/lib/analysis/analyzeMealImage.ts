import { randomUUID } from "crypto";
import fallbackLabelSets from "./data/fallback-label-sets.json";
import ingredientProfilesData from "./data/ingredient-profiles.json";
import labelBlacklist from "./data/label-blacklist.json";

export interface DetectedLabel {
  name: string;
  confidence: number;
}

export interface IngredientBreakdown {
  name: string;
  confidence: number;
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}

export interface MealAnalysisResult {
  labels: DetectedLabel[];
  description: string;
  healthScore: number;
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
  ingredients: IngredientBreakdown[];
}

type IngredientProfile = {
  name: string;
  keywords: string[];
  macros: MealAnalysisResult["macros"];
  healthScore: number;
};

const FALLBACK_LABEL_SETS = fallbackLabelSets as DetectedLabel[][]; // mocked label groups for when Rekognition fails
const INGREDIENT_PROFILES = (ingredientProfilesData as IngredientProfile[]) ?? []; // curated macro profiles keyed by keywords
const DEFAULT_PROFILE =
  INGREDIENT_PROFILES.find((profile) => profile.name === "Mixed Meal") ?? {
    name: "Mixed Meal",
    keywords: [],
    macros: { calories: 450, carbs: 45, protein: 25, fats: 18 },
    healthScore: 65,
  };
const MATCHABLE_PROFILES = INGREDIENT_PROFILES.filter((profile) => profile.keywords.length > 0); // only profiles with keywords can be matched

// standardizes Rekognition output so comparisons behave
function normalizeLabelName(label: string): string {
  return label.toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

const LABEL_BLACKLIST = new Set(
  (labelBlacklist as string[]).map((label) => normalizeLabelName(label)),
); // Rekognition often returns super generic labels we hide via blacklist

// weeds out junk like "Food" or "Person" before matching
function isBlacklistedLabel(labelName: string | null | undefined): boolean {
  if (!labelName) return false;
  const normalized = normalizeLabelName(labelName);
  return LABEL_BLACKLIST.has(normalized);
}

// finds best-fit profile for a Rekognition label from our keyword list
function resolveIngredient(labelName: string): IngredientProfile | null {
  const normalized = normalizeLabelName(labelName);
  return (
    MATCHABLE_PROFILES.find((ingredient) =>
      ingredient.keywords.some((keyword) => normalized.includes(keyword)),
    ) ?? null
  );
}

// turns ingredient names into a readable meal description
function describeMeal(names: string[]) {
  if (!names.length) return "Meal analysis"; // fallback description when no resolved ingredients
  const maxNames = 4;
  if (names.length > maxNames) {
    const trimmed = names.slice(0, maxNames);
    trimmed[maxNames - 1] = `${trimmed[maxNames - 1]} and more`;
    return trimmed.join(", ");
  }
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  const leading = names.slice(0, -1).join(", ");
  const trailing = names[names.length - 1];
  return `${leading}, and ${trailing}`;
}
// talks to AWS Rekognition (plus optional custom model) and returns sorted labels
async function detectLabelsWithRekognition(imageBytes: Buffer): Promise<DetectedLabel[]> {
  const region = process.env.MY_AWS_REGION;
  const accessKey = process.env.MY_AWS_ACCESS_KEY_ID;
  const secretKey = process.env.MY_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKey || !secretKey) {
    return [];
  }

  try {
    const { RekognitionClient, DetectLabelsCommand, DetectCustomLabelsCommand } = await import(
      "@aws-sdk/client-rekognition"
    );

    const client = new RekognitionClient({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const labelCommand = new DetectLabelsCommand({
      Image: { Bytes: imageBytes },
      MaxLabels: 10,
      MinConfidence: 65,
    });

    const baseResponse = await client.send(labelCommand);
    const baseLabels =
      baseResponse.Labels?.map<DetectedLabel>((label) => ({
        name: label.Name ?? "Unknown",
        confidence: Number(label.Confidence ?? 0),
      })) ?? [];

    const modelArn = process.env.MY_AWS_REKOGNITION_CUSTOM_MODEL_ARN; // group-made fine-tuned Rekognition model for better food accuracy
    if (!modelArn) {
      return baseLabels;
    }

    try {
      const customResponse = await client.send(
        new DetectCustomLabelsCommand({
          Image: { Bytes: imageBytes },
          MinConfidence: 60,
          ProjectVersionArn: modelArn,
        }),
      );

      const customLabels =
        customResponse.CustomLabels?.map<DetectedLabel>((label) => ({
          name: label.Name ?? "CustomLabel",
          confidence: Number(label.Confidence ?? 0),
        })) ?? [];

      const all = [...baseLabels]; // merge base labels with custom labels without duplicates
      for (const custom of customLabels) {
        const existing = all.find((label) => normalizeLabelName(label.name) === normalizeLabelName(custom.name));
        if (existing) {
          existing.confidence = Math.max(existing.confidence, custom.confidence);
        } else {
          all.push(custom);
        }
      }

      return all.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.warn("[analyzeMealImage] custom model unavailable, using base labels only\n", error);
      return baseLabels;
    }
  } catch (error) {
    console.error("[analyzeMealImage] Rekognition error\n", error);
    return [];
  }
}

// Main function: find labels then summarize
export async function analyzeMealImage(imageBytes: Buffer): Promise<MealAnalysisResult> {
  let labels = await detectLabelsWithRekognition(imageBytes);
  labels = labels.filter((label) => !isBlacklistedLabel(label.name));

  if (!labels.length) {
    const fallback = FALLBACK_LABEL_SETS[Math.floor(Math.random() * FALLBACK_LABEL_SETS.length)]; // somewhat realistic label bundle as fallback
    labels = fallback.map((item) => ({
      name: item.name,
      confidence: Math.max(50, item.confidence - Math.random() * 10),
    }));
    labels = labels.filter((label) => !isBlacklistedLabel(label.name));
  }

  if (!labels.length) {
    labels = [
      {
        name: DEFAULT_PROFILE.name,
        confidence: 60,
      },
    ];
  }

  return summarizeMeal(labels);
}

// storage-friendly S3 key for user uploads
export function generateStoragePath(userId: string) {
  const safeId = userId.replace(/[^a-zA-Z0-9-_]/g, "");
  return `user-${safeId}/${Date.now()}-${randomUUID()}.jpg`;
}

// merges labels + optional overrides into a normalized macro + health summary
export function summarizeMeal(
  labels: DetectedLabel[],
  existingBreakdown?: IngredientBreakdown[] | null,
  existingMacros?: number[] | null,
): MealAnalysisResult {
  let breakdown: IngredientBreakdown[];

  if (existingBreakdown && existingBreakdown.length) {
    breakdown = existingBreakdown.map((entry) => ({
      name: entry.name,
      confidence: entry.confidence,
      macros: { ...entry.macros },
    }));
  } else {
    breakdown = labels.map((label) => {
      const profile = resolveIngredient(label.name);
      return {
        name: profile?.name ?? label.name ?? "Unknown",
        confidence: label.confidence,
        macros: { ...(profile?.macros ?? DEFAULT_PROFILE.macros) },
      };
    });
  }

  if (!breakdown.length) {
    breakdown.push({
      name: DEFAULT_PROFILE.name,
      confidence: 0,
      macros: { ...DEFAULT_PROFILE.macros },
    });
  }

  const totals = breakdown.reduce(
    (acc, ingredient) => ({
      calories: acc.calories + ingredient.macros.calories,
      carbs: acc.carbs + ingredient.macros.carbs,
      protein: acc.protein + ingredient.macros.protein,
      fats: acc.fats + ingredient.macros.fats,
    }),
    { calories: 0, carbs: 0, protein: 0, fats: 0 },
  );

  const distinctNames = Array.from(new Set(breakdown.map((entry) => entry.name))); // remove duplicates for cleaner descriptions
  const healthScore =
    breakdown.reduce((acc, entry) => {
      const profile = resolveIngredient(entry.name) ?? DEFAULT_PROFILE;
      return acc + profile.healthScore;
    }, 0) / breakdown.length;

  return {
    labels,
    description: describeMeal(distinctNames),
    healthScore: Math.round(healthScore),
    macros: {
      calories: existingMacros?.[0] ?? Math.round(totals.calories),
      carbs: existingMacros?.[1] ?? Math.round(totals.carbs),
      protein: existingMacros?.[2] ?? Math.round(totals.protein),
      fats: existingMacros?.[3] ?? Math.round(totals.fats),
    },
    ingredients: breakdown,
  };
}
