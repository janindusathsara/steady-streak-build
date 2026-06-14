import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Lock, KeyRound, Activity, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { securityService, type SecurityOverview } from "@/services/security";

export function AdminSecurityPage() {
  const [data, setData] = useState<SecurityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await securityService.overview();
      setData(d);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load security data");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const runScan = async () => {
    setScanning(true);
    try {
      const d = await securityService.runScan();
      setData(d);
      toast.success("Scan complete");
    } catch (err: any) { toast.error(err?.message ?? "Scan failed"); }
    finally { setScanning(false); }
  };

  return (
    <AdminLayout active="security">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Security Check</h1>
          <p className="mt-1 text-sm text-background/60">Platform-wide security posture and recent incidents</p>
        </div>
        <button onClick={runScan} disabled={scanning} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {scanning ? "Scanning…" : "Run Full Scan"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={ShieldCheck} value={data ? `${data.score}%` : "—"} label="Security Score" tone="text-emerald-400" />
            <Stat icon={ShieldAlert} value={data?.warnings?.toString() ?? "—"} label="Open Warnings" tone="text-amber-400" />
            <Stat icon={Lock} value={data?.critical?.toString() ?? "—"} label="Critical Issues" tone="text-emerald-400" />
            <Stat icon={KeyRound} value={data?.active_sessions?.toString() ?? "—"} label="Active Sessions" tone="text-sky-400" />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
              <h2 className="text-lg font-bold">System Checks</h2>
              <p className="text-xs text-background/60">Last scan {data?.last_scan ?? "—"}</p>
              <ul className="mt-4 divide-y divide-background/10">
                {(data?.checks ?? []).map((c) => (
                  <li key={c.name} className="flex items-start gap-3 py-3">
                    {c.status === "pass" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" /> : <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-background/60">{c.desc}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${c.status === "pass" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
                      {c.status === "pass" ? "PASS" : c.status === "warn" ? "WARN" : "FAIL"}
                    </span>
                  </li>
                ))}
                {!data?.checks?.length && <li className="py-3 text-xs text-background/50">No checks available</li>}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
                <h2 className="text-lg font-bold">Recent Incidents</h2>
                <ul className="mt-3 space-y-3">
                  {(data?.incidents ?? []).map((i) => (
                    <li key={i.id} className="flex items-start gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                      <Activity className={`mt-0.5 h-4 w-4 ${i.severity === "high" ? "text-red-400" : i.severity === "med" ? "text-amber-400" : "text-sky-400"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{i.title}</p>
                        <p className="text-[11px] text-background/50">{i.ip} · {i.when}</p>
                      </div>
                    </li>
                  ))}
                  {!data?.incidents?.length && <li className="text-xs text-background/50">No incidents recorded</li>}
                </ul>
              </div>

              <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
                <h2 className="text-lg font-bold">Quick Actions</h2>
                <div className="mt-3 space-y-2">
                  {["Force logout all sessions", "Rotate API keys", "Export audit log", "Lock admin panel"].map((a) => (
                    <button key={a} className="w-full rounded-xl border border-background/10 px-3 py-2 text-left text-sm font-semibold text-background/80 hover:bg-background/10">{a}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

function Stat({ icon: Icon, value, label, tone }: { icon: typeof ShieldCheck; value: string; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
      <Icon className={`h-5 w-5 ${tone}`} />
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}
