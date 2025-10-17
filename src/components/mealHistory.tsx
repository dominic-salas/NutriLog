"use client";

import { useState, useEffect, useCallback } from 'react';
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
        const { error } = await supabase
            .from('meal_entries')
            .delete()
            .eq('id', id);

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
        <div className="w-full max-w-4xl rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Meal History</h2>
            {entries.length === 0 ? (
                <p className="text-gray-600">No meal entries yet.</p>
            ) : (
                <div className="overflow-x-auto min-w-[800px] max-w-[1200px] w-full">
                    <table className="w-full text-sm text-gray-900 table-fixed">
                        <thead className="text-left">
                            <tr className="border-b">
                                <th scope="col" className="pb-2 px-4 py-3 font-medium whitespace-nowrap" style={{ width: '15%' }}>Date</th>
                                <th scope="col" className="pb-2 px-4 py-3 font-medium" style={{ width: '12%' }}>Time</th>
                                <th scope="col" className="pb-2 px-4 py-3 font-medium whitespace-nowrap" style={{ width: '15%' }}>Health Score</th>
                                <th scope="col" className="pb-2 px-4 py-3 font-medium" style={{ width: '45%' }}>Meal Description</th>
                                <th scope="col" className="pb-2 px-4 py-3 font-medium" style={{ width: '13%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={entry.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                    <td className="py-2.5 px-4 align-middle">{entry.date}</td>
                                    <td className="py-2.5 px-4 align-middle">{formatTime(entry.time)}</td>
                                    <td className="py-2.5 px-4 align-middle">{entry.health_score}%</td>
                                    <td className="py-2.5 px-4 align-middle break-words whitespace-normal max-w-0 overflow-hidden leading-relaxed">{entry.description}</td>
                                    <td className="py-2.5 px-4 align-middle">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteEntry(entry.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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