import { Link, useLocation } from "@tanstack/react-router";
import { CalendarDays, LayoutList, Plus, Settings } from "lucide-react";

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: "/app" as const, icon: LayoutList, label: "Today" },
    { to: "/insights" as const, icon: CalendarDays, label: "Insights" },
    { to: "/settings" as const, icon: Settings, label: "Settings" },
  ];

  const activeIndex = navItems.findIndex((item) => item.to === path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto px-4 pb-4">
        <nav className="relative flex items-center rounded-2xl border border-border/60 bg-card/80 backdrop-blur-2xl px-1.5 py-1.5 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]">
          {/* Sliding indicator */}
          {activeIndex >= 0 && (
            <div
              className="absolute h-[calc(100%-12px)] rounded-xl bg-primary/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: `calc((100% - ${12 + 48}px) / 3)`,
                left: `calc(6px + ${activeIndex} * ((100% - ${12 + 48}px) / 3))`,
              }}
            />
          )}

          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-200 active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className={`text-[13px] ${isActive ? "" : "hidden sm:inline"}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={onAddClick}
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-90 animate-subtle-pulse"
            aria-label="Add habit"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </nav>
      </div>
    </div>
  );
}
