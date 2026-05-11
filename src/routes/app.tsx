import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  getHabits, getLogs, saveHabits, saveLogs, toggleHabit, isCompletedToday,
  getStreak, getMilestoneMessage, updateHabit, isScheduledToday, frequencyLabel,
  todayKey,
} from "@/lib/habits";
import type { Habit, HabitLog } from "@/lib/habits";
import { HabitCard } from "@/components/HabitCard";
import { ProgressRing } from "@/components/ProgressRing";
import { BottomNav } from "@/components/BottomNav";
import { AddHabitSheet } from "@/components/AddHabitSheet";
import { EditHabitSheet } from "@/components/EditHabitSheet";
import { OnboardingFlow, isOnboarded } from "@/components/OnboardingFlow";
import { Leaf, Sparkles, ChevronDown, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { rescheduleAllReminders, scheduleReminder } from "@/lib/notifications";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchHabitsFromCloud, fetchLogsFromCloud, saveHabitToCloud,
  updateHabitInCloud, deleteHabitFromCloud, reorderHabitsInCloud,
  toggleLogInCloud, migrateLocalToCloud,
} from "@/lib/habits-cloud";
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";

export const Route = createFileRoute("/app")({
  component: TodayPage,
  head: () => ({
    meta: [
      { title: "Continuum — Your daily ritual" },
      { name: "description", content: "Build lasting habits with Continuum. Simple streak tracking, beautiful progress visualization." },
    ],
  }),
});

function TodayPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [mounted, setMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotScheduled, setShowNotScheduled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const isCloud = !!user;

  const reorderScheduledHabits = useCallback((currentHabits: Habit[], activeId: string, overId: string) => {
    const scheduled = currentHabits.filter((h) => isScheduledToday(h));
    const activeIndex = scheduled.findIndex((h) => h.id === activeId);
    const overIndex = scheduled.findIndex((h) => h.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return currentHabits;
    }

    const reorderedScheduled = arrayMove(scheduled, activeIndex, overIndex);
    let scheduledPointer = 0;

    return currentHabits.map((habit) => {
      if (!isScheduledToday(habit)) return habit;
      const nextHabit = reorderedScheduled[scheduledPointer];
      scheduledPointer += 1;
      return nextHabit;
    });
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      if (user) {
        try {
          await migrateLocalToCloud(user.id);
          const [h, l] = await Promise.all([
            fetchHabitsFromCloud(user.id),
            fetchLogsFromCloud(user.id),
          ]);
          setHabits(h);
          setLogs(l);
          rescheduleAllReminders(h);
        } catch (err) {
          console.error("Failed to load from cloud:", err);
          // Fallback to local
          const h = getHabits();
          setHabits(h);
          setLogs(getLogs());
          rescheduleAllReminders(h);
        }
      } else {
        const h = getHabits();
        setHabits(h);
        setLogs(getLogs());
        setShowOnboarding(!isOnboarded() && h.length === 0);
        rescheduleAllReminders(h);
      }
      setMounted(true);
    };

    loadData();
  }, [user, authLoading]);

  const handleToggle = async (habitId: string) => {
    const streakBefore = getStreak(habitId, logs, habits);
    const today = todayKey();
    const exists = isCompletedToday(habitId, logs);

    // Optimistic update
    const updated = toggleHabit(habitId, logs);
    setLogs(updated);

    if (isCloud && user) {
      try {
        await toggleLogInCloud(habitId, today, user.id, exists);
      } catch (err) {
        console.error("Cloud toggle failed:", err);
      }
    } else {
      saveLogs(updated);
    }

    const streakAfter = getStreak(habitId, updated, habits);
    if (streakAfter > streakBefore) {
      const msg = getMilestoneMessage(streakAfter);
      if (msg) {
        const habit = habits.find((h) => h.id === habitId);
        toast.success(msg, { description: habit?.name });
      }
    }
  };

  const handleAdd = async (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    scheduleReminder(habit);

    if (isCloud && user) {
      try {
        await saveHabitToCloud(habit, user.id, updated.length - 1);
      } catch (err) {
        console.error("Cloud save failed:", err);
      }
    } else {
      saveHabits(updated);
    }
  };

  const handleEdit = async (updatedHabit: Habit) => {
    const newHabits = updateHabit(habits, updatedHabit);
    setHabits(newHabits);
    scheduleReminder(updatedHabit);

    if (isCloud) {
      try {
        await updateHabitInCloud(updatedHabit);
      } catch (err) {
        console.error("Cloud update failed:", err);
      }
    } else {
      saveHabits(newHabits);
    }
  };

  const handleDelete = async (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);

    if (isCloud) {
      try {
        await deleteHabitFromCloud(habitId);
      } catch (err) {
        console.error("Cloud delete failed:", err);
      }
    } else {
      saveHabits(updated);
    }
    toast("Habit removed");
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setHabits((currentHabits) => reorderScheduledHabits(currentHabits, String(active.id), String(over.id)));
  }, [reorderScheduledHabits]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const reordered = reorderScheduledHabits(habits, String(active.id), String(over.id));
    if (reordered === habits) return;

    if (isCloud) {
      try {
        await reorderHabitsInCloud(reordered);
      } catch (err) {
        console.error("Cloud reorder failed:", err);
      }
    } else {
      saveHabits(reordered);
    }
  }, [habits, isCloud, reorderScheduledHabits]);

  const handleOnboardingComplete = (habit?: Habit) => {
    setShowOnboarding(false);
    if (habit) {
      handleAdd(habit);
    }
  };

  // Split habits into scheduled today and not scheduled
  const scheduledToday = habits.filter((h) => isScheduledToday(h));
  const notScheduledToday = habits.filter((h) => !isScheduledToday(h));

  const completedCount = scheduledToday.filter((h) => isCompletedToday(h.id, logs)).length;
  const allDone = scheduledToday.length > 0 && completedCount === scheduledToday.length;

  if (!mounted || authLoading) return null;

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const subtitle = scheduledToday.length === 0 && habits.length > 0
    ? "Nothing scheduled today"
    : scheduledToday.length === 0
      ? ""
      : allDone
        ? "All done for today ✨"
        : `${completedCount} of ${scheduledToday.length} done`;

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="relative max-w-lg mx-auto px-5 pt-12">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-up-blur">
          <div>
            <p className="text-[13px] text-muted-foreground font-medium">{greeting}</p>
            <h1 className="text-2xl font-semibold text-foreground mt-0.5 tracking-tight" style={{ lineHeight: "1.2" }}>
              {allDone ? (
                <span className="flex items-center gap-2">
                  Perfect day
                  <Sparkles className="w-5 h-5 text-primary" />
                </span>
              ) : (
                "Your daily ritual"
              )}
            </h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{dateStr} · {subtitle}</p>}
            {!subtitle && <p className="text-sm text-muted-foreground mt-1">{dateStr}</p>}
          </div>
          {scheduledToday.length > 0 && (
            <div className="flex-shrink-0 -mt-1">
              <ProgressRing completed={completedCount} total={scheduledToday.length} />
            </div>
          )}
        </div>

        {/* Habit list */}
        {habits.length === 0 ? (
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl py-16 px-6 text-center animate-fade-up-blur mt-6" style={{ animationDelay: "160ms" }}>
            <Leaf className="w-7 h-7 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-foreground font-semibold text-lg">A fresh start</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-[240px] mx-auto" style={{ textWrap: "pretty" }}>
              Tap the + button below to add your first habit
            </p>
          </div>
        ) : (
          <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
            <SortableContext items={scheduledToday.map((h) => h.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 mt-6">
                {scheduledToday.map((habit, i) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    logs={logs}
                    habits={habits}
                    index={i}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={(h) => setEditHabit(h)}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {activeId ? (() => {
                const habit = scheduledToday.find((h) => h.id === activeId);
                if (!habit) return null;
                const i = scheduledToday.indexOf(habit);
                return (
                  <div className="relative" style={{ width: "100%" }}>
                    <div className="relative overflow-hidden rounded-lg bg-card shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-grabbing">
                      <div className="absolute left-2.5 top-3 bottom-3 w-1 rounded-full" style={{ backgroundColor: habit.color }} />
                      <div className="flex items-center gap-3 p-4 pl-6">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${isCompletedToday(habit.id, logs) ? "border-transparent" : "border-border bg-background"}`}
                          style={isCompletedToday(habit.id, logs) ? { backgroundColor: habit.color } : undefined}>
                          {isCompletedToday(habit.id, logs) && <Check className="w-5 h-5 text-white" strokeWidth={2.5} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-[15px] leading-snug ${isCompletedToday(habit.id, logs) ? "line-through text-muted-foreground" : "text-foreground"}`}>{habit.name}</p>
                          {habit.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{habit.description}</p>}
                        </div>
                        {getStreak(habit.id, logs, habits) > 0 && (
                          <div className="flex items-baseline gap-0.5">
                            <span className="font-mono text-base font-semibold text-foreground tabular-nums">{getStreak(habit.id, logs, habits)}</span>
                            <span className="text-xs text-muted-foreground font-medium">d</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })() : null}
            </DragOverlay>
          </DndContext>

            {notScheduledToday.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowNotScheduled(!showNotScheduled)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2 hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showNotScheduled ? "rotate-0" : "-rotate-90"}`} />
                  Not scheduled today ({notScheduledToday.length})
                </button>
                {showNotScheduled && (
                  <div className="space-y-2 opacity-60">
                    {notScheduledToday.map((habit) => (
                      <button
                        key={habit.id}
                        onClick={() => setEditHabit(habit)}
                        className="flex items-center gap-3 rounded-xl bg-card/50 px-4 py-3 w-full text-left hover:bg-card/80 transition-colors"
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: habit.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">{habit.name}</p>
                          <p className="text-[11px] text-muted-foreground/60">{frequencyLabel(habit.frequency)}</p>
                        </div>
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav onAddClick={() => setSheetOpen(true)} />
      <AddHabitSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={handleAdd} />
      <EditHabitSheet habit={editHabit} onClose={() => setEditHabit(null)} onSave={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
