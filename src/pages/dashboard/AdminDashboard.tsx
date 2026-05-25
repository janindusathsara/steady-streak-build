import { Link } from "@tanstack/react-router";
import { Bell, Activity, Users, DollarSign, AlertTriangle, ShieldCheck, RefreshCw, Wrench } from "lucide-react";

const logs = [
  { time: "14:20:11", tag: "SUCCESS", src: "@BK-01", text: "Backup cycle complete (Cluster A)", tone: "text-success" },
  { time: "14:20:45", tag: "INFO", src: "@AUTH-P", text: "User Alexander_J logged in via Auth-01", tone: "text-primary" },
  { time: "14:21:02", tag: "WARN", src: "@DB-01", text: "Latency spike detected in MySQL-Primary", tone: "text-primary" },
  { time: "14:21:15", tag: "SUCCESS", src: "@GATEWAY", text: "Auto-scaling: Added 2 nodes to API-Fleet", tone: "text-success" },
  { time: "14:22:30", tag: "ERROR", src: "@CERT-M", text: "SSL Certificate expiring in 48h for repair-svc.internal", tone: "text-destructive" },
];

const dbs = [
  { name: "MySQL-Primary-01", kind: "READ/WRITE", load: "42%", status: "ONLINE" },
  { name: "MySQL-Replica-01", kind: "READ ONLY", load: "12%", status: "ONLINE" },
  { name: "Redis-Cache-Main", kind: "MEMORY", load: "8%", status: "ONLINE" },
];

const apis = [
  { name: "API-Gateway-North", kind: "EDGE", load: "58%", status: "ONLINE" },
  { name: "API-Gateway-South", kind: "EDGE", load: "0%", status: "FAULT", bad: true },
  { name: "Worker-Pool-B", kind: "BACKGROUND", load: "33%", status: "ONLINE" },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-foreground text-background">
      <header className="border-b border-background/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={2.5} />
            <span className="text-base font-bold tracking-tight sm:text-lg">FixItNow</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-background/70 md:flex">
            <a href="#" className="hover:text-background">Find Services</a>
            <a href="#" className="hover:text-background">My Wallet</a>
            <a href="#" className="hover:text-background">Go Gold</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-background/10">
              <Bell className="h-5 w-5 text-background/70" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">AJ</div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-tight">Alex Johnson</p>
                <p className="text-[10px] text-background/60 leading-tight">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-5 py-6">
        {/* Sidebar */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <nav className="space-y-1 text-sm">
            {["Dashboard", "Security Check", "System Health", "Wallet", "Preferences"].map((n, i) => (
              <a key={n} href="#" className={`block rounded-lg px-3 py-2 ${i === 0 ? "bg-primary text-primary-foreground font-semibold" : "text-background/70 hover:bg-background/5"}`}>{n}</a>
            ))}
          </nav>
          <div className="mt-8 space-y-1 text-sm text-background/60">
            <a href="#" className="block px-3 py-2 hover:text-background">? Support</a>
            <a href="#" className="block px-3 py-2 hover:text-background">→ Logout</a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-5">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Core CPU Load", value: "32%", icon: Activity, tint: "oklch(0.55 0.10 60)" },
              { label: "API Latency", value: "14%", icon: ShieldCheck, tint: "oklch(0.78 0.14 75)" },
              { label: "DB Utilization", value: "68%", icon: Users, tint: "var(--primary)" },
              { label: "Active Repairs", value: "89%", icon: DollarSign, tint: "oklch(0.55 0.10 60)" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${s.tint} 25%, transparent)` }}>
                      <Icon className="h-5 w-5" style={{ color: s.tint }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-background/60">{s.label}</p>
                      <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* Global map placeholder */}
            <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-background/60">🌐 Live Service Network</p>
                  <p className="mt-1 text-xs text-background/50">Real-time pulse of active service provider coordinates</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 text-[10px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> GLOBAL STREAM
                </span>
              </div>
              <div className="mt-4 grid h-56 place-items-center rounded-xl border border-background/10 bg-background/[0.04]">
                <div className="text-center text-background/50">
                  <div className="mx-auto h-3 w-3 animate-ping rounded-full bg-primary" />
                  <p className="mt-3 text-xs">Streaming 4 active regions</p>
                </div>
              </div>
            </div>

            {/* Storage donut + log */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-background/60">Storage</p>
                <div className="mx-auto mt-3 grid h-28 w-28 place-items-center rounded-full border-[10px] border-primary/30 border-t-primary">
                  <p className="text-xl font-bold">72%</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-background/70">✓ Daily Snapshots</span>
                  <span className="rounded-full bg-success/30 px-2 py-0.5 font-semibold">Synced</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-background/10 bg-background/[0.03] py-4 text-xs font-semibold hover:bg-background/[0.07] transition-colors">
                  <AlertTriangle className="mx-auto mb-1 h-4 w-4 text-destructive" /> SECURITY LOCK
                </button>
                <button className="rounded-xl border border-background/10 bg-background/[0.03] py-4 text-xs font-semibold hover:bg-background/[0.07] transition-colors">
                  <RefreshCw className="mx-auto mb-1 h-4 w-4 text-primary" /> FLUSH CACHE
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <NodeList title="Database Cluster" items={dbs} />
            <NodeList title="API Gateways" items={apis} />
          </div>

          {/* Log */}
          <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-background/60">⚡ System Severity Log V2.0.4</p>
              <span className="rounded-full bg-destructive/30 px-2 py-0.5 text-[10px] font-bold">LIVE</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              {logs.map((l) => (
                <div key={l.time} className="flex gap-3 rounded px-2 py-1 hover:bg-background/[0.04]">
                  <span className="text-background/40">[{l.time}]</span>
                  <span className={`font-bold ${l.tone}`}>[{l.tag}]</span>
                  <span className="text-background/60">{l.src}</span>
                  <span className="text-background/80">{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NodeList({ title, items }: { title: string; items: { name: string; kind: string; load: string; status: string; bad?: boolean }[] }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-background/60">{title}</p>
      <div className="mt-4 space-y-2">
        {items.map((it) => (
          <div key={it.name} className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.03] p-3">
            <div className={`h-8 w-8 rounded-lg ${it.bad ? "bg-destructive/30" : "bg-success/30"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{it.name}</p>
              <p className="text-[10px] text-background/60">{it.kind}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold">{it.load} LOAD</p>
              <p className={`text-[10px] font-bold ${it.bad ? "text-destructive" : "text-success"}`}>{it.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
