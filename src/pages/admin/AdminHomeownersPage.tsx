import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Status = "Active" | "New" | "Flagged";
const ROWS: Array<{ id: string; i: string; name: string; email: string; location: string; bookings: number; spent: string; since: string; status: Status }> = [
  { id: "priya-mendis", i: "PM", name: "Priya Mendis", email: "priya.m@gmail.com", location: "Colombo 7", bookings: 14, spent: "Rs. 48,200", since: "Jan 2026", status: "Active" },
  { id: "ranjith-wijesinghe", i: "RW", name: "Ranjith Wijesinghe", email: "ranjith.w@yahoo.com", location: "Kandy", bookings: 8, spent: "Rs. 22,500", since: "Mar 2026", status: "Active" },
  { id: "sunitha-de-silva", i: "SD", name: "Sunitha De Silva", email: "sunitha.d@gmail.com", location: "Gampaha", bookings: 21, spent: "Rs. 78,000", since: "Oct 2025", status: "Active" },
  { id: "nuwan-kumara", i: "NK", name: "Nuwan Kumara", email: "nuwan.k@hotmail.com", location: "Matara", bookings: 3, spent: "Rs. 7,800", since: "May 2026", status: "New" },
  { id: "layla-fernando", i: "LF", name: "Layla Fernando", email: "layla.f@gmail.com", location: "Colombo 3", bookings: 6, spent: "Rs. 18,400", since: "Feb 2026", status: "Flagged" },
  { id: "anoma-jayawardena", i: "AJ", name: "Anoma Jayawardena", email: "anoma.j@gmail.com", location: "Nugegoda", bookings: 11, spent: "Rs. 34,000", since: "Nov 2025", status: "Active" },
];


const TABS = [
  { k: "all", label: "All (1,284)" },
  { k: "active", label: "Active (1,190)" },
  { k: "new", label: "New (24)" },
  { k: "flag", label: "Flagged (14)" },
] as const;

export function AdminHomeownersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const { username } = useParams({ from: "/_authenticated/$username/homeowners/" });

  return (
    <AdminLayout active="homeowners">
      <div>
        <h1 className="text-3xl font-bold">Homeowners</h1>
        <p className="mt-1 text-sm text-background/60">All registered homeowners on the FixItNow platform</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value="1,284" label="Total Homeowners" tone="text-sky-400" />
        <Stat value="1,190" label="Active (last 30 days)" tone="text-emerald-400" />
        <Stat value="24" label="Joined This Week" tone="text-amber-400" />
        <Stat value="14" label="Flagged / Disputed" tone="text-red-400" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70 hover:bg-background/15"}`}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[280px] flex-1 max-w-md">
          <input placeholder="🔍  Search by name, email or location…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none" />
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.9fr_0.7fr_0.9fr] gap-2 border-b border-background/10 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-background/50">
          <span>Homeowner</span><span>Location</span><span>Total Bookings</span><span>Spent</span><span>Member Since</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.email} className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.9fr_0.7fr_0.9fr] items-center gap-2 border-b border-background/5 px-5 py-3 text-xs last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-[11px] font-bold">{r.i}</div>
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-[11px] text-background/50">{r.email}</p>
              </div>
            </div>
            <span className="text-background/80">{r.location}</span>
            <span className="font-semibold">{r.bookings}</span>
            <span className="text-background/80">{r.spent}</span>
            <span className="text-background/60">{r.since}</span>
            <span>
              <StatusPill s={r.status} />
            </span>
            <div className="flex justify-end gap-1.5">
              <Link to="/$username/homeowners/$id" params={{ username, id: r.id }} className="rounded-full border border-background/15 px-3 py-1 text-[10px] font-bold text-background/80 hover:bg-background/10">View</Link>
              <button className={`rounded-full px-3 py-1 text-[10px] font-bold ${r.status === "Flagged" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "border border-background/15 text-background/80 hover:bg-background/10"}`}>Suspend</button>
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

function StatusPill({ s }: { s: Status }) {
  const map = {
    Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    New: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    Flagged: "bg-red-500/15 text-red-300 border-red-500/30",
  } as const;
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${map[s]}`}>{s}</span>;
}
