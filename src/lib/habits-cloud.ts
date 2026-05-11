import type { Habit, HabitLog, HabitFrequency } from "./habits";

async function getSupabase() {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
}

/** Fetch all habits for the current user from the database */
export async function fetchHabitsFromCloud(userId: string): Promise<Habit[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description || "",
    color: row.color,
    frequency: (row.frequency as HabitFrequency) || { type: "daily" },
    reminderTime: row.reminder_time || null,
    createdAt: row.created_at,
  }));
}

/** Fetch all logs for the current user from the database */
export async function fetchLogsFromCloud(userId: string): Promise<HabitLog[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return (data || []).map((row: any) => ({
    habitId: row.habit_id,
    date: row.date,
  }));
}

/** Save a new habit to the database */
export async function saveHabitToCloud(habit: Habit, userId: string, position: number): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("habits").insert({
    id: habit.id,
    user_id: userId,
    name: habit.name,
    description: habit.description,
    color: habit.color,
    frequency: habit.frequency as any,
    reminder_time: habit.reminderTime,
    position,
    created_at: habit.createdAt,
  });
  if (error) throw error;
}

/** Update a habit in the database */
export async function updateHabitInCloud(habit: Habit): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("habits")
    .update({
      name: habit.name,
      description: habit.description,
      color: habit.color,
      frequency: habit.frequency as any,
      reminder_time: habit.reminderTime,
    })
    .eq("id", habit.id);
  if (error) throw error;
}

/** Delete a habit from the database */
export async function deleteHabitFromCloud(habitId: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("habits").delete().eq("id", habitId);
  if (error) throw error;
}

/** Reorder habits in the database */
export async function reorderHabitsInCloud(habits: Habit[]): Promise<void> {
  const supabase = await getSupabase();
  for (let i = 0; i < habits.length; i++) {
    await supabase.from("habits").update({ position: i }).eq("id", habits[i].id);
  }
}

/** Toggle a log entry (add or remove) */
export async function toggleLogInCloud(habitId: string, date: string, userId: string, exists: boolean): Promise<void> {
  const supabase = await getSupabase();
  if (exists) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("date", date);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: userId,
      date,
    });
    if (error) throw error;
  }
}

/** Migrate localStorage data to cloud on first login */
export async function migrateLocalToCloud(userId: string): Promise<void> {
  const MIGRATED_KEY = "continuum_cloud_migrated";
  if (localStorage.getItem(MIGRATED_KEY) === userId) return;

  const localHabitsRaw = localStorage.getItem("continuum_habits");
  const localLogsRaw = localStorage.getItem("continuum_logs");

  if (!localHabitsRaw && !localLogsRaw) {
    localStorage.setItem(MIGRATED_KEY, userId);
    return;
  }

  const localHabits: Habit[] = localHabitsRaw ? JSON.parse(localHabitsRaw) : [];
  const localLogs: HabitLog[] = localLogsRaw ? JSON.parse(localLogsRaw) : [];

  const supabase = await getSupabase();

  // Check if user already has cloud data
  const { data: existingHabits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (existingHabits && existingHabits.length > 0) {
    localStorage.setItem(MIGRATED_KEY, userId);
    return;
  }

  // Migrate habits
  for (let i = 0; i < localHabits.length; i++) {
    const h = localHabits[i];
    await supabase.from("habits").insert({
      id: h.id,
      user_id: userId,
      name: h.name,
      description: h.description || "",
      color: h.color,
      frequency: (h.frequency || { type: "daily" }) as any,
      reminder_time: h.reminderTime || null,
      position: i,
      created_at: h.createdAt,
    });
  }

  // Migrate logs
  if (localLogs.length > 0) {
    const logInserts = localLogs.map((l) => ({
      habit_id: l.habitId,
      user_id: userId,
      date: l.date,
    }));
    for (let i = 0; i < logInserts.length; i += 100) {
      await supabase.from("habit_logs").insert(logInserts.slice(i, i + 100));
    }
  }

  localStorage.setItem(MIGRATED_KEY, userId);
}
