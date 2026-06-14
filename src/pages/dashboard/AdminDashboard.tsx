import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Home, Users, FileText, DollarSign, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminService,
  type ProviderRegistration,
  type CategoryRequest,
  type ActivityItem,
  type DashboardMetric,
  type DashboardOverview,
} from "@/services/admin";

export function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [providerRegs, setProviderRegs] = useState<ProviderRegistration[]>([]);
  const [categoryReqs, setCategoryReqs] = useState<CategoryRequest[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ov, pr, cr, ac, mt] = await Promise.all([
        adminService.overview().catch(() => null),
        adminService.providerRegistrations().catch(() => []),
        adminService.categoryRequests().catch(() => []),
        adminService.activity().catch(() => []),
        adminService.metrics().catch(() => []),
      ]);
      setOverview(ov);
      setProviderRegs(pr ?? []);
      setCategoryReqs(cr ?? []);
      setActivity(ac ?? []);
      setMetrics(mt ?? []);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleApproveProvider = async (id: string) => {
    try {
      await adminService.approveProvider(id);
      toast.success("Provider approved");
      setProviderRegs((s) => s.filter((p) => p.id !== id));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to approve");
    }
  };
  const handleRejectProvider = async (id: string) => {
    try {
      await adminService.rejectProvider(id);
      toast.success("Provider rejected");
      setProviderRegs((s) => s.filter((p) => p.id !== id));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to reject");
    }
  };
  const handleApproveCategory = async (id: string) => {
    try {
      await adminService.approveCategory(id);
      toast.success("Category approved");
      setCategoryReqs((s) => s.filter((c) => c.id !== id));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to approve");
    }
  };
  const handleRejectCategory = async (id: string) => {
    try {
      await adminService.rejectCategory(id);
      toast.success("Category rejected");
      setCategoryReqs((s) => s.filter((c) => c.id !== id));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to reject");
    }
  };

  return (
    <AdminLayout active="dashboard">
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-background/60">
            Platform overview · FixItNow Control Centre · {today}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-background/60">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Home}
                tint="oklch(0.6 0.14 250)"
                label="HOMEOWNERS"
                value={overview?.homeowners.total?.toLocaleString() ?? "—"}
                sub={overview ? `↑ ${overview.homeowners.delta_week} this week` : "—"}
              />
              <StatCard
                icon={Users}
                tint="oklch(0.65 0.14 145)"
                label="ACTIVE PROVIDERS"
                value={overview?.providers.total?.toLocaleString() ?? "—"}
                sub={overview ? `↑ ${overview.providers.delta_week} this week` : "—"}
              />
              <StatCard
                icon={FileText}
                tint="oklch(0.6 0.16 30)"
                label="PENDING REQUESTS"
                value={overview?.pending.total?.toString() ?? "—"}
                sub={
                  overview
                    ? `🏆 ${overview.pending.provider} provider · ${overview.pending.category} cat`
                    : "—"
                }
              />
              <StatCard
                icon={DollarSign}
                tint="var(--primary)"
                label="REVENUE TODAY"
                value={overview?.revenue_today.value ?? "—"}
                sub={
                  overview
                    ? `↑ ${overview.revenue_today.delta_pct}% vs yesterday`
                    : "—"
                }
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="🔔 PROVIDER REGISTRATIONS" action="View All →">
                {providerRegs.length === 0 ? (
                  <EmptyRow text="No pending registrations" />
                ) : (
                  <div className="space-y-2">
                    {providerRegs.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-xs font-bold">
                          {p.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-[11px] text-background/55">
                            {p.category} · {p.location} · {p.submitted_at}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                          Pending
                        </span>
                        <button
                          onClick={() => handleApproveProvider(p.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-success/30 text-success hover:bg-success/40"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRejectProvider(p.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/30 text-destructive hover:bg-destructive/40"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="📁 CATEGORY REQUESTS" action="View All →">
                {categoryReqs.length === 0 ? (
                  <EmptyRow text="No category requests" />
                ) : (
                  <div className="space-y-2">
                    {categoryReqs.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-base"
                          style={{
                            background: c.tint
                              ? `color-mix(in oklab, ${c.tint} 25%, transparent)`
                              : "rgba(255,255,255,0.1)",
                            color: c.tint ?? "currentColor",
                          }}
                        >
                          {c.icon ?? "📂"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{c.name}</p>
                          <p className="text-[11px] text-background/55">
                            {c.requested_by} · {c.submitted_at} · {c.waiting_count} waiting
                          </p>
                        </div>
                        <button
                          onClick={() => handleApproveCategory(c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-success/30 text-success hover:bg-success/40"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRejectCategory(c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/30 text-destructive hover:bg-destructive/40"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="RECENT ACTIVITY">
                {activity.length === 0 ? (
                  <EmptyRow text="No recent activity" />
                ) : (
                  <div className="space-y-3">
                    {activity.map((a) => (
                      <div key={a.id} className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            a.type === "success"
                              ? "bg-success"
                              : a.type === "primary"
                              ? "bg-primary"
                              : a.type === "destructive"
                              ? "bg-destructive"
                              : "bg-sky-400"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm">{a.message}</p>
                          <p className="text-[11px] text-background/50">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="PLATFORM METRICS">
                {metrics.length === 0 ? (
                  <EmptyRow text="No metrics available" />
                ) : (
                  <div className="space-y-4">
                    {metrics.map((m) => (
                      <div key={m.label}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-background/70">{m.label}</span>
                          <span
                            className={`font-bold ${
                              m.tone === "success" ? "text-success" : "text-primary"
                            }`}
                          >
                            {m.value}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-background/10">
                          <div
                            className={`h-full rounded-full ${
                              m.tone === "success" ? "bg-success" : "bg-primary"
                            }`}
                            style={{ width: `${m.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({
  icon: Icon,
  tint,
  label,
  value,
  sub,
}: {
  icon: typeof Home;
  tint: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `color-mix(in oklab, ${tint} 22%, transparent)` }}
        >
          <Icon className="h-5 w-5" style={{ color: tint }} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/55">
            {label}
          </p>
          <p className="mt-0.5 text-2xl font-bold leading-tight">{value}</p>
          <p className="text-[11px] text-background/55">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-background/60">
          {title}
        </p>
        {action && (
          <button className="rounded-full border border-background/15 px-3 py-1 text-[11px] font-semibold text-background/70 hover:bg-background/5">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-background/10 p-6 text-center text-xs text-background/50">
      {text}
    </div>
  );
}
