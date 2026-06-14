import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { homeownersService, type Homeowner, type HomeownerStats } from "@/services/homeowners";

type Status = "Active" | "New" | "Flagged";

const TABS = [
  { k: "all", label: "All" },
  { k: "active", label: "Active" },
  { k: "new", label: "New" },
  { k: "flag", label: "Flagged" },
] as const;

export function AdminHomeownersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Homeowner[]>([]);
  const [stats, setStats] = useState<HomeownerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams({ from: "/_authenticated/$username/homeowners/" });

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        homeownersService.list().catch(() => []),
        homeownersService.stats().catch(() => null),
      ]);
      setRows(list ?? []);
      setStats(s);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load homeowners");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleSuspend = async (id: string) => {
    try {
      await homeownersService.suspend(id);
      toast.success("Homeowner suspended");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const filtered = rows.filter((r) => {
    if (tab === "active" && r.status !== "Active") return false;
    if (tab === "new" && r.status !== "New") return false;
    if (tab === "flag" && r.status !== "Flagged") return false;
    if (q && !`${r.name} ${r.email} ${r.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout active="homeowners">
      <div>
        <h1 className="text-3xl font-bold">Homeowners</h1>
        <p className="mt-1 text-sm text-background/60">All registered homeowners on the FixItNow platform</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={stats?.total?.toLocaleString() ?? "—"} label="Total Homeowners" tone="text-sky-400" />
        <Stat value={stats?.active?.toLocaleString() ?? "—"} label="Active (last 30 days)" tone="text-emerald-400" />
        <Stat value={stats?.joined_this_week?.toString() ?? "—"} label="Joined This Week" tone="text-amber-400" />
        <Stat value={stats?.flagged?.toString() ?? "—"} label="Flagged / Disputed" tone="text-red-400" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70 hover:bg-background/15"}`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[280px] flex-1 max-w-md">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍  Search by name, email or location…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none" />
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.9fr_0.7fr_0.9fr] gap-2 border-b border-background/10 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-background/50">
          <span>Homeowner</span><span>Location</span><span>Total Bookings</span><span>Spent</span><span>Member Since</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-12 text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-background/50">No homeowners found</div>
        ) : filtered.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.9fr_0.7fr_0.9fr] items-center gap-2 border-b border-background/5 px-5 py-3 text-xs last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-[11px] font-bold">{r.initials}</div>
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-[11px] text-background/50">{r.email}</p>
              </div>
            </div>
            <span className="text-background/80">{r.location}</span>
            <span className="font-semibold">{r.bookings}</span>
            <span className="text-background/80">{r.spent}</span>
            <span className="text-background/60">{r.member_since}</span>
            <span><StatusPill s={r.status} /></span>
            <div className="flex justify-end gap-1.5">
              <Link to="/$username/homeowners/$id" params={{ username, id: r.id }} className="rounded-full border border-background/15 px-3 py-1 text-[10px] font-bold text-background/80 hover:bg-background/10">View</Link>
              <button onClick={() => handleSuspend(r.id)} className={`rounded-full px-3 py-1 text-[10px] font-bold ${r.status === "Flagged" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "border border-background/15 text-background/80 hover:bg-background/10"}`}>Suspend</button>
            </div>
          </div>
        ))}
      </section>
    </AdminLayout>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}

function StatusPill({ s }: { s: Status }) {
  const map = {
    Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    New: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    Flagged: "bg-red-500/15 text-red-300 border-red-500/30",
  } as const;
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${map[s]}`}>{s}</span>;
}
