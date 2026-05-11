import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Sun, Moon, Monitor, Trash2, Download, Upload, Leaf, ChevronRight, Bell, BellOff, LogIn, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getHabits, getLogs, saveHabits, saveLogs } from "@/lib/habits";
import { BottomNav } from "@/components/BottomNav";
import { AddHabitSheet } from "@/components/AddHabitSheet";
import type { Habit } from "@/lib/habits";
import { toast } from "sonner";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  rescheduleAllReminders,
} from "@/lib/notifications";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Continuum — Settings" },
      { name: "description", content: "Customize your Continuum experience." },
    ],
  }),
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission());

  const handleExport = () => {
    const data = {
      habits: getHabits(),
      logs: getLogs(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `continuum-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.habits && Array.isArray(data.habits)) {
          saveHabits(data.habits);
        }
        if (data.logs && Array.isArray(data.logs)) {
          saveLogs(data.logs);
        }
        toast.success("Data imported successfully");
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    // Clear local storage
    saveHabits([]);
    saveLogs([]);

    // Clear cloud data if authenticated
    if (user) {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("habit_logs").delete().eq("user_id", user.id);
        await supabase.from("habits").delete().eq("user_id", user.id);
      } catch (err) {
        console.error("Failed to clear cloud data:", err);
        toast.error("Failed to clear cloud data");
        setConfirmClear(false);
        return;
      }
    }

    setConfirmClear(false);
    toast.success("All data cleared");
  };

  const handleAdd = (habit: Habit) => {
    const updated = [...getHabits(), habit];
    saveHabits(updated);
  };

  const handleNotificationToggle = async () => {
    if (notifPermission === "granted") {
      toast("To disable notifications, use your browser settings");
      return;
    }
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === "granted") {
      toast.success("Notifications enabled");
      rescheduleAllReminders(getHabits());
    } else if (result === "denied") {
      toast.error("Notifications blocked by browser");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
    toast.success("Signed out");
  };

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "Auto" },
  ];

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto px-5 pt-12">
        <div className="animate-fade-up-blur">
          <p className="text-[13px] text-muted-foreground font-medium">Preferences</p>
          <h1 className="text-2xl font-semibold text-foreground mt-0.5 tracking-tight" style={{ lineHeight: "1.2" }}>
            Settings
          </h1>
        </div>

        <div className="mt-8 space-y-6">
          {/* Account */}
          <section className="animate-fade-up-blur" style={{ animationDelay: "40ms" }}>
            <h2 className="text-[11px] font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">Account</h2>
            <div className="rounded-2xl bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden">
              {user ? (
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.email}</p>
                      <p className="text-[12px] text-muted-foreground">Syncing to cloud</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate({ to: "/login" })}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors active:scale-[0.99]"
                >
                  <LogIn className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Sign in</p>
                    <p className="text-[12px] text-muted-foreground">Sync your habits across devices</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                </button>
              )}
            </div>
          </section>

          {/* Appearance */}
          <section className="animate-fade-up-blur" style={{ animationDelay: "60ms" }}>
            <h2 className="text-[11px] font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">Appearance</h2>
            <div className="rounded-2xl bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] p-1.5 flex gap-1">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                    theme === value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${theme === value ? "rotate-0" : ""}`} />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          {isNotificationSupported() && (
            <section className="animate-fade-up-blur" style={{ animationDelay: "90ms" }}>
              <h2 className="text-[11px] font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">Notifications</h2>
              <div className="rounded-2xl bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden">
                <button
                  onClick={handleNotificationToggle}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors active:scale-[0.99]"
                >
                  {notifPermission === "granted" ? (
                    <Bell className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <BellOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {notifPermission === "granted" ? "Notifications enabled" : "Enable notifications"}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {notifPermission === "granted"
                        ? "Reminders will fire at scheduled times"
                        : notifPermission === "denied"
                          ? "Blocked — update in browser settings"
                          : "Get reminded to complete your habits"
                      }
                    </p>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${notifPermission === "granted" ? "bg-primary" : "bg-muted"} flex items-center px-0.5`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifPermission === "granted" ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* Data */}
          <section className="animate-fade-up-blur" style={{ animationDelay: "120ms" }}>
            <h2 className="text-[11px] font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">Data</h2>
            <div className="rounded-2xl bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] divide-y divide-border/50 overflow-hidden">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors active:scale-[0.99]"
              >
                <Download className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Export data</p>
                  <p className="text-[12px] text-muted-foreground">Download your habits as JSON</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors active:scale-[0.99]"
              >
                <Upload className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Import data</p>
                  <p className="text-[12px] text-muted-foreground">Restore from a JSON backup</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />

              <button
                onClick={handleClear}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-destructive/5 transition-colors active:scale-[0.99]"
              >
                <Trash2 className="w-4 h-4 text-destructive flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-destructive">
                    {confirmClear ? "Tap again to confirm" : "Clear all data"}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {confirmClear ? "This cannot be undone" : "Remove all habits and logs"}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* About */}
          <section className="animate-fade-up-blur" style={{ animationDelay: "180ms" }}>
            <h2 className="text-[11px] font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">About</h2>
            <div className="rounded-2xl bg-card shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Continuum</p>
                  <p className="text-[12px] text-muted-foreground">Version 1.0.0 · Built with care</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomNav onAddClick={() => setSheetOpen(true)} />
      <AddHabitSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
