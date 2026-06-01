import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CATEGORY_REQUESTS } from "@/lib/category-requests-data";

const TABS = [
  { k: "all", label: "All (31)" },
  { k: "Pending", label: "Pending (3)" },
  { k: "Active", label: "Active (24)" },
  { k: "Rejected", label: "Rejected (4)" },
] as const;

export function AdminCategoryRequestsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
  const rows = CATEGORY_REQUESTS.filter((r) => tab === "all" || r.status === tab);

  return (
    <AdminLayout active="category-requests">
      <div>
        <h1 className="text-3xl font-bold">Category Requests</h1>
        <p className="mt-1 text-sm text-background/60">Review and approve new service categories requested by providers</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat value="3" label="Pending Review" tone="text-amber-400" />
        <Stat value="24" label="Active Categories" tone="text-emerald-400" />
        <Stat value="4" label="Rejected" tone="text-red-400" />
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
        {rows.map((r) => (
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
                  <button className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">Approve</button>
                  <button className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30">Reject</button>
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
