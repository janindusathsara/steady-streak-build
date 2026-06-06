import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Wrench, Bell, LogOut, LayoutGrid, ShieldCheck, Activity,
  Wallet as WalletIcon, Clock, CalendarDays, Settings, LifeBuoy, Home,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type HomeownerNavKey =
  | "dashboard" | "security" | "system" | "wallet"
  | "active" | "bookings" | "preferences" | "support";

interface Props {
  active: HomeownerNavKey;
  children: ReactNode;
}

export function HomeownerLayout({ active, children }: Props) {
  const { profile } = useCurrentUser();
  const navigate = useNavigate();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            {username ? (
              <Link to="/$username/dashboard" params={{ username }} className="font-bold text-foreground">Home</Link>
            ) : (
              <Link to="/" className="font-bold text-foreground">Home</Link>
            )}
            <Link to="/services" className="hover:text-foreground">Services</Link>
            <Link to="/news" className="hover:text-foreground">News</Link>
            <Link to="/about" className="hover:text-foreground">About Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            {username && (
              <Link
                to="/$username/notification"
                params={{ username }}
                className="relative rounded-full p-2 hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Link>
            )}
            <div className="hidden text-right text-xs sm:block">
              <p className="font-bold text-foreground">{displayName}</p>
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Homeowner
              </span>
            </div>
            {username && (
              <Link
                to="/$username/profile"
                params={{ username }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background hover:opacity-90"
              >
                {initials}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-5 py-6">
        <aside className="sticky top-[73px] hidden h-[calc(100vh-89px)] w-60 shrink-0 flex-col md:flex">
          <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-4 text-primary-foreground shadow-sm">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <p className="text-sm font-bold">Welcome Home</p>
            </div>
            <p className="mt-1 text-xs font-semibold">{displayName}</p>
            <p className="text-[11px] opacity-80">Your trusted service hub</p>
          </div>

          <nav className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4">
            <NavGroup label="Main">
              <NavLink to="dashboard" active={active} username={username} icon={LayoutGrid} label="Dashboard" />
            </NavGroup>

            <NavGroup label="Bookings">
              <NavLink to="active" active={active} username={username} icon={Clock} label="Active Bookings" />
              <NavLink to="bookings" active={active} username={username} icon={CalendarDays} label="Past Bookings" />
            </NavGroup>

            <NavGroup label="Account">
              <NavLink to="security" active={active} username={username} icon={ShieldCheck} label="Security Check" />
              <NavStub icon={Activity} label="System Health" />
              <NavLink to="wallet" active={active} username={username} icon={WalletIcon} label="Wallet" />
              <NavStub icon={Settings} label="Preferences" />
            </NavGroup>

            <div className="pt-1">
              <NavStub icon={LifeBuoy} label="Support" />
            </div>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavLink({
  to, active, username, icon: Icon, label,
}: {
  to: HomeownerNavKey; active: HomeownerNavKey; username: string;
  icon: typeof LayoutGrid; label: string;
}) {
  const isActive = to === active;
  const pathMap: Record<HomeownerNavKey, "/$username/dashboard" | "/$username/security" | "/$username/wallet" | "/$username/active-bookings" | "/$username/past-bookings"> = {
    dashboard: "/$username/dashboard",
    security: "/$username/security",
    system: "/$username/dashboard",
    wallet: "/$username/wallet",
    active: "/$username/active-bookings",
    bookings: "/$username/past-bookings",
    preferences: "/$username/dashboard",
    support: "/$username/dashboard",
  };
  return (
    <Link
      to={pathMap[to]}
      params={{ username }}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function NavStub({ icon: Icon, label }: { icon: typeof LayoutGrid; label: string }) {
  return (
    <button
      onClick={() => toast("Coming soon")}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
