import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import {
  providerReviewsService,
  type ProviderReview,
  type ProviderReviewsSummary,
} from "@/services/provider-reviews";

export function ProviderReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [summary, setSummary] = useState<ProviderReviewsSummary | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [r, s] = await Promise.all([
          providerReviewsService.list().catch(() => [] as ProviderReview[]),
          providerReviewsService.summary().catch(() => null),
        ]);
        if (!alive) return;
        setReviews(r);
        setSummary(s);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const total = summary?.totalReviews ?? reviews.length;
  const avg = summary?.avgRating ?? 0;
  const dist = summary?.distribution ?? [];

  return (
    <ProviderLayout active="reviews" newRequestsCount={2} reviewsCount={total}>
      <div>
        <h1 className="text-3xl font-bold">Reviews & Job History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your complete service record · {total} reviews · Avg. {avg.toFixed(1)} ★</p>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-5xl font-bold">{avg.toFixed(1)}</p>
              <p className="mt-2 text-amber-500 text-lg">★★★★★</p>
              <p className="mt-1 text-xs text-muted-foreground">{total} reviews</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-emerald-600">{summary?.completionRate ?? 0}%</p>
                <p className="text-[11px] text-muted-foreground">Top 5% of pros</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rating Distribution</p>
              <div className="mt-4 space-y-2">
                {dist.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No ratings yet</p>
                ) : dist.map((d) => (
                  <div key={d.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-semibold">{d.stars} ★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-amber-400" style={{ width: `${d.total ? (d.count / d.total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right font-semibold text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat value={summary?.totalEarned ?? "—"} label="Total Earned" tone="text-emerald-600" />
                <Stat value={String(summary?.jobsDone ?? 0)} label="Jobs Done" />
                <Stat value={summary?.experience ?? "—"} label="Experience" />
              </div>
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Homeowner</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Review</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">No reviews yet</td></tr>
                ) : reviews.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.city}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">{r.service}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-4 font-semibold">{r.paid}</td>
                    <td className="px-5 py-4 text-amber-500">{"★".repeat(r.rating)}<span className="text-muted-foreground/40">{"★".repeat(5 - r.rating)}</span></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">"{r.text}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {reviews.length > 0 && total > reviews.length && (
            <div className="mt-6 flex justify-center">
              <button className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold hover:bg-muted">
                Load More ({total - reviews.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </ProviderLayout>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 text-center">
      <p className={`text-lg font-bold ${tone ?? ""}`}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
