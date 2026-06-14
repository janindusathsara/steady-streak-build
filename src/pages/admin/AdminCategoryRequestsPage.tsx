import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CATEGORY_REQUESTS, type CategoryRequest } from "@/lib/category-requests-data";
import { categoryRequestsService, type CategoryRequestStats } from "@/services/category-requests";
import { toast } from "sonner";

type TabKey = "all" | "Pending" | "Active" | "Rejected";

export function AdminCategoryRequestsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CategoryRequest[]>([]);
  const [stats, setStats] = useState<CategoryRequestStats | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const [list, s] = await Promise.all([
      categoryRequestsService.list().catch(() => CATEGORY_REQUESTS),
      categoryRequestsService.stats().catch(() => null),
    ]);
    setItems(list.length ? list : CATEGORY_REQUESTS);
    setStats(s);
  };

  useEffect(() => {
    (async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = {
    all: stats?.total ?? items.length,
    Pending: stats?.pending ?? items.filter((r) => r.status === "Pending").length,
    Active: stats?.active ?? items.filter((r) => r.status === "Active").length,
    Rejected: stats?.rejected ?? items.filter((r) => r.status === "Rejected").length,
  };

  const TABS: { k: TabKey; label: string }[] = [
    { k: "all", label: `All (${counts.all})` },
    { k: "Pending", label: `Pending (${counts.Pending})` },
    { k: "Active", label: `Active (${counts.Active})` },
    { k: "Rejected", label: `Rejected (${counts.Rejected})` },
  ];

  const rows = items.filter((r) => tab === "all" || r.status === tab);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      await categoryRequestsService.approve(id);
      toast.success("Category approved");
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
      await categoryRequestsService.reject(id);
      toast("Category rejected");
      await load();
    } catch {
      toast.error("Reject failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout active="category-requests">
      <div>
        <h1 className="text-3xl font-bold">Category Requests</h1>
        <p className="mt-1 text-sm text-background/60">Review and approve new service categories requested by providers</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat value={String(counts.Pending)} label="Pending Review" tone="text-amber-400" />
        <Stat value={String(counts.Active)} label="Active Categories" tone="text-emerald-400" />
        <Stat value={String(counts.Rejected)} label="Rejected" tone="text-red-400" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70 hover:bg-background/15"}`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[280px] flex-1 max-w-md">
          <input placeholder="🔍  Search category or requester…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none" />
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <div className="grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr_0.8fr_1.2fr] gap-2 border-b border-background/10 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-background/50">
          <span>Category</span><span>Requested By</span><span>Providers Waiting</span><span>Applied</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-background/50" /></div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-xs text-background/50">No category requests</p>
        ) : rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.6fr_1.2fr_1fr_0.7fr_0.8fr_1.2fr] items-center gap-2 border-b border-background/5 px-5 py-3 text-xs last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 text-lg">{r.icon}</div>
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-[11px] text-background/50">{r.subtitle}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">{r.requestedBy}</p>
              <p className="text-[11px] text-background/50">{r.requesterEmail}</p>
            </div>
            <span className={`font-bold ${r.providersWaiting >= 9 ? "text-amber-400" : r.providersWaiting >= 6 ? "text-amber-300" : "text-background/70"}`}>
              {r.providersWaiting} providers
            </span>
            <span className="text-background/60">{r.applied}</span>
            <span><StatusPill s={r.status} /></span>
            <div className="flex justify-end gap-1.5">
              <Link to="/$username/category-request/$id" params={{ username, id: r.id }}
                className="rounded-full border border-background/15 px-3 py-1 text-[10px] font-bold text-background/80 hover:bg-background/10">View</Link>
              {r.status === "Pending" && (
                <>
                  <button
                    disabled={busyId === r.id}
                    onClick={() => handleApprove(r.id)}
                    className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-60"
                  >Approve</button>
                  <button
                    disabled={busyId === r.id}
                    onClick={() => handleReject(r.id)}
                    className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30 disabled:opacity-60"
                  >Reject</button>
                </>
              )}
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

function StatusPill({ s }: { s: "Pending" | "Active" | "Rejected" }) {
  const map = {
    Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Rejected: "bg-red-500/15 text-red-300 border-red-500/30",
  } as const;
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${map[s]}`}>{s}</span>;
}
