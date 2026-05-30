import { ProviderLayout } from "@/components/provider/ProviderLayout";

const DIST = [
  { stars: 5, count: 105, total: 128 },
  { stars: 4, count: 16, total: 128 },
  { stars: 3, count: 5, total: 128 },
  { stars: 2, count: 1, total: 128 },
  { stars: 1, count: 1, total: 128 },
];

const REVIEWS = [
  { name: "Priya Mendis", city: "Colombo 7", service: "Emergency Plumbing", date: "23 May 2026", paid: "Rs. 4,200", rating: 5, text: "Marcus was absolutely professional. Fixed the burst pipe in under an hour. Highly recommend!" },
  { name: "Ranjith Wijesinghe", city: "Kandy", service: "Pipe Replacement", date: "20 May 2026", paid: "Rs. 8,500", rating: 5, text: "Excellent job. Clean work, no mess. Will definitely book again." },
  { name: "Anoma Jayawardena", city: "Nugegoda", service: "Water Heater Service", date: "15 May 2026", paid: "Rs. 3,500", rating: 5, text: "Arrived on time, fixed the heater quickly. Very professional." },
  { name: "T. Kumar", city: "Kandy", service: "Faucet Repair", date: "10 May 2026", paid: "Rs. 1,800", rating: 4, text: "Good work overall, slightly longer than expected but quality was great." },
  { name: "Maria Santos", city: "Gampaha", service: "Bathroom Installation", date: "5 May 2026", paid: "Rs. 12,000", rating: 5, text: "Full bathroom installation done perfectly. Great attention to detail. 10/10!" },
  { name: "Sunitha De Silva", city: "Colombo 3", service: "Emergency Plumbing", date: "28 Apr 2026", paid: "Rs. 5,800", rating: 5, text: "Responded in 30 minutes during a burst pipe emergency. Absolute lifesaver!" },
];

export function ProviderReviewsPage() {
  return (
    <ProviderLayout active="reviews" newRequestsCount={2} reviewsCount={128}>
      <div>
        <h1 className="text-3xl font-bold">Reviews & Job History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your complete service record · 128 reviews · Avg. 4.9 ★</p>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-5xl font-bold">4.9</p>
          <p className="mt-2 text-amber-500 text-lg">★★★★★</p>
          <p className="mt-1 text-xs text-muted-foreground">128 reviews</p>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-emerald-600">98%</p>
            <p className="text-[11px] text-muted-foreground">Top 5% of pros</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rating Distribution</p>
          <div className="mt-4 space-y-2">
            {DIST.map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold">{d.stars} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-amber-400" style={{ width: `${(d.count / d.total) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-semibold text-muted-foreground">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat value="Rs. 842K" label="Total Earned" tone="text-emerald-600" />
            <Stat value="128" label="Jobs Done" />
            <Stat value="8 yrs" label="Experience" />
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
            {REVIEWS.map((r) => (
              <tr key={r.name} className="border-b border-border last:border-0">
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

      <div className="mt-6 flex justify-center">
        <button className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold hover:bg-muted">
          Load More (122 remaining)
        </button>
      </div>
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
