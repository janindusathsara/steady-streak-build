import { useState } from "react";
import type { HabitFrequency } from "@/lib/habits";
import { DAY_LABELS } from "@/lib/habits";

interface FrequencyPickerProps {
  value: HabitFrequency;
  onChange: (freq: HabitFrequency) => void;
}

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  const mode = value.type;

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">Frequency</label>

      {/* Segmented control */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 mb-3">
        {([
          { type: "daily" as const, label: "Daily" },
          { type: "weekdays" as const, label: "Specific days" },
          { type: "weekly" as const, label: "Per week" },
        ]).map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              if (type === "daily") onChange({ type: "daily" });
              else if (type === "weekdays") onChange({ type: "weekdays", days: [1, 3, 5] });
              else onChange({ type: "weekly", times: 3 });
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
              mode === type
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Weekday toggles */}
      {mode === "weekdays" && value.type === "weekdays" && (
        <div className="flex gap-1.5">
          {DAY_LABELS.map((label, i) => {
            const selected = value.days.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const days = selected
                    ? value.days.filter((d) => d !== i)
                    : [...value.days, i].sort();
                  if (days.length > 0) onChange({ type: "weekdays", days });
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-90 ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {label.charAt(0)}
              </button>
            );
          })}
        </div>
      )}

      {/* Times per week stepper */}
      {mode === "weekly" && value.type === "weekly" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ type: "weekly", times: Math.max(1, value.times - 1) })}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-90"
          >
            −
          </button>
          <span className="font-mono text-lg font-semibold text-foreground tabular-nums w-12 text-center">
            {value.times}×
          </span>
          <button
            type="button"
            onClick={() => onChange({ type: "weekly", times: Math.min(7, value.times + 1) })}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-90"
          >
            +
          </button>
          <span className="text-sm text-muted-foreground">per week</span>
        </div>
      )}
    </div>
  );
}
