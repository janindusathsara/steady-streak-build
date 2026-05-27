import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Wrench, Bell, LogOut, CheckCircle2, Clock, PlayCircle, XCircle, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadProviderBookings, updateBookingStatus, loadUnreadNotifications, markNotificationsRead, type Booking } from "@/lib/booking";

const STATUS_TABS: { v: Booking["status"] | "all"; label: string }[] = [
  { v: "all", label: "All Jobs" },
  { v: "pending", label: "Pending" },
  { v: "accepted", label: "Accepted" },
  { v: "in_progress", label: "In Progress" },
  { v: "completed", label: "Completed" },
];

export function ProviderJobsPage() {
  const { profile } = useCurrentUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tab, setTab] = useState<Booking["status"] | "all">("all");
  const [loading, setLoading] = useState(true);

  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Provider";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "P";

  const refresh = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const [bs, ns] = await Promise.all([
      loadProviderBookings(profile.id),
      loadUnreadNotifications(profile.id),
    ]);
    setBookings(bs);
    setUnreadCount(ns.length);
    setLoading(false);
  };

  useEffect(() => { void refresh(); }, [profile?.id]);

  // Poll every 15s for new bookings
  useEffect(() => {
    const t = setInterval(() => { void refresh(); }, 15000);
    return () => clearInterval(t);
  }, [profile?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const handleStatusChange = async (b: Booking, newStatus: Booking["status"]) => {
    try {
      await updateBookingStatus(b.id, newStatus);
      toast.success(`Job ${newStatus.replace("_", " ")}`);
      void refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to update job");
    }
  };

  const handleBellClick = async () => {
    if (!profile?.id) return;
    await markNotificationsRead(profile.id);
    setUnreadCount(0);
  };

  const filtered = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);
  const counts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    in_progress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/$username/dashboard" params={{ username }} className="hover:text-foreground">Dashboard</Link>
            <Link to="/$username/jobs" params={{ username }} className="font-medium text-foreground">Jobs</Link>
            <a href="#" className="hover:text-foreground">Earnings</a>
            <a href="#" className="hover:text-foreground">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={handleBellClick} className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>
              )}
            </button>
            <button onClick={handleLogout} className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-muted">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
            <Link to="/$username/profile" params={{ username }} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground hover:opacity-90">
              {initials}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage incoming booking requests and active jobs</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Pending" value={counts.pending} icon={<Clock className="h-4 w-4 text-amber-600" />} tone="amber" />
          <Stat label="Accepted" value={counts.accepted} icon={<CheckCircle2 className="h-4 w-4 text-blue-600" />} tone="blue" />
          <Stat label="In Progress" value={counts.in_progress} icon={<PlayCircle className="h-4 w-4 text-primary" />} tone="primary" />
          <Stat label="Completed" value={counts.completed} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} tone="emerald" />
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-2 border-b border-border">
          {STATUS_TABS.map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                tab === t.v ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading jobs…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No {tab === "all" ? "" : tab.replace("_", " ")} jobs yet.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => <JobCard key={b.id} booking={b} onAction={handleStatusChange} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: string }) {
  const toneCls: Record<string, string> = {
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    primary: "bg-primary/10",
    emerald: "bg-emerald-50",
  };
  return (
    <div className={`rounded-xl border border-border p-4 ${toneCls[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function JobCard({ booking, onAction }: { booking: Booking; onAction: (b: Booking, s: Booking["status"]) => void }) {
  const statusStyles: Record<Booking["status"], string> = {
    pending: "bg-amber-50 text-amber-700",
    accepted: "bg-blue-50 text-blue-700",
    in_progress: "bg-primary/15 text-primary",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-bold">{booking.service_name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyles[booking.status]}`}>
              {booking.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Ref · #{booking.ref_code} · {new Date(booking.created_at).toLocaleString()}</p>
        </div>
        <p className="text-base font-bold">Rs. {booking.total_amount.toLocaleString()}</p>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString() : "ASAP"} · {booking.scheduled_time ?? "—"}</p>
        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {booking.address_line}, {booking.district}</p>
      </div>
      {booking.problem_desc && <p className="mt-3 rounded-lg bg-muted/40 p-3 text-xs">{booking.problem_desc}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {booking.status === "pending" && (
          <>
            <button onClick={() => onAction(booking, "accepted")} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90">Accept</button>
            <button onClick={() => onAction(booking, "cancelled")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-destructive hover:bg-muted"><XCircle className="inline h-3 w-3 mr-1" />Decline</button>
          </>
        )}
        {booking.status === "accepted" && (
          <button onClick={() => onAction(booking, "in_progress")} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90"><PlayCircle className="inline h-3 w-3 mr-1" />Start Job</button>
        )}
        {booking.status === "in_progress" && (
          <button onClick={() => onAction(booking, "completed")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"><CheckCircle2 className="inline h-3 w-3 mr-1" />Mark Complete</button>
        )}
        <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted"><Phone className="inline h-3 w-3 mr-1" />Contact</button>
      </div>
    </div>
  );
}
