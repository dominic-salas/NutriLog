"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface MealEntry {
  id: string;
  date: string;
  time: string;
  health_score: number;
  description: string;
}

export default function MealHistory({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
    // fetchEntries wrapped in useCallback to satisfy react-hooks/exhaustive-deps
  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      return;
    }
    const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

    if (error) {
      console.error('Error fetching meal entries:', error);
      setEntries([]);
    } else {
      setEntries((data as MealEntry[]) || []);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const deleteEntry = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', id);
    setBusyId(null);

    if (error) {
        console.error('Error deleting entry:', error);
    } else {
        setEntries(entries.filter(e => e.id !== id));
    }
};

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <div className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
      <h2 className="relative z-10 mb-4 text-xl font-semibold">Meal History</h2>
      {entries.length === 0 ? (
        <p className="relative z-10 text-white/80">No meal entries yet.</p>
      ) : (
        <div
          className="
            relative z-10
            overflow-x-auto
            /* add momentum scroll on iOS */
            [-webkit-overflow-scrolling:touch]
          "
        >
          <table className="w-full min-w-[720px] text-sm table-auto md:table-fixed">
            <thead className="text-left text-white/80">
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 font-medium whitespace-nowrap w-[110px]">
                  Date
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap w-[90px]">
                  Time
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap w-[120px]">
                  Health&nbsp;Score
                </th>
                <th className="px-4 py-3 font-medium">Meal Description</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap w-[84px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id}
                  onClick={() => router.push(`/meal/${entry.id}`)}
                  className={`cursor-pointer transition ${
                    i % 2 === 0 ? "bg-white/5" : "bg-white/0"
                  } hover:bg-white/15`}
                >
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    {formatTime(entry.time)}
                  </td>
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    {entry.health_score}%
                  </td>
                  <td className="px-4 py-3 align-middle whitespace-normal break-words">
                    {entry.description}
                  </td>
                  <td
                    className="px-4 py-3 align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        disabled={busyId === entry.id}
                        className="rounded-lg bg-white/10 text-white hover:bg-white/20"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}