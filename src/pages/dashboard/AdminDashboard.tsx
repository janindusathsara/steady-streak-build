import { AdminLayout } from "@/components/admin/AdminLayout";
import { Home, Users, FileText, DollarSign, Check, X, Leaf, ShieldCheck, Bug } from "lucide-react";

const providerRegs = [
  { initials: "KP", name: "Kamal Perera", meta: "Plumbing · Colombo · 2h ago" },
  { initials: "SR", name: "Saman Ranasinghe", meta: "Electrical · Kandy · 5h ago" },
  { initials: "NF", name: "Nisha Fernando", meta: "HVAC · Gampaha · 1d ago" },
];

const categoryReqs = [
  { icon: Leaf, tint: "oklch(0.65 0.14 145)", name: "Garden & Landscaping", meta: "Ruwan Silva · 3h ago · 12 waiting" },
  { icon: ShieldCheck, tint: "oklch(0.6 0.14 250)", name: "Smart Home & Security", meta: "Dinesh Jayawardena · 1d ago · 8 waiting" },
  { icon: Bug, tint: "oklch(0.6 0.16 30)", name: "Pest Control", meta: "Amara Dissanayake · 2d ago · 6 waiting" },
];

const activity = [
  { dot: "success", text: <>✅ Provider <b>Marcus Sterling</b> approved · Plumbing</>, time: "8 min ago" },
  { dot: "primary", text: <>⚡ New provider — <b>Kamal Perera</b> awaiting review</>, time: "2 hr ago" },
  { dot: "info", text: <>📂 Category request — <b>Garden & Landscaping</b></>, time: "3 hr ago" },
  { dot: "destructive", text: <>❌ Provider <b>Thilanka Bandara</b> rejected — incomplete docs</>, time: "6 hr ago" },
  { dot: "success", text: <>✅ Category <b>Pool Cleaning</b> approved & went live</>, time: "Yesterday" },
  { dot: "info", text: <>🏠 New homeowner — <b>Priya Mendis</b> registered</>, time: "Yesterday" },
];

const metrics = [
  { label: "Core CPU Load", value: "32%", pct: 32, tone: "success" },
  { label: "API Latency", value: "14ms", pct: 18, tone: "success" },
  { label: "DB Utilization", value: "68%", pct: 68, tone: "primary" },
  { label: "Storage Used", value: "72%", pct: 72, tone: "primary" },
  { label: "Active Repairs", value: "89%", pct: 89, tone: "primary" },
];

export function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AdminLayout active="dashboard">
      <div className="space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-background/60">Platform overview · FixItNow Control Centre · {today}</p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Home} tint="oklch(0.6 0.14 250)" label="HOMEOWNERS" value="1,284" sub="↑ 24 this week" />
          <StatCard icon={Users} tint="oklch(0.65 0.14 145)" label="ACTIVE PROVIDERS" value="142" sub="↑ 6 this week" />
          <StatCard icon={FileText} tint="oklch(0.6 0.16 30)" label="PENDING REQUESTS" value="8" sub="🏆 5 provider · 3 cat" />
          <StatCard icon={DollarSign} tint="var(--primary)" label="REVENUE TODAY" value="Rs. 84K" sub="↑ 8% vs yesterday" />
        </div>

        {/* Two columns: Provider Regs + Category Requests */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="🔔 PROVIDER REGISTRATIONS" action="View All →">
            <div className="space-y-2">
              {providerRegs.map((p) => (
                <div key={p.initials} className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-xs font-bold">{p.initials}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-[11px] text-background/55">{p.meta}</p>
                  </div>
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">Pending</span>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-success/30 text-success hover:bg-success/40"><Check className="h-3.5 w-3.5" /></button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/30 text-destructive hover:bg-destructive/40"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="📁 CATEGORY REQUESTS" action="View All →">
            <div className="space-y-2">
              {categoryReqs.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.name} className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${c.tint} 25%, transparent)` }}>
                      <Icon className="h-5 w-5" style={{ color: c.tint }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-[11px] text-background/55">{c.meta}</p>
                    </div>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md bg-success/30 text-success hover:bg-success/40"><Check className="h-3.5 w-3.5" /></button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/30 text-destructive hover:bg-destructive/40"><X className="h-3.5 w-3.5" /></button>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Recent Activity + Platform Metrics */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="RECENT ACTIVITY">
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    a.dot === "success" ? "bg-success" :
                    a.dot === "primary" ? "bg-primary" :
                    a.dot === "destructive" ? "bg-destructive" : "bg-sky-400"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-[11px] text-background/50">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="PLATFORM METRICS">
            <div className="space-y-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-background/70">{m.label}</span>
                    <span className={`font-bold ${m.tone === "success" ? "text-success" : "text-primary"}`}>{m.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-background/10">
                    <div
                      className={`h-full rounded-full ${m.tone === "success" ? "bg-success" : "bg-primary"}`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, tint, label, value, sub }: { icon: typeof Home; tint: string; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklab, ${tint} 22%, transparent)` }}>
          <Icon className="h-5 w-5" style={{ color: tint }} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/55">{label}</p>
          <p className="mt-0.5 text-2xl font-bold leading-tight">{value}</p>
          <p className="text-[11px] text-background/55">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-background/60">{title}</p>
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
