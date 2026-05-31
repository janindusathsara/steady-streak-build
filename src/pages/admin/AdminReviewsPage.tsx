import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const DIST = [
  { stars: 5, count: 1820, total: 2840 },
  { stars: 4, count: 874, total: 2840 },
  { stars: 3, count: 102, total: 2840 },
  { stars: 2, count: 28, total: 2840 },
  { stars: 1, count: 16, total: 2840 },
];

const TOP = [
  { i: "MS", name: "Marcus Sterling", meta: "342 reviews · Plumbing", rating: 4.9 },
  { i: "RP", name: "Rajan Perera", meta: "94 reviews · Painting", rating: 4.9 },
  { i: "ER", name: "Elena Rodriguez", meta: "218 reviews · Electrical", rating: 4.8 },
  { i: "JW", name: "James Wilson", meta: "156 reviews · HVAC", rating: 4.6 },
];

type Tone = "ok" | "flag";
const REVIEWS: Array<{
  i: string;
  name: string;
  city: string;
  date: string;
  text: string;
  service: string;
  pro: string;
  amount: string;
  rating: number;
  tone?: Tone;
  flagged?: boolean;
}> = [
  { i: "PM", name: "Priya Mendis", city: "Colombo 7", date: "26 May 2026", rating: 5, service: "Plumbing", pro: "Marcus Sterling", amount: "Rs. 4,200", text: "Marcus was absolutely professional. He arrived on time, diagnosed the issue in minutes, and fixed the pipe leak cleanly. Will definitely book again. The escrow payment system gave me great peace of mind." },
  { i: "RW", name: "Ranjith Wijesinghe", city: "Kandy", date: "22 May 2026", rating: 4, service: "Electrical", pro: "Elena Rodriguez", amount: "Rs. 3,800", text: "Elena did a good job installing the new sockets. Work was clean and she explained everything clearly. Took a little longer than estimated but the quality was excellent." },
  { i: "LF", name: "Layla Fernando", city: "Colombo 3", date: "19 May 2026", rating: 1, service: "Plumbing", pro: "Dilshan Wickrama", amount: "Rs. 5,000", text: "Arrived 3 hours late and left a mess. Work quality was terrible — the pipe is leaking again. I want a full refund. Never booking again!", flagged: true, tone: "flag" },
  { i: "AJ", name: "Anoma Jayawardena", city: "Nugegoda", date: "17 May 2026", rating: 5, service: "HVAC", pro: "James Wilson", amount: "Rs. 7,500", text: "Absolutely fantastic service! James noticed an issue we hadn't mentioned and fixed it on the spot. Would recommend him to everyone. 10/10." },
];

const TABS = [
  { k: "all", label: "All (2,840)" },
  { k: "5", label: "5 Star (1,820)" },
  { k: "4", label: "4 Star (874)" },
  { k: "3", label: "3 Star (102)" },
  { k: "low", label: "Low (44)" },
  { k: "flag", label: "Flagged (4)" },
] as const;

export function AdminReviewsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");

  return (
    <AdminLayout active="reviews">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-background/60">Monitor and manage all homeowner reviews for service providers</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard value="4.8" sub="★★★★★" label="Platform Avg." tone="text-amber-400" />
        <StatCard value="2,840" label="Total Reviews" />
        <StatCard value="2,694" label="5 & 4 Star" tone="text-emerald-400" />
        <StatCard value="4" label="Flagged Reviews" tone="text-red-400" />
        <StatCard value="22" label="Awaiting Reply" tone="text-amber-400" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t.k
                ? "bg-primary text-primary-foreground"
                : t.k === "flag"
                ? "bg-red-500/15 text-red-300 hover:bg-red-500/25"
                : "bg-background/10 text-background/70 hover:bg-background/15"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[280px] flex-1 max-w-md">
          <input
            placeholder="🔍  Search by homeowner, provider or service…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none"
          />
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Rating Distribution</p>
          <div className="mt-4 space-y-2.5">
            {DIST.map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold text-background/80">{d.stars} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background/10">
                  <div className="h-full bg-amber-400" style={{ width: `${(d.count / d.total) * 100}%` }} />
                </div>
                <span className="w-12 text-right font-semibold text-background/60">{d.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Top Rated Providers</p>
          <div className="mt-3 space-y-2.5">
            {TOP.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-[10px] font-bold">{p.i}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-background/50">{p.meta}</p>
                </div>
                <span className="text-xs font-bold text-amber-400">★ {p.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className={`rounded-2xl border bg-background/5 p-5 ${
              r.tone === "flag" ? "border-red-500/40" : "border-background/10"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-[11px] font-bold">{r.i}</div>
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
            <div className={`mt-3 rounded-xl border-l-2 px-4 py-3 text-xs text-background/80 ${r.tone === "flag" ? "border-red-400 bg-red-500/5" : "border-amber-400 bg-background/5"}`}>
              "{r.text}"
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] text-background/50">
                🔧 {r.service} · <span className="font-semibold text-background/70">{r.pro}</span> · {r.amount} · {r.date}
              </p>
              <div className="flex gap-1.5">
                {r.flagged && <span className="rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-300">Flagged</span>}
                <button className="rounded-full bg-background/10 px-3 py-1 text-[10px] font-bold text-background/80 hover:bg-background/20">Hide</button>
                {r.flagged ? (
                  <button className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">Resolve</button>
                ) : (
                  <button className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30">Flag</button>
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
