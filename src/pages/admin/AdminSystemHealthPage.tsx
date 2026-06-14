import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Database, Network, Activity, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { systemService, type SystemHealth } from "@/services/system";

export function AdminSystemHealthPage() {
  const [data, setData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setData(await systemService.health()); }
      catch (err: any) { toast.error(err?.message ?? "Failed to load system health"); }
      finally { setLoading(false); }
    })();
  }, []);

  const overall = data?.status ?? "Operational";
  const overallTone = overall === "Operational" ? "bg-emerald-500/15 text-emerald-300" : overall === "Degraded" ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300";

  return (
    <AdminLayout active="system-health">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="mt-1 text-sm text-background/60">Live status of all FixItNow infrastructure components</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${overallTone}`}>● All Systems {overall}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={Cpu} label="CPU Load" value={data?.cpu.value ?? "—"} sub={data?.cpu.sub ?? "—"} tone="text-emerald-400" />
            <Metric icon={MemoryStick} label="Memory" value={data?.memory.value ?? "—"} sub={data?.memory.sub ?? "—"} tone="text-sky-400" />
            <Metric icon={Database} label="DB Connections" value={data?.db.value ?? "—"} sub={data?.db.sub ?? "—"} tone="text-emerald-400" />
            <Metric icon={Network} label="Throughput" value={data?.throughput.value ?? "—"} sub={data?.throughput.sub ?? "—"} tone="text-amber-400" />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
              <h2 className="text-lg font-bold">Services</h2>
              <ul className="mt-4 divide-y divide-background/10">
                {(data?.services ?? []).map((s) => (
                  <li key={s.name} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-3 py-3 text-sm">
                    <div className="flex items-center gap-2.5">
                      {s.status === "Operational" ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                      <span className="font-semibold">{s.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${s.status === "Operational" ? "text-emerald-300" : "text-amber-300"}`}>{s.status}</span>
                    <span className="text-xs text-background/70">Uptime {s.uptime}</span>
                    <span className="text-right text-xs text-background/70">{s.latency}</span>
                  </li>
                ))}
                {!data?.services?.length && <li className="py-3 text-xs text-background/50">No service data</li>}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
                <h2 className="text-lg font-bold">Recent Events</h2>
                <ul className="mt-3 space-y-3">
                  {(data?.events ?? []).map((i) => (
                    <li key={i.id} className="flex items-start gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                      <Activity className={`mt-0.5 h-4 w-4 ${i.severity === "warn" ? "text-amber-400" : i.severity === "high" ? "text-red-400" : "text-sky-400"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{i.title}</p>
                        <p className="text-[11px] text-background/50">{i.when}</p>
                      </div>
                    </li>
                  ))}
                  {!data?.events?.length && <li className="text-xs text-background/50">No recent events</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
                <h2 className="text-lg font-bold">Background Jobs</h2>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {(data?.jobs ?? []).map(([k, v]) => (
                    <li key={k} className="flex items-center justify-between border-b border-background/10 pb-2 last:border-0">
                      <span className="text-background/70">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </li>
                  ))}
                  {!data?.jobs?.length && <li className="text-xs text-background/50">No jobs reported</li>}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
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
