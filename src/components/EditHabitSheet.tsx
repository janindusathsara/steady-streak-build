import { useState, useEffect } from "react";
import { X, Bell, Trash2 } from "lucide-react";
import { HABIT_COLORS } from "@/lib/habits";
import type { Habit, HabitFrequency } from "@/lib/habits";
import { FrequencyPicker } from "@/components/FrequencyPicker";

const COLOR_NAMES: Record<string, string> = {
  "oklch(0.38 0.08 160)": "Forest",
  "oklch(0.55 0.15 200)": "Ocean",
  "oklch(0.60 0.15 50)": "Amber",
  "oklch(0.50 0.15 320)": "Berry",
  "oklch(0.55 0.12 270)": "Lavender",
  "oklch(0.50 0.10 100)": "Olive",
};

interface EditHabitSheetProps {
  habit: Habit | null;
  onClose: () => void;
  onSave: (updated: Habit) => void;
  onDelete?: (habitId: string) => void;
}

const MAX_NAME = 40;

export function EditHabitSheet({ habit, onClose, onSave, onDelete }: EditHabitSheetProps) {
  useEffect(() => {
    if (!habit) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [habit]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>({ type: "daily" });
  const [reminderTime, setReminderTime] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
      setSelectedColor(habit.color);
      setFrequency(habit.frequency);
      setReminderTime(habit.reminderTime || "");
      setShowReminder(!!habit.reminderTime);
      setConfirmDelete(false);
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit || !name.trim()) return;
    onSave({ ...habit, name: name.trim(), description: description.trim(), color: selectedColor, frequency, reminderTime: reminderTime || null });
    onClose();
  };

  if (!habit) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border p-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] animate-spring-up max-h-[85vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Edit habit</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Name</label>
              <span className={`text-[11px] tabular-nums ${name.length >= MAX_NAME ? "text-destructive" : "text-muted-foreground"}`}>
                {name.length}/{MAX_NAME}
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
              placeholder="e.g. Morning walk"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about this habit"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
            />
          </div>

          <FrequencyPicker value={frequency} onChange={setFrequency} />

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
            <div className="flex gap-3 items-center">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full transition-all duration-200 active:scale-90 ${
                    selectedColor === c
                      ? "ring-2 ring-offset-2 ring-offset-card ring-ring scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  title={COLOR_NAMES[c] || c}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">{COLOR_NAMES[selectedColor] || "Custom"}</p>
          </div>

          {/* Reminder */}
          <div>
            <button
              type="button"
              onClick={() => setShowReminder(!showReminder)}
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              Reminder
              <span className="text-[11px] text-muted-foreground">(optional)</span>
            </button>
            {showReminder && (
              <div className="mt-2">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
                {reminderTime && (
                  <button
                    type="button"
                    onClick={() => { setReminderTime(""); setShowReminder(false); }}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            Save changes
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (!confirmDelete) { setConfirmDelete(true); return; }
                onDelete(habit!.id);
                onClose();
              }}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                confirmDelete
                  ? "bg-destructive text-destructive-foreground"
                  : "text-destructive hover:bg-destructive/10"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmDelete ? "Tap again to confirm" : "Delete habit"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
