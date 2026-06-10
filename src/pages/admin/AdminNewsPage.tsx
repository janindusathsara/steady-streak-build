import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { listNews, deleteNews, publishNews } from "@/lib/news-admin-data";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";


type Status = "live" | "draft" | "scheduled";
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string;
  image_url: string | null;
  status: Status;
  publish_at: string | null;
  created_at: string;
  updated_at: string;
}

const GRADIENTS = [
  "from-amber-900 to-amber-700",
  "from-sky-900 to-sky-700",
  "from-emerald-900 to-emerald-700",
  "from-violet-900 to-violet-700",
  "from-rose-900 to-red-700",
  "from-amber-800 to-orange-700",
];

const TABS = [
  { k: "all", label: "All" },
  { k: "live", label: "Published" },
  { k: "draft", label: "Drafts" },
  { k: "scheduled", label: "Scheduled" },
] as const;

export function AdminNewsPage() {
  const { username } = useParams({ from: "/_authenticated/$username/update-news/" });
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listNews();
      setArticles(data as Article[]);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => ({
    all: articles.length,
    live: articles.filter((a) => a.status === "live").length,
    draft: articles.filter((a) => a.status === "draft").length,
    scheduled: articles.filter((a) => a.status === "scheduled").length,
  }), [articles]);

  const rows = articles.filter((a) => {
    if (tab !== "all" && a.status !== tab) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      await deleteNews(id);
      toast.success("Article deleted");
      load();
    } catch (err: any) { toast.error(err?.message ?? "Delete failed"); }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishNews(id);
      toast.success("Article published");
      load();
    } catch (err: any) { toast.error(err?.message ?? "Publish failed"); }
  };

  return (
    <AdminLayout active="news">
      <div>
        <h1 className="text-3xl font-bold">News & Updates</h1>
        <p className="mt-1 text-sm text-background/60">Create, edit and publish news articles and platform announcements</p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={counts.live} label="Published Live" tone="text-emerald-400" />
        <StatCard value={counts.draft} label="Drafts" tone="text-amber-400" />
        <StatCard value={counts.scheduled} label="Scheduled" tone="text-sky-400" />
        <StatCard value={counts.all} label="Total Articles" />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to="/$username/update-news/new"
          params={{ username }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> New Article
        </Link>
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold ${
              tab === t.k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70 hover:bg-background/15"
            }`}
          >
            {t.label} ({counts[t.k]})
          </button>
        ))}
        <div className="ml-auto min-w-[260px] flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search articles…"
            className="w-full rounded-full border border-background/10 bg-background/5 px-4 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none"
          />
        </div>
      </section>

      {loading ? (
        <div className="mt-12 flex justify-center text-background/60"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-background/10 p-12 text-center text-sm text-background/60">
          No articles yet. Click <span className="font-bold text-background">+ New Article</span> to create your first one.
        </div>
      ) : (
        <section className="mt-5 grid gap-4 md:grid-cols-2">
          {rows.map((a, i) => (
            <Card key={a.id} a={a} username={username} gradient={GRADIENTS[i % GRADIENTS.length]} onDelete={handleDelete} onPublish={handlePublish} />
          ))}
        </section>
      )}
    </AdminLayout>
  );
}

function Card({ a, username, gradient, onDelete, onPublish }: {
  a: Article; username: string; gradient: string;
  onDelete: (id: string) => void; onPublish: (id: string) => void;
}) {
  const dateLabel = a.status === "scheduled" && a.publish_at
    ? `Scheduled for ${new Date(a.publish_at).toLocaleDateString()}`
    : new Date(a.updated_at).toLocaleDateString();

  return (
    <div className="overflow-hidden rounded-2xl border border-background/10 bg-background/5">
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        {a.image_url ? (
          <img src={a.image_url} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-foreground/70 px-2.5 py-1 text-[10px] font-bold text-background/90">
          {a.tag}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold leading-snug">{a.title}</h3>
        <p className="mt-1 text-[11px] text-background/50">{a.category} · {dateLabel}</p>
        <p className="mt-2.5 line-clamp-2 text-xs text-background/70">{a.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <StatusPill status={a.status} />
          <div className="flex gap-1.5">
            <Link
              to="/$username/update-news/$id/edit"
              params={{ username, id: a.id }}
              className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/30"
            >
              <Pencil className="h-3 w-3" /> Edit
            </Link>
            {a.status !== "live" && (
              <button onClick={() => onPublish(a.id)} className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30">
                Publish
              </button>
            )}
            <button onClick={() => onDelete(a.id)} className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/30">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
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

function StatCard({ value, label, tone }: { value: number | string; label: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-3xl font-bold ${tone ?? "text-background"}`}>{value}</p>
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}
