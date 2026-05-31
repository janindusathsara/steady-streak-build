import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Status = "live" | "draft" | "scheduled";
interface Article {
  id: string;
  tag: string;
  emoji: string;
  bg: string;
  title: string;
  author: string;
  date: string;
  meta: string;
  excerpt: string;
  status: Status;
}

const ARTICLES: Article[] = [
  { id: "1", tag: "Platform Update", emoji: "🏠", bg: "from-amber-900 to-amber-700", title: "FixItNow Launches Same-Day Booking Across All Districts", author: "Alex Johnson", date: "24 May 2026", meta: "3,240 reads", excerpt: "Our expanded network now covers all 25 districts, enabling homeowners to book verified professionals with same-day availability.", status: "live" },
  { id: "2", tag: "Feature", emoji: "⭐", bg: "from-sky-900 to-sky-700", title: "Introducing Gold Membership — Unlock Premium Benefits", author: "Alex Johnson", date: "20 May 2026", meta: "2,815 reads", excerpt: "Gold Members receive priority booking, exclusive discounts and a dedicated support line for faster resolutions.", status: "live" },
  { id: "3", tag: "Security", emoji: "🛡", bg: "from-emerald-900 to-emerald-700", title: "New Escrow Payment Protection — Your Money is Safer Than Ever", author: "Admin Team", date: "15 May 2026", meta: "4,102 reads", excerpt: "Upgraded escrow system with 256-bit encryption and automated dispute resolution on every booking.", status: "live" },
  { id: "4", tag: "Announcement", emoji: "📢", bg: "from-amber-800 to-orange-700", title: "Ramadan Special: 15% Off All Home Services in May", author: "Marketing", date: "1 May 2026", meta: "Scheduled", excerpt: "Offering 15% discounts across all service categories. Valid for all bookings made in May 2026.", status: "scheduled" },
  { id: "5", tag: "App Update", emoji: "📱", bg: "from-violet-900 to-violet-700", title: "FixItNow Mobile App v2.4 — Live Tracking & Chat Upgrade", author: "Dev Team", date: "Draft · Last edited 2d ago", meta: "", excerpt: "v2.4 brings real-time provider tracking, in-app chat with file sharing, and a redesigned booking flow.", status: "draft" },
  { id: "6", tag: "Provider Spotlight", emoji: "🌟", bg: "from-rose-900 to-red-700", title: "Provider Spotlight: Marcus Sterling — 300+ Jobs, 4.9 Stars", author: "Content Team", date: "Draft · Last edited 3d ago", meta: "", excerpt: "Spotlighting Marcus Sterling, our top-rated plumber with 300+ completed jobs and a near-perfect rating.", status: "draft" },
];

const TABS = [
  { k: "all", label: "All (8)" },
  { k: "live", label: "Published (5)" },
  { k: "draft", label: "Drafts (2)" },
  { k: "scheduled", label: "Scheduled (1)" },
] as const;

export function AdminNewsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const rows = ARTICLES.filter((a) => tab === "all" ? true : a.status === tab);

  return (
    <AdminLayout active="news">
      <div>
        <h1 className="text-3xl font-bold">News & Updates</h1>
        <p className="mt-1 text-sm text-background/60">Create, edit and publish news articles and platform announcements</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value="5" label="Published Live" tone="text-emerald-400" />
        <StatCard value="2" label="Drafts" tone="text-amber-400" />
        <StatCard value="1" label="Scheduled" tone="text-sky-400" />
        <StatCard value="12,480" label="Total Reads" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        <button className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90">+ New Article</button>
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold ${
              tab === t.k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70 hover:bg-background/15"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto min-w-[260px] flex-1 max-w-md">
          <input
            placeholder="🔍  Search articles…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none"
          />
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {rows.map((a) => (
          <Card key={a.id} a={a} />
        ))}
      </section>
    </AdminLayout>
  );
}

function Card({ a }: { a: Article }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-background/10 bg-background/5">
      <div className={`relative h-36 bg-gradient-to-br ${a.bg}`}>
        <span className="absolute left-3 top-3 rounded-full bg-foreground/70 px-2.5 py-1 text-[10px] font-bold text-background/90">
          {a.tag}
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-5xl">{a.emoji}</span>
      </div>
      <div className="p-5">
        <h3 className="font-bold leading-snug">{a.title}</h3>
        <p className="mt-1 text-[11px] text-background/50">
          By {a.author}{a.meta && a.meta !== "Scheduled" ? ` · ${a.date} · ${a.meta}` : ` · ${a.date}`}
        </p>
        <p className="mt-2.5 text-xs text-background/70">{a.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <StatusPill status={a.status} />
          <div className="flex gap-1.5">
            <button className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/30">✏ Edit</button>
            {a.status === "draft" ? (
              <button className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">Publish</button>
            ) : a.status === "scheduled" ? (
              <button className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">Publish Now</button>
            ) : (
              <button className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30">🗑 Delete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status === "live") return <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">● Live</span>;
  if (status === "scheduled") return <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-[10px] font-bold text-sky-300">📅 Scheduled</span>;
  return <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300">✎ Draft</span>;
}

function StatCard({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-3xl font-bold ${tone ?? "text-background"}`}>{value}</p>
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}
