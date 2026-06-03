import { ShieldCheck, ShieldAlert, Lock, KeyRound, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const CHECKS = [
  { name: "Two-Factor Authentication", status: "pass", desc: "Enforced for all admin accounts" },
  { name: "Password Policy", status: "pass", desc: "Min 12 chars, complexity rules active" },
  { name: "API Rate Limiting", status: "pass", desc: "60 req/min per IP, burst 120" },
  { name: "SSL / TLS Certificate", status: "pass", desc: "Valid until 12 Mar 2027" },
  { name: "Database Encryption", status: "pass", desc: "AES-256 at rest, TLS in transit" },
  { name: "Outdated Dependencies", status: "warn", desc: "3 packages with non-critical updates" },
  { name: "Failed Login Attempts", status: "warn", desc: "24 attempts in last 24h from 6 IPs" },
  { name: "Backup Integrity", status: "pass", desc: "Last verified backup 2h ago" },
];

const INCIDENTS = [
  { t: "Brute-force attempt blocked", ip: "103.21.244.18", when: "12 min ago", sev: "high" },
  { t: "Suspicious file upload rejected", ip: "112.134.56.9", when: "1h ago", sev: "med" },
  { t: "Token rotation completed", ip: "internal", when: "3h ago", sev: "low" },
  { t: "Unusual admin login (new device)", ip: "175.157.82.4", when: "Yesterday", sev: "med" },
];

export function AdminSecurityPage() {
  return (
    <AdminLayout active="security">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Security Check</h1>
          <p className="mt-1 text-sm text-background/60">Platform-wide security posture and recent incidents</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">Run Full Scan</button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={ShieldCheck} value="92%" label="Security Score" tone="text-emerald-400" />
        <Stat icon={ShieldAlert} value="2" label="Open Warnings" tone="text-amber-400" />
        <Stat icon={Lock} value="0" label="Critical Issues" tone="text-emerald-400" />
        <Stat icon={KeyRound} value="148" label="Active Sessions" tone="text-sky-400" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
          <h2 className="text-lg font-bold">System Checks</h2>
          <p className="text-xs text-background/60">Automated checks ran 12 minutes ago</p>
          <ul className="mt-4 divide-y divide-background/10">
            {CHECKS.map((c) => (
              <li key={c.name} className="flex items-start gap-3 py-3">
                {c.status === "pass" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-background/60">{c.desc}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${c.status === "pass" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
                  {c.status === "pass" ? "PASS" : "WARN"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Recent Incidents</h2>
            <ul className="mt-3 space-y-3">
              {INCIDENTS.map((i) => (
                <li key={i.t} className="flex items-start gap-3 rounded-xl border border-background/10 bg-background/[0.04] p-3">
                  <Activity className={`mt-0.5 h-4 w-4 ${i.sev === "high" ? "text-red-400" : i.sev === "med" ? "text-amber-400" : "text-sky-400"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{i.t}</p>
                    <p className="text-[11px] text-background/50">{i.ip} · {i.when}</p>
                  </div>
                </li>
              ))}
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
