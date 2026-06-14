import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Search, Star, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { providersService, type Provider, type ProviderStats } from "@/services/providers";

type Tab = "all" | "top" | "new" | "suspended";

export function AdminProvidersPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams({ from: "/_authenticated/$username/providers/" });

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        providersService.list().catch(() => []),
        providersService.stats().catch(() => null),
      ]);
      setProviders(list ?? []);
      setStats(s);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load providers");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = providers.filter((p) => {
    if (tab === "top" && p.status !== "Top") return false;
    if (tab === "new" && p.status !== "New") return false;
    if (tab === "suspended" && p.status !== "Suspended") return false;
    if (q && !`${p.name} ${p.category} ${p.district}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const handleSuspend = async (id: string) => {
    try {
      await providersService.suspend(id);
      toast.success("Provider suspended");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };
  const handleReinstate = async (id: string) => {
    try {
      await providersService.reinstate(id);
      toast.success("Provider reinstated");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <AdminLayout active="providers">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-background">Service Providers</h1>
        <p className="mt-1 text-sm text-background/60">All verified and active service professionals on the platform</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat value={stats?.active?.toString() ?? "—"} label="Active Providers" color="text-emerald-400" />
        <Stat value={stats?.categories?.toString() ?? "—"} label="Categories" color="text-sky-400" />
        <Stat value={stats?.avg_rating?.toFixed(1) ?? "—"} label="Avg. Rating" color="text-background" />
        <Stat value={stats?.suspended?.toString() ?? "—"} label="Suspended" color="text-destructive" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabPill active={tab === "all"} onClick={() => setTab("all")} primary>All ({stats?.active ?? providers.length})</TabPill>
        <TabPill active={tab === "top"} onClick={() => setTab("top")}>Top Rated ({stats?.top_rated ?? 0})</TabPill>
        <TabPill active={tab === "new"} onClick={() => setTab("new")}>New ({stats?.new_count ?? 0})</TabPill>
        <TabPill active={tab === "suspended"} onClick={() => setTab("suspended")}>Suspended ({stats?.suspended ?? 0})</TabPill>
        <div className="relative ml-auto min-w-[280px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search provider, category or district…"
            className="w-full rounded-full border border-background/10 bg-background/5 py-2 pl-10 pr-4 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        {loading ? (
          <div className="flex justify-center py-12 text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-background/50">No providers found</div>
        ) : (
        <table className="w-full text-sm">
          <thead className="bg-background/5">
            <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-background/40">
              <th className="px-5 py-3">Provider</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">District</th>
              <th className="px-3 py-3">Jobs Done</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background/10">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-background/5">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary">{p.initials}</div>
                    <div>
                      <p className="font-bold text-background">{p.name}</p>
                      <p className="text-xs text-background/50">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-background/80"><span className="mr-1">{p.icon}</span>{p.category}</td>
                <td className="px-3 py-3 text-background/70">{p.district}</td>
                <td className="px-3 py-3 text-background/80">{p.jobs}</td>
                <td className="px-3 py-3"><span className="inline-flex items-center gap-1 text-background"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}</span></td>
                <td className="px-3 py-3">
                  {p.status === "Suspended" ? (
                    <span className="rounded-full border border-destructive/40 px-2 py-0.5 text-[10px] font-bold text-destructive">Suspended</span>
                  ) : (
                    <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Active</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/$username/providers/$id" params={{ username, id: p.id }} className="rounded-md border border-background/15 px-3 py-1 text-xs font-semibold text-background/80 hover:bg-background/10">View</Link>
                    {p.status === "Suspended" ? (
                      <button onClick={() => handleReinstate(p.id)} className="rounded-md border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-400/10">Reinstate</button>
                    ) : (
                      <button onClick={() => handleSuspend(p.id)} className="rounded-md border border-background/15 px-3 py-1 text-xs font-semibold text-background/80 hover:bg-background/10">Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </AdminLayout>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-background/60">{label}</p>
    </div>
  );
}

function TabPill({ active, primary, onClick, children }: { active: boolean; primary?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
        active && primary ? "bg-primary text-primary-foreground" :
        active ? "bg-background/15 text-background" :
        "border border-background/15 text-background/70 hover:bg-background/10"
      }`}>{children}</button>
  );
}
