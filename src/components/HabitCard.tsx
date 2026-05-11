import { useState } from "react";
import { Check, GripVertical } from "lucide-react";
import type { Habit, HabitLog } from "@/lib/habits";
import { isCompletedToday, getStreak, frequencyLabel } from "@/lib/habits";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog[];
  habits?: Habit[];
  index: number;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({
  habit, logs, habits, index, onToggle, onDelete, onEdit,
}: HabitCardProps) {
  const completed = isCompletedToday(habit.id, logs);
  const streak = getStreak(habit.id, logs, habits);
  const [pressing, setPressing] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${index * 60}ms`,
  };

  const handleToggle = () => {
    if (!completed) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
    onToggle(habit.id);
  };

  const showFrequencyBadge = habit.frequency.type !== "daily";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`animate-fade-up-blur relative ${isDragging ? "opacity-30 z-0" : ""}`}
    >
      {/* Drag handle — positioned in left margin */}
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-8 flex flex-col items-center justify-center gap-[3px] cursor-grab active:cursor-grabbing opacity-30 hover:opacity-60 transition-opacity touch-none"
        aria-label="Reorder habit"
      >
        <div className="w-1 h-1 rounded-full bg-foreground/40" />
        <div className="w-1 h-1 rounded-full bg-foreground/40" />
        <div className="w-1 h-1 rounded-full bg-foreground/40" />
      </button>

      <div
        className={`
          flex-1 relative overflow-hidden rounded-xl transition-all duration-300
          bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]
          ${!completed ? "hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]" : ""}
          ${pressing ? "scale-[0.97]" : "scale-100"}
        `}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
      >
        {/* Color accent bar — inset left */}
        <div
          className="absolute left-2.5 top-3 bottom-3 w-1 rounded-full"
          style={{ backgroundColor: habit.color }}
        />

        {showRipple && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-16 h-16 rounded-full"
              style={{
                backgroundColor: habit.color,
                opacity: 0.3,
                animation: "bloom-fill 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            />
          </div>
        )}

        <div className="relative flex items-center gap-3 p-4 pl-6">
          {/* Checkbox — 48px touch target */}
          <button
            onClick={handleToggle}
            className={`
              flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 active:scale-90 outline-none focus:outline-none focus-visible:outline-none
              ${completed
                ? "border-transparent"
                : "border-border bg-background hover:border-primary/40"
              }
            `}
            style={completed ? { backgroundColor: habit.color } : undefined}
            aria-label={`Mark ${habit.name} as ${completed ? "incomplete" : "complete"}`}
          >
            {completed && (
              <Check className="w-5 h-5 text-white animate-bounce-check" strokeWidth={2.5} />
            )}
          </button>

          <button
            onClick={() => onEdit(habit)}
            className="flex-1 min-w-0 text-left"
          >
            <p className={`font-medium text-[15px] leading-snug transition-all duration-300 ${
              completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}>
              {habit.name}
            </p>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {habit.description}
              </p>
            )}
            {showFrequencyBadge && (
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                {frequencyLabel(habit.frequency)}
              </p>
            )}
          </button>

          <div className="flex-shrink-0 text-right">
            {streak > 0 && (
              <div className="flex items-baseline gap-0.5">
                <span className="font-mono text-base font-semibold text-foreground tabular-nums">
                  {streak}
                </span>
                <span className="text-xs text-muted-foreground font-medium">d</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
