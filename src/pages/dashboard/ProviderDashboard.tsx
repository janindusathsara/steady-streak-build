import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Wrench, Calendar, DollarSign, Star, TrendingUp, Bell, Droplets } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { loadProviderBookings, loadUnreadNotifications, type Booking } from "@/lib/booking";
import { providerStatsService, type ProviderStats } from "@/services/provider-stats";

export function ProviderDashboard() {
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Provider";
  const firstName = displayName.split(" ")[0];

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unread, setUnread] = useState(0);
  const [providerStats, setProviderStats] = useState<ProviderStats | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    void (async () => {
      const [bs, ns, ps] = await Promise.all([
        loadProviderBookings(profile.id),
        loadUnreadNotifications(profile.id),
        providerStatsService.me().catch(() => null),
      ]);
      setBookings(bs);
      setUnread(ns.length);
      setProviderStats(ps);
    })();
  }, [profile?.id]);

  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings
    .filter((b) => b.status === "accepted" || b.status === "in_progress" || b.status === "pending")
    .slice(0, 4);

  const activeJobsValue = providerStats?.active_jobs.value ?? bookings.filter((b) => b.status === "in_progress" || b.status === "accepted").length;
  const stats = [
    { label: "Active Jobs", value: activeJobsValue, icon: Wrench, hint: providerStats?.active_jobs.hint ?? "+1 since yesterday" },
    { label: "This Week", value: providerStats?.weekly_earnings.value ?? "Rs. —", icon: DollarSign, hint: providerStats?.weekly_earnings.hint ?? "" },
    { label: "Avg Rating", value: providerStats?.avg_rating.value ?? "—", icon: Star, hint: providerStats?.avg_rating.hint ?? "" },
    { label: "Completion Rate", value: providerStats?.completion_rate.value ?? "—", icon: TrendingUp, hint: providerStats?.completion_rate.hint ?? "" },
  ];

  return (
    <ProviderLayout active="dashboard" newRequestsCount={pending.length || unread} reviewsCount={128}>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your services today.</p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </div>
          );
        })}
      </div>

      {/* New requests banner */}
      {(pending.length > 0 || true) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                {pending.length || 2} New Job Request{pending.length === 1 ? "" : "s"} Waiting!
              </p>
              <p className="text-xs text-amber-800/80">
                {pending.length > 0
                  ? `${pending[0].service_name} request${pending.length > 1 ? "s are" : " is"} pending your response.`
                  : "Faucet Repair from Maria Santos and Water Heater Service from Priya Mendis are pending your response."}
              </p>
            </div>
          </div>
          <Link
            to="/$username/new-jobs"
            params={{ username }}
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90"
          >
            View Requests →
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Upcoming jobs */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-bold">Upcoming Jobs</h2>
            <Link to="/$username/jobs-bookings" params={{ username }} className="text-xs font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(upcoming.length > 0 ? upcoming : SAMPLE_JOBS).map((j: any) => (
              <div key={j.id} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Droplets className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{j.service_name ?? j.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {j.customer ?? "Customer"} · {j.scheduled_date ?? j.time} · {j.district ?? j.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">Rs. {(j.total_amount ?? j.price).toLocaleString()}</p>
                  <span className="text-[10px] font-bold uppercase text-emerald-600">{j.status ?? "Confirmed"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold">Availability</h3>
            <p className="mt-1 text-xs text-muted-foreground">You appear as available to homeowners.</p>
            <button className="mt-4 w-full rounded-xl bg-foreground py-2.5 text-sm font-bold text-background hover:opacity-90">
              Go Offline
            </button>
            <button className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              ✏️ Update Profile
            </button>
            <button className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              🪪 My Service Cards
            </button>
            <button className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              💰 Wallet & Earnings
            </button>
          </div>
          <div className="rounded-2xl bg-foreground p-5 text-background">
            <h3 className="font-bold">Boost Profile</h3>
            <p className="mt-1 text-xs opacity-80">Promoted pros get 3× more bookings on average.</p>
            <button className="mt-4 w-full rounded-xl bg-background py-2.5 text-sm font-bold text-foreground hover:opacity-90">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Monthly earnings chart */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-bold">Monthly Earnings Overview</h3>
        {(() => {
          const monthly = providerStats?.monthly?.length ? providerStats.monthly : MONTHS.map((m) => ({ month: m, amount: 0 }));
          const maxAmount = Math.max(1, ...monthly.map((x) => x.amount));
          const lastIdx = monthly.length - 1;
          return (
            <>
              <div className="mt-6 grid items-end gap-2" style={{ gridTemplateColumns: `repeat(${monthly.length}, minmax(0, 1fr))` }}>
                {monthly.map((m, i) => (
                  <div key={m.month} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t ${i === lastIdx ? "bg-foreground" : "bg-primary/40"}`}
                      style={{ height: `${providerStats ? Math.max(4, (m.amount / maxAmount) * 120) : 20 + Math.sin(i) * 20 + i * 4}px` }}
                    />
                    <p className={`text-[10px] ${i === lastIdx ? "font-bold text-foreground" : "text-muted-foreground"}`}>{m.month}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{providerStats?.monthly_peak ?? "—"}</span>
                <span className="font-bold text-emerald-600">{providerStats?.monthly_ytd ?? "—"}</span>
              </div>
            </>
          );
        })()}
      </div>
    </ProviderLayout>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SAMPLE_JOBS = [
  { id: "s1", service: "Emergency Plumbing", customer: "Alex Johnson", time: "Today · 2:30 PM", location: "Colombo 7", price: 4200, status: "Confirmed" },
  { id: "s2", service: "Pipe Replacement", customer: "T. Kumar", time: "Oct 26 · 4:00 PM", location: "Kandy", price: 8500, status: "Confirmed" },
  { id: "s3", service: "Faucet Repair", customer: "Maria Santos", time: "Tomorrow · 10:00 AM", location: "Gampaha", price: 2800, status: "Pending" },
  { id: "s4", service: "Water Heater Service", customer: "Priya Mendis", time: "Oct 27 · 9:00 AM", location: "Nugegoda", price: 3500, status: "Pending" },
];
