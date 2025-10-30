"use client";

export interface MealHistoryEntry {
  id: string;
  date: string;
  time: string;
  health_score: number;
  description: string;
  analysis_id?: string | null;
  image_url?: string | null;
}

interface MealHistoryTableProps {
  entries: MealHistoryEntry[];
  onSelect: (entry: MealHistoryEntry) => void;
}

export function MealHistoryTable({ entries, onSelect }: MealHistoryTableProps) {
  return (
    <div className="relative z-10 overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[720px] table-auto text-sm md:table-fixed">
        <thead className="text-left text-white/80">
          <tr className="border-b border-white/20">
            <th scope="col" className="w-[110px] px-4 py-3 whitespace-nowrap font-medium">Date</th>
            <th scope="col" className="w-[90px] px-4 py-3 whitespace-nowrap font-medium">Time</th>
            <th scope="col" className="w-[120px] px-4 py-3 whitespace-nowrap font-medium">Health Score</th>
            <th scope="col" className="px-4 py-3 font-medium">Meal Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={entry.id}
              onClick={() => onSelect(entry)}
              tabIndex={0}
              className={`cursor-pointer transition ${i % 2 === 0 ? "bg-white/5" : "bg-white/0"} hover:bg-white/15`}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}
