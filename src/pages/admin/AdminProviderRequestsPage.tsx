import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PROVIDER_REQUESTS } from "@/lib/provider-requests-data";
import type { ProviderRequest } from "@/lib/provider-requests-data";
import { providerRequestsService, type ProviderRequestStats } from "@/services/provider-requests";
import { toast } from "sonner";

type Tab = "all" | "pending" | "approved" | "rejected";

export function AdminProviderRequestsPage() {
  const { username } = useParams({ from: "/_authenticated/$username/provider-request/" });
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<ProviderRequest[]>([]);
  const [stats, setStats] = useState<ProviderRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const [list, s] = await Promise.all([
      providerRequestsService.list().catch(() => PROVIDER_REQUESTS),
      providerRequestsService.stats().catch(() => null),
    ]);
    setItems(list.length ? list : PROVIDER_REQUESTS);
    setStats(s);
  };

  useEffect(() => {
    (async () => {
      try { await load(); } finally { setLoading(false); }
    })();
  }, []);

  const counts = {
    all: stats?.total ?? items.length,
    pending: stats?.pending ?? items.filter((r) => r.status === "Pending").length,
    approved: stats?.approved ?? items.filter((r) => r.status === "Approved").length,
    rejected: stats?.rejected ?? items.filter((r) => r.status === "Rejected").length,
  };

  const filtered = items.filter((r) => {
    if (tab === "pending" && r.status !== "Pending") return false;
    if (tab === "approved" && r.status !== "Approved") return false;
    if (tab === "rejected" && r.status !== "Rejected") return false;
    if (q && !`${r.name} ${r.category} ${r.district}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      await providerRequestsService.approve(id);
      toast.success("Provider approved");
      await load();
    } catch {
      toast.error("Approve failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    try {
      await providerRequestsService.reject(id);
      toast("Application rejected");
      await load();
    } catch {
      toast.error("Reject failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout active="provider-requests">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-background">Service Provider Requests</h1>
        <p className="mt-1 text-sm text-background/60">Review, approve or reject new service provider registration applications</p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat value={String(counts.pending)} label="Pending Review" color="text-primary" />
        <Stat value={String(counts.approved)} label="Approved Total" color="text-emerald-400" />
        <Stat value={String(counts.rejected)} label="Rejected Total" color="text-destructive" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabPill active={tab === "all"} primary onClick={() => setTab("all")}>All ({counts.all})</TabPill>
        <TabPill active={tab === "pending"} onClick={() => setTab("pending")}>Pending ({counts.pending})</TabPill>
        <TabPill active={tab === "approved"} onClick={() => setTab("approved")}>Approved ({counts.approved})</TabPill>
        <TabPill active={tab === "rejected"} onClick={() => setTab("rejected")}>Rejected ({counts.rejected})</TabPill>
        <div className="relative ml-auto min-w-[280px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, service or district…"
            className="w-full rounded-full border border-background/10 bg-background/5 py-2 pl-10 pr-4 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <table className="w-full text-sm">
          <thead className="bg-background/5">
            <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-background/40">
              <th className="px-5 py-3">Provider</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">District</th>
              <th className="px-3 py-3">Applied</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background/10">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-background/50" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-xs text-background/50">No provider requests</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="hover:bg-background/5">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary">{r.initials}</div>
                    <div>
                      <p className="font-bold text-background">{r.name}</p>
                      <p className="text-xs text-background/50">{r.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-background/80"><span className="mr-1">{r.categoryIcon}</span>{r.category}</td>
                <td className="px-3 py-3 text-background/70">{r.district}</td>
                <td className="px-3 py-3 text-background/70">{r.applied}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/$username/provider-request/$id" params={{ username, id: r.id }}
                      className="rounded-md border border-background/15 px-3 py-1 text-xs font-semibold text-background/80 hover:bg-background/10">View</Link>
                    {r.status === "Pending" && (
                      <>
                        <button disabled={busyId === r.id} onClick={() => handleApprove(r.id)} className="rounded-md bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60">Approve</button>
                        <button disabled={busyId === r.id} onClick={() => handleReject(r.id)} className="rounded-md border border-destructive/50 px-3 py-1 text-xs font-bold text-destructive hover:bg-destructive/10 disabled:opacity-60">Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const cls = status === "Pending" ? "border-primary/40 text-primary"
    : status === "Approved" ? "border-emerald-400/40 text-emerald-400"
    : "border-destructive/40 text-destructive";
  return <span className={`rounded-full border ${cls} px-2 py-0.5 text-[10px] font-bold`}>{status}</span>;
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
