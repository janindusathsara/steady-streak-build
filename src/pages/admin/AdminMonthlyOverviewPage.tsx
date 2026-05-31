import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const WEEKS = [
  { label: "W1", value: 480, h: 55 },
  { label: "W2", value: 560, h: 65 },
  { label: "W3", value: 680, h: 80 },
  { label: "W4", value: 720, h: 85 },
  { label: "W5", value: 360, h: 42, partial: true },
];

const CATS = [
  { name: "Plumbing", value: 520, h: 90, color: "bg-amber-400" },
  { name: "Electrical", value: 380, h: 65, color: "bg-sky-400" },
  { name: "HVAC", value: 290, h: 50, color: "bg-emerald-400" },
  { name: "Painting", value: 240, h: 42, color: "bg-orange-400" },
  { name: "Carpentry", value: 180, h: 32, color: "bg-violet-400" },
  { name: "Other", value: 230, h: 40, color: "bg-background/40" },
];

const PROVIDERS = [
  { i: "MS", name: "Marcus Sterling", city: "Colombo", cat: "🔧 Plumbing", jobs: 48, revenue: "Rs. 134K", rating: 4.9 },
  { i: "ER", name: "Elena Rodriguez", city: "Colombo", cat: "⚡ Electrical", jobs: 36, revenue: "Rs. 98K", rating: 4.8 },
  { i: "JW", name: "James Wilson", city: "Gampaha", cat: "❄ HVAC", jobs: 28, revenue: "Rs. 76K", rating: 4.6 },
];

const DISTRICTS = [
  { name: "Colombo", bookings: 680, tone: "text-amber-400" },
  { name: "Gampaha", bookings: 320, tone: "text-sky-400" },
  { name: "Kandy", bookings: 240, tone: "text-emerald-400" },
  { name: "Galle", bookings: 180, tone: "text-orange-400" },
  { name: "Matara", bookings: 140, tone: "text-red-400" },
  { name: "Other", bookings: 280, tone: "text-violet-400" },
];

export function AdminMonthlyOverviewPage() {
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  return (
    <AdminLayout active="monthly">
      <div>
        <h1 className="text-3xl font-bold">Monthly Overview</h1>
        <p className="mt-1 text-sm text-background/60">Detailed performance report · Platform analytics & KPIs</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-background/10 px-3 py-2 text-sm hover:bg-background/20">‹</button>
        <div className="rounded-full bg-background/10 px-5 py-2 text-sm font-bold">May 2026</div>
        <button className="rounded-full bg-background/10 px-3 py-2 text-sm hover:bg-background/20">›</button>
        <div className="ml-1 flex gap-1 rounded-full bg-background/10 p-1 text-xs font-semibold">
          {(["monthly", "quarterly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3 py-1.5 capitalize ${period === p ? "bg-primary text-primary-foreground" : "text-background/70"}`}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="ml-auto rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20">
          ↓ Export PDF
        </button>
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Total Revenue" value="Rs. 2.4M" delta="↑ 18% vs Apr 2026" tone="emerald" />
        <KPI label="Total Bookings" value="1,840" delta="↑ 12% vs Apr 2026" tone="emerald" />
        <KPI label="New Homeowners" value="124" delta="↑ 24 from last month" tone="emerald" />
        <KPI label="New Providers" value="18" delta="↑ 6 from last month" tone="emerald" />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Completion Rate" value="94.2%" delta="↑ 1.4% vs Apr" tone="emerald" />
        <KPI label="Cancellation Rate" value="5.8%" delta="↓ 0.6% vs Apr" tone="red" />
        <KPI label="Avg. Job Value" value="Rs. 4,820" delta="↑ Rs. 320 vs Apr" tone="emerald" />
        <KPI label="Avg. Rating" value="4.8 ★" delta="↑ 0.1 vs Apr" tone="emerald" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Revenue — May 2026 (By Week)</p>
          <div className="mt-6 flex h-44 items-end gap-4">
            {WEEKS.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-background/50">Rs.{w.value}K</span>
                <div
                  className={`w-full rounded-t-md ${w.partial ? "bg-background/30" : "bg-amber-400"}`}
                  style={{ height: `${w.h}%` }}
                />
                <span className="text-[11px] font-semibold text-background/60">{w.label}{w.partial ? " ↗" : ""}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-background/10 pt-4">
            <MiniStat value="Rs. 2.4M" label="Month Total" tone="text-emerald-400" />
            <MiniStat value="Rs. 600K" label="Weekly Avg." />
            <MiniStat value="Rs. 192K" label="Platform Fee" tone="text-amber-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">Bookings by Category</p>
          <div className="mt-6 flex h-44 items-end gap-3">
            {CATS.map((c) => (
              <div key={c.name} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-background/50">{c.value}</span>
                <div className={`w-full rounded-t-md ${c.color}`} style={{ height: `${c.h}%` }} />
                <span className="text-[10px] text-background/60">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-background/10 pt-4 text-xs">
            <div className="flex justify-between"><span className="text-background/60">Top Category</span><span className="font-bold text-amber-400">🔧 Plumbing (28.3%)</span></div>
            <div className="flex justify-between"><span className="text-background/60">Fastest Growing</span><span className="font-bold text-sky-400">❄ HVAC (+34% vs Apr)</span></div>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background/10 text-left text-[10px] font-bold uppercase tracking-wider text-background/50">
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Jobs in May</th>
              <th className="px-5 py-3">Revenue</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {PROVIDERS.map((p) => (
              <tr key={p.name} className="border-b border-background/10 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-[10px] font-bold">{p.i}</div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-[11px] text-background/50">{p.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">{p.cat}</td>
                <td className="px-5 py-4 font-bold text-emerald-400">{p.jobs}</td>
                <td className="px-5 py-4">{p.revenue}</td>
                <td className="px-5 py-4 font-bold text-amber-400">★ {p.rating}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">● Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-2xl border border-background/10 bg-background/5 p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">District Performance — May 2026</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {DISTRICTS.map((d) => (
            <div key={d.name} className="rounded-xl border border-background/10 bg-background/5 p-4 text-center">
              <p className="text-xs font-semibold text-background/70">{d.name}</p>
              <p className={`mt-1.5 text-2xl font-bold ${d.tone}`}>{d.bookings}</p>
              <p className="text-[10px] text-background/50">bookings</p>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}

function KPI({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "emerald" | "red" }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-background/50">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${tone === "emerald" ? "text-emerald-400" : "text-red-400"}`}>{delta}</p>
    </div>
  );
}

function MiniStat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div className="text-center">
      <p className={`text-sm font-bold ${tone ?? "text-background"}`}>{value}</p>
      <p className="text-[10px] text-background/50">{label}</p>
    </div>
  );
}
