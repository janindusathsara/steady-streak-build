export type HabitFrequency =
  | { type: "daily" }
  | { type: "weekdays"; days: number[] } // 0=Sun, 1=Mon, ..., 6=Sat
  | { type: "weekly"; times: number };

export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  frequency: HabitFrequency;
  reminderTime: string | null; // "HH:MM" or null
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
}

const HABITS_KEY = "continuum_habits";
const LOGS_KEY = "continuum_logs";

export const HABIT_COLORS = [
  "oklch(0.38 0.08 160)", // forest
  "oklch(0.55 0.15 200)", // ocean
  "oklch(0.60 0.15 50)",  // amber
  "oklch(0.50 0.15 320)", // berry
  "oklch(0.55 0.12 270)", // lavender
  "oklch(0.50 0.10 100)", // olive
];

export const MILESTONE_STREAKS = [7, 14, 21, 30, 50, 100, 200, 365];

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HABITS_KEY);
  if (!raw) return [];
  const habits = JSON.parse(raw) as Habit[];
  // Migrate old habits without frequency/reminderTime
  return habits.map((h) => ({
    ...h,
    frequency: h.frequency ?? { type: "daily" },
    reminderTime: h.reminderTime ?? null,
  }));
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function getLogs(): HabitLog[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveLogs(logs: HabitLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/** Check if a habit is scheduled for a given date */
export function isScheduledForDate(habit: Habit, dateStr: string): boolean {
  const freq = habit.frequency;
  if (freq.type === "daily") return true;
  if (freq.type === "weekdays") {
    const dayOfWeek = new Date(dateStr + "T00:00:00").getDay();
    return freq.days.includes(dayOfWeek);
  }
  if (freq.type === "weekly") {
    // For "X times per week", it's always available — user decides when
    return true;
  }
  return true;
}

/** Check if habit is scheduled today */
export function isScheduledToday(habit: Habit): boolean {
  return isScheduledForDate(habit, todayKey());
}

export function isCompletedToday(habitId: string, logs: HabitLog[]): boolean {
  const today = todayKey();
  return logs.some((l) => l.habitId === habitId && l.date === today);
}

export function toggleHabit(habitId: string, logs: HabitLog[]): HabitLog[] {
  const today = todayKey();
  const exists = logs.some((l) => l.habitId === habitId && l.date === today);
  if (exists) {
    return logs.filter((l) => !(l.habitId === habitId && l.date === today));
  }
  return [...logs, { habitId, date: today }];
}

export function getStreak(habitId: string, logs: HabitLog[], habits?: Habit[]): number {
  const habitLogs = logs
    .filter((l) => l.habitId === habitId)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (habitLogs.length === 0) return 0;

  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  if (habitLogs[0] !== today && habitLogs[0] !== yesterdayKey) return 0;

  // For weekday-frequency habits, skip non-scheduled days in streak calculation
  const habit = habits?.find((h) => h.id === habitId);

  let streak = 1;
  for (let i = 1; i < habitLogs.length; i++) {
    const curr = new Date(habitLogs[i - 1]);
    const prev = new Date(habitLogs[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else if (habit && habit.frequency.type === "weekdays" && diff <= 3) {
      // Check if all days between are non-scheduled days
      let allSkipped = true;
      for (let d = 1; d < diff; d++) {
        const between = new Date(prev);
        between.setDate(between.getDate() + d);
        const betweenKey = between.toISOString().split("T")[0];
        if (isScheduledForDate(habit, betweenKey)) {
          allSkipped = false;
          break;
        }
      }
      if (allSkipped) streak++;
      else break;
    } else {
      break;
    }
  }
  return streak;
}

export function getLongestStreak(habitId: string, logs: HabitLog[]): number {
  const dates = logs
    .filter((l) => l.habitId === habitId)
    .map((l) => l.date)
    .sort();

  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCompletionRate(habitId: string, logs: HabitLog[], habit: Habit): number {
  const created = new Date(habit.createdAt);
  const today = new Date();
  let scheduledDays = 0;

  // Count only scheduled days
  const d = new Date(created);
  while (d <= today) {
    const key = d.toISOString().split("T")[0];
    if (isScheduledForDate(habit, key)) {
      scheduledDays++;
    }
    d.setDate(d.getDate() + 1);
  }

  if (scheduledDays === 0) return 0;
  const completedDays = logs.filter((l) => l.habitId === habitId).length;
  return Math.round((completedDays / scheduledDays) * 100);
}

export function getWeeklyCompletionCount(habitId: string, logs: HabitLog[]): number {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startKey = startOfWeek.toISOString().split("T")[0];

  return logs.filter((l) => l.habitId === habitId && l.date >= startKey).length;
}

export function getLast30DaysMap(habitId: string, logs: HabitLog[]): Map<string, boolean> {
  const map = new Map<string, boolean>();
  const habitLogs = new Set(logs.filter((l) => l.habitId === habitId).map((l) => l.date));

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    map.set(key, habitLogs.has(key));
  }
  return map;
}

export function createHabit(name: string, description: string, color: string, frequency: HabitFrequency = { type: "daily" }, reminderTime: string | null = null): Habit {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    color,
    frequency,
    reminderTime,
    createdAt: new Date().toISOString(),
  };
}

export function updateHabit(habits: Habit[], updated: Habit): Habit[] {
  return habits.map((h) => (h.id === updated.id ? updated : h));
}

export function getMilestoneMessage(streak: number): string | null {
  if (!MILESTONE_STREAKS.includes(streak)) return null;
  const messages: Record<number, string> = {
    7: "🌱 One week strong!",
    14: "🌿 Two weeks — you're building momentum!",
    21: "🍃 Three weeks! Habits are forming.",
    30: "🌳 One month! You're unstoppable.",
    50: "🏔️ Fifty days! Incredible dedication.",
    100: "💯 One hundred days! Legendary.",
    200: "⭐ Two hundred days! You're an inspiration.",
    365: "🎉 One full year! What an achievement!",
  };
  return messages[streak] || null;
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function frequencyLabel(freq: HabitFrequency): string {
  if (freq.type === "daily") return "Every day";
  if (freq.type === "weekdays") {
    return freq.days.map((d) => DAY_LABELS[d]).join(", ");
  }
  if (freq.type === "weekly") {
    return `${freq.times}× per week`;
  }
  return "Every day";
}
