import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { analyzeMealImage, generateStoragePath } from "@/lib/analysis/analyzeMealImage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ScanPayload;
    if (!body.imageData) {
      return NextResponse.json({ error: "Image payload missing." }, { status: 400 });
    }

    const match = body.imageData.match(/^data:image\/(jpeg|png);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Only JPEG or PNG base64 data URLs are supported." }, { status: 400 });
    }

    const [, format, base64Payload] = match;
    const imageBytes = Buffer.from(base64Payload, "base64");
    const maxBytes = 15 * 1024 * 1024; // Rekognition limit
    if (imageBytes.length === 0 || imageBytes.length > maxBytes) {
      return NextResponse.json({ error: "Image size must be between 1 byte and 15MB." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const admin = await createAdminClient();
    const storagePath = generateStoragePath(user.id);

    const { error: uploadError } = await admin.storage.from("meal-images").upload(storagePath, imageBytes, {
      cacheControl: "3600",
      contentType: format === "png" ? "image/png" : "image/jpeg",
      upsert: false,
    });

    if (uploadError) {
      console.error("[scan] upload error", uploadError);
      return NextResponse.json({ error: "Failed to store image." }, { status: 500 });
    }

    const { data: publicUrlData } = admin.storage.from("meal-images").getPublicUrl(storagePath);
    const imageUrl = publicUrlData.publicUrl;

    const analysis = await analyzeMealImage(imageBytes);
    const confidenceScores = analysis.labels.map((label) => Number(label.confidence.toFixed(2)));
    const macrosArray = [
      analysis.macros.calories,
      analysis.macros.carbs,
      analysis.macros.protein,
      analysis.macros.fats,
    ].map((value) => Number(value.toFixed(2)));
    const ingredientBreakdown = analysis.ingredients.map((ingredient) => ({
      name: ingredient.name,
      confidence: Number(ingredient.confidence.toFixed(2)),
      macros: {
        calories: Number(ingredient.macros.calories.toFixed(2)),
        carbs: Number(ingredient.macros.carbs.toFixed(2)),
        protein: Number(ingredient.macros.protein.toFixed(2)),
        fats: Number(ingredient.macros.fats.toFixed(2)),
      },
    }));

    const { data: analysisRow, error: analysisError } = await admin
      .from("meal_analyses")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        detected_labels: ingredientBreakdown,
        confidence_scores: confidenceScores,
        macros: macrosArray,
      })
      .select("id, user_id")
      .single();

    if (analysisError || !analysisRow) {
      console.error("[scan] analysis insert error", analysisError);
      return NextResponse.json({ error: "Failed to persist analysis." }, { status: 500 });
    }

    const now = new Date();
    const mealEntryPayload = {
      user_id: user.id,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 8),
      health_score: analysis.healthScore,
      description: analysis.description,
      analysis_id: analysisRow.id,
      image_url: imageUrl,
    };

    const { data: entryData, error: mealEntryError } = await admin
      .from("meal_entries")
      .insert(mealEntryPayload)
      .select("id")
      .single();

    if (mealEntryError || !entryData) {
      console.error("[scan] meal entry insert failed", mealEntryError);

      const hint =
        mealEntryError?.code === "42703"
          ? "Add analysis_id (uuid) and image_url (text) columns to meal_entries."
          : mealEntryError?.message;

      return NextResponse.json({ error: hint ?? "Failed to save meal entry." }, { status: 500 });
    }

    return NextResponse.json({
      analysisId: String(analysisRow.id),
      entryId: String(entryData.id),
      imageUrl,
      summary: analysis,
    });
  } catch (error) {
    console.error("[scan] unexpected error", error);
    return NextResponse.json({ error: "Unexpected error during scan." }, { status: 500 });
  }
}
interface ScanPayload {
  imageData?: string;
}
