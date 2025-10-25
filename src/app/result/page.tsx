"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Nutrition = 
{
  title: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  healthScore: number;
};

//mock data to be removed
const DEMO: Nutrition = 
{
  title: "Waffles with fruits",
  calories: 400,
  carbs: 60,
  protein: 9,
  fats: 15,
  healthScore: 65,
};

export default function ResultPage() 
{
  const router = useRouter();
  const [img, setImg] = useState("/food.jpg");
  const [nut, setNut] = useState<Nutrition>(DEMO);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fromScan = sessionStorage.getItem("scan:lastImage");
    if (fromScan) setImg(fromScan);

    const fromNut = sessionStorage.getItem("scan:lastNutrition");
    if (fromNut) 
      {
      try { setNut(JSON.parse(fromNut)); } catch {}
    }
  }, []);

  const handleDone = async () => {
    setSaving(true);
    setErr(null);
    const supabase = createClient();

    //getting current user for user_id
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      setErr("Please log in again.");
      setSaving(false);
      return;
    }

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);

    const { error: insertErr } = await supabase.from("meal_entries").insert({
      user_id: user.id,
      date,
      time,
      description: nut.title,
      health_score: Math.round(nut.healthScore),
    });

    if (insertErr) 
      {
      setErr(insertErr.message);
      setSaving(false);
      return;
    }

    sessionStorage.removeItem("scan:lastImage");
    sessionStorage.removeItem("scan:lastNutrition");

    router.push("/profile");
  };

  return (
    <div className="relative min-h-svh w-full overflow-hidden text-white">
      {/* background img */}
      <img src={img} alt="Scanned meal" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto mb-3 w-[92%] max-w-[520px] rounded-3xl bg-white/35 p-5 backdrop-blur-md">
          <h2 className="mb-3 text-xl font-semibold drop-shadow">{nut.title}</h2>

          <div className="grid grid-cols-2 gap-3">
            <Tile label="Calories" value={`${nut.calories} kcal`} />
            <Tile label="Carbs" value={`${nut.carbs} g`} />
            <Tile label="Protein" value={`${nut.protein} g`} />
            <Tile label="Fats" value={`${nut.fats} g`} />
          </div>

          <div className="mt-3 rounded-2xl bg-white/35 p-3">
            <div className="mb-1 text-sm">Health score</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/40">
              <div className="h-full rounded-full bg-white" style={{ width: `${nut.healthScore}%` }} />
            </div>
            <div className="mt-1 text-right text-sm">{nut.healthScore}%</div>
          </div>

          {err && (
            <div className="mt-3 rounded-xl bg-red-600/90 px-3 py-2 text-sm">
              {err}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/scan"
              className="grid h-12 place-items-center rounded-2xl bg-white/40 text-white backdrop-blur hover:bg-white/50"
            >
              Retry
            </Link>
            <button
              onClick={handleDone}
              disabled={saving}
              className="grid h-12 place-items-center rounded-2xl bg-white text-black hover:opacity-90 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) 
{
  return (
    <div className="rounded-2xl bg-white/35 p-3">
      <div className="text-sm">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
