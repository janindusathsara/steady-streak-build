import type { Habit } from "./habits";

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) return "unsupported";
  const result = await Notification.requestPermission();
  return result;
}

export function scheduleReminder(habit: Habit): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;
  if (!habit.reminderTime) return;

  // Clear existing timer
  cancelReminder(habit.id);

  const [hours, minutes] = habit.reminderTime.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If time already passed today, skip
  if (target <= now) return;

  const ms = target.getTime() - now.getTime();
  const timer = setTimeout(() => {
    new Notification("Continuum reminder", {
      body: `Time to ${habit.name.toLowerCase()}`,
      icon: "/favicon.ico",
      tag: `habit-${habit.id}`,
    });
    activeTimers.delete(habit.id);
  }, ms);

  activeTimers.set(habit.id, timer);
}

export function cancelReminder(habitId: string): void {
  const timer = activeTimers.get(habitId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(habitId);
  }
}

export function rescheduleAllReminders(habits: Habit[]): void {
  // Clear all
  for (const [id] of activeTimers) {
    cancelReminder(id);
  }
  // Schedule
  for (const habit of habits) {
    scheduleReminder(habit);
  }
}
