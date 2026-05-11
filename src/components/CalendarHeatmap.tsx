import type { HabitLog } from "@/lib/habits";
import { getLast30DaysMap } from "@/lib/habits";

interface CalendarHeatmapProps {
  habitId: string;
  logs: HabitLog[];
  color?: string;
}

export function CalendarHeatmap({ habitId, logs, color }: CalendarHeatmapProps) {
  const daysMap = getLast30DaysMap(habitId, logs);
  const entries = Array.from(daysMap.entries());
  const today = new Date().toISOString().split("T")[0];

  // Calculate streak ending at each date for intensity
  const getIntensity = (date: string): number => {
    const idx = entries.findIndex(([d]) => d === date);
    if (idx === -1 || !entries[idx][1]) return 0;
    let streak = 1;
    for (let i = idx - 1; i >= 0; i--) {
      if (entries[i][1]) streak++;
      else break;
    }
    if (streak >= 7) return 4;
    if (streak >= 4) return 3;
    if (streak >= 2) return 2;
    return 1;
  };

  const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"];

  // Pad entries to start on Monday
  const firstDate = entries[0]?.[0];
  const firstDay = firstDate ? new Date(firstDate).getDay() : 1;
  const padStart = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="space-y-1.5">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((d, i) => (
          <div key={i} className="text-[10px] text-muted-foreground font-medium text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: padStart }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {entries.map(([date, done]) => {
          const isToday = date === today;
          const intensity = getIntensity(date);

          const opacityMap: Record<number, string> = {
            0: "bg-muted",
            1: "bg-primary/25",
            2: "bg-primary/45",
            3: "bg-primary/65",
            4: "bg-primary/85",
          };

          return (
            <div
              key={date}
              title={`${date}: ${done ? `${intensity}-day streak` : "Missed"}`}
              className={`
                aspect-square rounded-md transition-colors duration-200
                ${done ? opacityMap[intensity] : opacityMap[0]}
                ${isToday ? "ring-[1.5px] ring-primary ring-offset-1 ring-offset-background" : ""}
              `}
              style={done && color ? { backgroundColor: color, opacity: 0.2 + intensity * 0.2 } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
