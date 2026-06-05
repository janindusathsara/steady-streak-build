import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Wrench, Bell, LogOut, LayoutDashboard, ShieldCheck, Activity,
  Wallet as WalletIcon, Clock, CalendarDays, Settings, LifeBuoy,
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
    <div className="min-h-screen bg-muted/40 text-foreground flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/services" className="hover:text-foreground transition-colors">Find Services</Link>
            {username && (
              <Link to="/$username/book" params={{ username }} className="hover:text-foreground transition-colors">Book Now</Link>
            )}
            {username && (
              <Link to="/$username/wallet" params={{ username }} className="hover:text-foreground transition-colors">My Wallet</Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {username && (
              <Link
                to="/$username/notification"
                params={{ username }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Link>
            )}
            <div className="hidden text-right text-xs sm:block">
              <p className="font-semibold">{displayName}</p>
              <p className="text-muted-foreground capitalize">{profile?.role ?? "Member"}</p>
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

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
        <aside className="hidden lg:flex flex-col justify-between sticky top-20 self-start h-[calc(100vh-5rem)] overflow-y-auto pb-4">
          <nav className="space-y-1 text-sm">
            <SideLink icon={LayoutDashboard} label="Dashboard" to="/$username/dashboard" username={username} active={active === "dashboard"} />
            <SideLink icon={ShieldCheck} label="Security Check" to="/$username/security" username={username} active={active === "security"} />
            <SideStub icon={Activity} label="System Health" />
            <SideLink icon={WalletIcon} label="Wallet" to="/$username/wallet" username={username} active={active === "wallet"} />
            <SideLink icon={Clock} label="Active Bookings" to="/$username/active-bookings" username={username} active={active === "active"} />
            <SideLink icon={CalendarDays} label="Past Bookings" to="/$username/past-bookings" username={username} active={active === "bookings"} />
            <SideStub icon={Settings} label="Preferences" />
            <div className="my-3 border-t border-border" />
            <SideStub icon={LifeBuoy} label="Support" />
          </nav>
          <button onClick={handleLogout} className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function SideLink({ icon: Icon, label, to, username, active }: {
  icon: any; label: string;
  to: "/$username/dashboard" | "/$username/security" | "/$username/wallet" | "/$username/past-bookings" | "/$username/active-bookings";
  username: string; active: boolean;
}) {
  const cls = `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
    active ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
  }`;
  return (
    <Link to={to} params={{ username }} className={cls}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function SideStub({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button onClick={() => toast("Coming soon")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-muted-foreground hover:bg-muted">
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
