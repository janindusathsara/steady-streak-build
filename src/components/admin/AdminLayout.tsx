import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Wrench,
  Bell,
  LogOut,
  LayoutGrid,
  CalendarRange,
  Home,
  Users,
  UserPlus,
  ListChecks,
  Newspaper,
  Star,
  ShieldCheck,
  Activity,
  Wallet,
  LifeBuoy,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AdminNavKey =
  | "dashboard"
  | "monthly"
  | "homeowners"
  | "providers"
  | "provider-requests"
  | "category-requests"
  | "news"
  | "reviews"
  | "security"
  | "system-health"
  | "wallet"
  | "support";

interface Props {
  active: AdminNavKey;
  children: ReactNode;
}

export function AdminLayout({ active, children }: Props) {
  const { profile } = useCurrentUser();
  const navigate = useNavigate();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Admin";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "A";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-foreground text-background">
      {/* Dark header */}
      <header className="sticky top-0 z-40 border-b border-background/10 bg-foreground/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden gap-8 text-sm font-medium text-background/70 md:flex">
            <Link to="/" className="font-bold text-background">Home</Link>
            <Link to="/services" className="hover:text-background">Services</Link>
            <Link to="/news" className="hover:text-background">News</Link>
            <Link to="/about" className="hover:text-background">About Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-background/10">
              <Bell className="h-5 w-5 text-background/70" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="hidden text-right text-xs sm:block">
              <p className="font-bold text-background">{displayName}</p>
              <span className="inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Admin
              </span>
            </div>
            {username ? (
              <Link
                to="/$username/profile"
                params={{ username }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground hover:opacity-90"
              >
                {initials}
              </Link>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials}</div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-6 py-6">
        {/* Sticky sidebar */}
        <aside className="sticky top-[73px] hidden h-[calc(100vh-89px)] w-56 shrink-0 flex-col md:flex">
          <nav className="flex-1 space-y-5 overflow-y-auto pb-4 pr-1">
            <NavGroup label="Overview">
              <NavItem to="dashboard" active={active} username={username} icon={LayoutGrid} label="Dashboard" />
              <NavItem to="monthly" active={active} username={username} icon={CalendarRange} label="Monthly Overview" />
            </NavGroup>

            <NavGroup label="Users">
              <NavItem to="homeowners" active={active} username={username} icon={Home} label="Homeowners" badge="1.2K" badgeTone="muted" />
              <NavItem to="providers" active={active} username={username} icon={Users} label="Service Providers" badge="142" badgeTone="muted" />
            </NavGroup>

            <NavGroup label="Requests">
              <NavItem to="provider-requests" active={active} username={username} icon={UserPlus} label="Provider Requests" badge="5" badgeTone="primary" />
              <NavItem to="category-requests" active={active} username={username} icon={ListChecks} label="Category Requests" badge="3" badgeTone="primary" />
            </NavGroup>

            <NavGroup label="Content">
              <NavItem to="news" active={active} username={username} icon={Newspaper} label="News & Updates" badge="8" badgeTone="primary" />
              <NavItem to="reviews" active={active} username={username} icon={Star} label="Reviews" badge="4" badgeTone="primary" />
            </NavGroup>

            <NavGroup label="System">
              <NavItem to="security" active={active} username={username} icon={ShieldCheck} label="Security Check" />
              <NavItem to="system-health" active={active} username={username} icon={Activity} label="System Health" />
              <NavItem to="wallet" active={active} username={username} icon={Wallet} label="Wallet" />
            </NavGroup>

            <div className="pt-1">
              <button
                onClick={() => toast("Coming soon")}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-background/60 hover:bg-background/5 hover:text-background"
              >
                <LifeBuoy className="h-4 w-4" /> Support
              </button>
            </div>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-background/40">
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

const pathMap: Record<AdminNavKey, string> = {
  dashboard: "/$username/dashboard",
  monthly: "/$username/overview",
  homeowners: "/$username/homeowners",
  providers: "/$username/providers",
  "provider-requests": "/$username/provider-request",
  "category-requests": "/$username/category-request",
  news: "/$username/update-news",
  reviews: "/$username/reviews",
  security: "/$username/security",
  "system-health": "/$username/system-health",
  wallet: "/$username/wallet",
  support: "/$username/dashboard",
};


function NavItem({
  to,
  active,
  username,
  icon: Icon,
  label,
  badge,
  badgeTone = "muted",
}: {
  to: AdminNavKey;
  active: AdminNavKey;
  username: string;
  icon: typeof LayoutGrid;
  label: string;
  badge?: string | number;
  badgeTone?: "primary" | "muted";
}) {
  const isActive = to === active;
  return (
    <Link
      to={pathMap[to]}
      params={{ username }}
      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-background/70 hover:bg-background/5 hover:text-background"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {badge !== undefined && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            badgeTone === "primary"
              ? "bg-primary/30 text-primary"
              : "bg-background/10 text-background/70"
          } ${isActive ? "!bg-primary-foreground/20 !text-primary-foreground" : ""}`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
