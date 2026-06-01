import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { findCategoryRequest } from "@/lib/category-requests-data";
import { toast } from "sonner";

export function AdminCategoryRequestDetailPage({ id }: { id: string }) {
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
  const navigate = useNavigate();
  const c = findCategoryRequest(id);

  if (!c) {
    return (
      <AdminLayout active="category-requests">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-8 text-center">
          <p className="text-sm text-background/60">Category request not found.</p>
          <Link to="/$username/category-request" params={{ username }} className="mt-3 inline-block text-xs font-bold text-primary">← Back to list</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="category-requests">
      <div className="flex items-start gap-4">
        <Link to="/$username/category-request" params={{ username }}
          className="flex items-center gap-1.5 rounded-full border border-background/15 bg-background/5 px-3.5 py-2 text-xs font-bold text-background/80 hover:bg-background/10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Category Request — {c.name}</h1>
          <p className="mt-0.5 text-xs text-background/50">Requested {c.requestedAgo} · {c.providersWaiting} providers waiting</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main card */}
        <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background/10 text-3xl">{c.icon}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{c.name}</h2>
              <p className="text-[11px] text-background/50">New category · {c.createdAt}</p>
              <span className="mt-1.5 inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">Pending Review</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Category Name" value={c.name} />
            <Field label="Proposed Icon" value={c.icon} valueClass="text-2xl" />
            <Field label="Requested By" value={c.requestedBy} />
            <Field label="Contact" value={c.contact} />
            <Field label="Providers Waiting" value={`${c.providersWaiting} providers`} valueClass="text-amber-400 font-bold" />
            <Field label="Est. Demand" value={c.demand} valueClass="text-emerald-400 font-bold" />
            <Field label="Price Range" value={c.priceRange} />
            <Field label="Platform Fee" value={c.platformFee} />
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Description</p>
            <div className="mt-1.5 rounded-xl border border-background/10 bg-background/5 px-4 py-3 text-xs text-background/80">{c.description}</div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Sub-Categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.subCategories.map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/5 px-3 py-1 text-[11px] font-semibold">
                  <span>{s.icon}</span>{s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Admin Notes</p>
            <textarea defaultValue={c.adminNotes}
              className="mt-1.5 min-h-[88px] w-full resize-y rounded-xl border border-background/10 bg-background/5 px-4 py-3 text-xs text-background/80 focus:outline-none" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => { toast.success("Category approved"); navigate({ to: "/$username/category-request", params: { username } }); }}
              className="rounded-xl bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30">✓ Approve &amp; Go Live</button>
            <button onClick={() => { toast("Category rejected"); navigate({ to: "/$username/category-request", params: { username } }); }}
              className="rounded-xl bg-red-500/20 px-5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/30">✗ Reject Category</button>
            <Link to="/$username/category-request" params={{ username }}
              className="rounded-xl border border-background/15 px-5 py-2.5 text-xs font-bold text-background/80 hover:bg-background/10">Cancel</Link>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Demand Analysis</p>
            <div className="mt-3 rounded-xl bg-background/5 py-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{c.providersWaiting}</p>
              <p className="text-[11px] text-background/60">Providers Ready to Join</p>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <Row k="Est. Monthly Bookings" v={c.monthlyBookings} />
              <Row k="Est. Revenue / Month" v={c.monthlyRevenue} tone="text-amber-400" />
              <Row k="User Search Hits" v={c.searchHits} tone="text-amber-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Providers Waiting</p>
            <div className="mt-3 space-y-2.5">
              {c.providers.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-[10px] font-bold">{p.i}</div>
                  <div>
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="text-[10px] text-background/50">{p.city} · {p.years}</p>
                  </div>
                </div>
              ))}
            </div>
            {c.extraProviders > 0 && (
              <p className="mt-3 text-center text-[11px] font-semibold text-primary">+ {c.extraProviders} more providers</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-background/10 bg-background/5 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-t border-background/5 pt-2 text-xs">
      <span className="text-background/60">{k}</span>
      <span className={`font-bold ${tone ?? "text-background"}`}>{v}</span>
    </div>
  );
}
