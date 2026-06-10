import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Wrench,
  Bell,
  LogOut,
  LayoutGrid,
  Calendar,
  BellRing,
  IdCard,
  UserCog,
  Wallet,
  Star,
  LifeBuoy,
  Medal,
  Menu,
  X,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type NavKey =
  | "dashboard"
  | "jobs-bookings"
  | "new-jobs"
  | "service-cards"
  | "update-profile"
  | "wallet"
  | "reviews"
  | "support";

interface Props {
  active: NavKey;
  newRequestsCount?: number;
  reviewsCount?: number;
  children: ReactNode;
}

export function ProviderLayout({ active, newRequestsCount = 0, reviewsCount = 0, children }: Props) {
  const { profile } = useCurrentUser();
  const navigate = useNavigate();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Provider";
  const initials =
    displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "P";

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 p-4 text-amber-950 shadow-sm">
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5" />
          <p className="text-sm font-bold">Gold Provider</p>
        </div>
        <p className="mt-1 text-xs font-semibold">★★★★★ 4.9</p>
        <p className="text-[11px] opacity-80">Top 5% of pros</p>
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4">
        <NavGroup label="Main">
          <NavLink to="dashboard" active={active} username={username} icon={LayoutGrid} label="Dashboard" onNavigate={closeMobile} />
        </NavGroup>

        <NavGroup label="Jobs">
          <NavLink to="jobs-bookings" active={active} username={username} icon={Calendar} label="Jobs & Bookings" onNavigate={closeMobile} />
          <NavLink to="new-jobs" active={active} username={username} icon={BellRing} label="New Requests" badge={newRequestsCount > 0 ? newRequestsCount : undefined} badgeTone="primary" onNavigate={closeMobile} />
        </NavGroup>

        <NavGroup label="Profile">
          <NavLink to="service-cards" active={active} username={username} icon={IdCard} label="Service Cards" onNavigate={closeMobile} />
          <NavLink to="update-profile" active={active} username={username} icon={UserCog} label="Update Profile" onNavigate={closeMobile} />
        </NavGroup>

        <NavGroup label="Finances">
          <NavLink to="wallet" active={active} username={username} icon={Wallet} label="Wallet & Earnings" onNavigate={closeMobile} />
        </NavGroup>

        <NavGroup label="Performance">
          <NavLink to="reviews" active={active} username={username} icon={Star} label="Reviews & History" badge={reviewsCount > 0 ? reviewsCount : undefined} badgeTone="success" onNavigate={closeMobile} />
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
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 hover:bg-muted md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
              <span className="text-lg font-bold tracking-tight">FixItNow</span>
            </Link>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/$username/dashboard" params={{ username }} className="font-bold text-foreground">Home</Link>
            <Link to="/services" className="hover:text-foreground">Services</Link>
            <Link to="/news" className="hover:text-foreground">News</Link>
            <Link to="/about" className="hover:text-foreground">About Us</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {username ? (
              <Link to="/$username/notification" params={{ username }} className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Link>
            ) : (
              <button className="relative rounded-full p-2 hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <div className="hidden text-right text-xs sm:block">
              <p className="font-bold text-foreground">{displayName}</p>
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Service Provider
              </span>
            </div>
            <Link to="/$username/profile" params={{ username }} className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background hover:opacity-90">
              {initials}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={closeMobile} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-card p-5 shadow-xl md:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold">Menu</span>
              <button onClick={closeMobile} aria-label="Close menu" className="rounded-md p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="mx-auto flex w-full max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] gap-6 px-4 py-6 sm:px-5">
        <aside className="sticky top-[73px] hidden h-[calc(100vh-89px)] w-60 shrink-0 flex-col md:flex 4xl:w-72">
          {sidebarContent}
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
  to,
  active,
  username,
  icon: Icon,
  label,
  badge,
  badgeTone = "primary",
  onNavigate,
}: {
  to: NavKey;
  active: NavKey;
  username: string;
  icon: typeof LayoutGrid;
  label: string;
  badge?: number;
  badgeTone?: "primary" | "success";
  onNavigate?: () => void;
}) {
  const isActive = to === active;
  const pathMap: Record<NavKey, string> = {
    dashboard: "/$username/dashboard",
    "jobs-bookings": "/$username/jobs-bookings",
    "new-jobs": "/$username/new-jobs",
    "service-cards": "/$username/myservices",
    "update-profile": "/$username/profile",
    wallet: "/$username/wallet",
    reviews: "/$username/reviews",
    support: "/$username/dashboard",
  };
  return (
    <Link
      to={pathMap[to]}
      params={{ username }}
      onClick={onNavigate}
      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {badge !== undefined && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            badgeTone === "primary" ? "bg-primary text-primary-foreground" : "bg-emerald-600 text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavStub({
  icon: Icon,
  label,
  badge,
  badgeTone = "primary",
}: {
  icon: typeof LayoutGrid;
  label: string;
  badge?: number;
  badgeTone?: "primary" | "success";
}) {
  return (
    <button
      onClick={() => toast("Coming soon")}
      className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {badge !== undefined && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            badgeTone === "primary" ? "bg-primary text-primary-foreground" : "bg-emerald-600 text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
