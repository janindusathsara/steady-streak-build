import { Cpu, MemoryStick, Database, Network, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const SERVICES = [
  { name: "API Gateway", status: "Operational", uptime: "99.99%", latency: "42 ms" },
  { name: "Auth Service", status: "Operational", uptime: "99.98%", latency: "61 ms" },
  { name: "Booking Service", status: "Operational", uptime: "99.95%", latency: "88 ms" },
  { name: "Payments Service", status: "Degraded", uptime: "99.62%", latency: "210 ms" },
  { name: "Notifications", status: "Operational", uptime: "99.97%", latency: "55 ms" },
  { name: "Search Index", status: "Operational", uptime: "99.93%", latency: "120 ms" },
];

const INCIDENTS = [
  { t: "Payments latency above threshold", when: "12 min ago", sev: "warn" },
  { t: "Scheduled DB maintenance completed", when: "Yesterday", sev: "info" },
  { t: "CDN cache purge", when: "2 days ago", sev: "info" },
];

export function AdminSystemHealthPage() {
  return (
    <AdminLayout active="system-health">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="mt-1 text-sm text-background/60">Live status of all FixItNow infrastructure components</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">● All Systems Operational</span>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Cpu} label="CPU Load" value="32%" sub="8 cores · avg" tone="text-emerald-400" />
        <Metric icon={MemoryStick} label="Memory" value="6.4 / 16 GB" sub="40% used" tone="text-sky-400" />
        <Metric icon={Database} label="DB Connections" value="48 / 200" sub="24% saturation" tone="text-emerald-400" />
        <Metric icon={Network} label="Throughput" value="1,240 rpm" sub="last 5 min" tone="text-amber-400" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
          <h2 className="text-lg font-bold">Services</h2>
          <ul className="mt-4 divide-y divide-background/10">
            {SERVICES.map((s) => (
              <li key={s.name} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-3 py-3 text-sm">
                <div className="flex items-center gap-2.5">
                  {s.status === "Operational" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                  <span className="font-semibold">{s.name}</span>
                </div>
                <span className={`text-xs font-bold ${s.status === "Operational" ? "text-emerald-300" : "text-amber-300"}`}>{s.status}</span>
                <span className="text-xs text-background/70">Uptime {s.uptime}</span>
                <span className="text-right text-xs text-background/70">{s.latency}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Recent Events</h2>
            <ul className="mt-3 space-y-3">
              {INCIDENTS.map((i) => (
                <li key={i.t} className="flex items-start gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                  <Activity className={`mt-0.5 h-4 w-4 ${i.sev === "warn" ? "text-amber-400" : "text-sky-400"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{i.t}</p>
                    <p className="text-[11px] text-background/50">{i.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Background Jobs</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Email queue", "0 pending"],
                ["Webhook retries", "2 queued"],
                ["Nightly backup", "Last 02:00 ✓"],
                ["Search reindex", "Last 04:15 ✓"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between border-b border-background/10 pb-2 last:border-0">
                  <span className="text-background/70">{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

function Metric({ icon: Icon, label, value, sub, tone }: { icon: typeof Cpu; label: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
      <Icon className={`h-5 w-5 ${tone}`} />
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-[11px] text-background/50">{label} · {sub}</p>
    </div>
  );
}
