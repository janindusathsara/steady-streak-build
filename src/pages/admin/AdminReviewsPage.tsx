import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reviewsService, type Review, type ReviewStats } from "@/services/reviews";

const TABS = [
  { k: "all", label: "All" },
  { k: "5", label: "5 Star" },
  { k: "4", label: "4 Star" },
  { k: "3", label: "3 Star" },
  { k: "low", label: "Low" },
  { k: "flag", label: "Flagged" },
] as const;

export function AdminReviewsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const [q, setQ] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        reviewsService.list().catch(() => []),
        reviewsService.stats().catch(() => null),
      ]);
      setReviews(list ?? []);
      setStats(s);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleFlag = async (id: string) => { try { await reviewsService.flag(id); toast.success("Flagged"); load(); } catch (e: any) { toast.error(e?.message ?? "Failed"); } };
  const handleHide = async (id: string) => { try { await reviewsService.hide(id); toast.success("Hidden"); load(); } catch (e: any) { toast.error(e?.message ?? "Failed"); } };
  const handleResolve = async (id: string) => { try { await reviewsService.resolve(id); toast.success("Resolved"); load(); } catch (e: any) { toast.error(e?.message ?? "Failed"); } };

  const filtered = reviews.filter((r) => {
    if (tab === "5" && r.rating !== 5) return false;
    if (tab === "4" && r.rating !== 4) return false;
    if (tab === "3" && r.rating !== 3) return false;
    if (tab === "low" && r.rating > 2) return false;
    if (tab === "flag" && !r.flagged) return false;
    if (q && !`${r.name} ${r.pro} ${r.service}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout active="reviews">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-background/60">Monitor and manage all homeowner reviews for service providers</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard value={stats?.avg?.toFixed(1) ?? "—"} sub="★★★★★" label="Platform Avg." tone="text-amber-400" />
        <StatCard value={stats?.total?.toLocaleString() ?? "—"} label="Total Reviews" />
        <StatCard value={stats?.positive?.toLocaleString() ?? "—"} label="5 & 4 Star" tone="text-emerald-400" />
        <StatCard value={stats?.flagged?.toString() ?? "—"} label="Flagged Reviews" tone="text-red-400" />
        <StatCard value={stats?.awaiting_reply?.toString() ?? "—"} label="Awaiting Reply" tone="text-amber-400" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t.k ? "bg-primary text-primary-foreground"
              : t.k === "flag" ? "bg-red-500/15 text-red-300 hover:bg-red-500/25"
              : "bg-background/10 text-background/70 hover:bg-background/15"
            }`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[280px] flex-1 max-w-md">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍  Search by homeowner, provider or service…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none" />
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Rating Distribution</p>
          <div className="mt-4 space-y-2.5">
            {(stats?.distribution ?? []).map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold text-background/80">{d.stars} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background/10">
                  <div className="h-full bg-amber-400" style={{ width: `${d.total ? (d.count / d.total) * 100 : 0}%` }} />
                </div>
                <span className="w-12 text-right font-semibold text-background/60">{d.count.toLocaleString()}</span>
              </div>
            ))}
            {!stats?.distribution?.length && <p className="text-xs text-background/50">No data</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Top Rated Providers</p>
          <div className="mt-3 space-y-2.5">
            {(stats?.top_providers ?? []).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-[10px] font-bold">{p.initials}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-background/50">{p.meta}</p>
                </div>
                <span className="text-xs font-bold text-amber-400">★ {p.rating}</span>
              </div>
            ))}
            {!stats?.top_providers?.length && <p className="text-xs text-background/50">No data</p>}
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12 text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-background/10 p-12 text-center text-sm text-background/50">No reviews found</div>
        ) : filtered.map((r) => (
          <div key={r.id} className={`rounded-2xl border bg-background/5 p-5 ${r.flagged ? "border-red-500/40" : "border-background/10"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-[11px] font-bold">{r.initials}</div>
                <div>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-[11px] text-background/50">
                    Homeowner · {r.city} · Posted {r.date}
                    {r.flagged && <span className="ml-1.5 text-red-400">· ⚠ Flagged</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-amber-400">{"★".repeat(r.rating)}<span className="text-background/20">{"★".repeat(5 - r.rating)}</span></p>
                <p className="text-[11px] text-background/50">{r.rating.toFixed(1)} / 5.0</p>
              </div>
            </div>
            <div className={`mt-3 rounded-xl border-l-2 px-4 py-3 text-xs text-background/80 ${r.flagged ? "border-red-400 bg-red-500/5" : "border-amber-400 bg-background/5"}`}>
              "{r.text}"
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] text-background/50">
                🔧 {r.service} · <span className="font-semibold text-background/70">{r.pro}</span> · {r.amount} · {r.date}
              </p>
              <div className="flex gap-1.5">
                {r.flagged && <span className="rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-300">Flagged</span>}
                <button onClick={() => handleHide(r.id)} className="rounded-full bg-background/10 px-3 py-1 text-[10px] font-bold text-background/80 hover:bg-background/20">Hide</button>
                {r.flagged ? (
                  <button onClick={() => handleResolve(r.id)} className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">Resolve</button>
                ) : (
                  <button onClick={() => handleFlag(r.id)} className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30">Flag</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </AdminLayout>
  );
}

function StatCard({ value, label, sub, tone }: { value: string; label: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-3xl font-bold ${tone ?? "text-background"}`}>{value}</p>
      {sub && <p className="mt-0.5 text-amber-400 text-sm">{sub}</p>}
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}
