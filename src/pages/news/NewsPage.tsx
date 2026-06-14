import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { listNews, gradientFor, readingTime, formatNewsDate, type NewsArticle } from "@/services/news";

type ArticleVM = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  image_url: string | null;
  gradient: string;
};

function toVM(a: NewsArticle): ArticleVM {
  return {
    id: a.id,
    category: a.category || a.tag || "News",
    title: a.title,
    excerpt: a.excerpt ?? "",
    date: formatNewsDate(a.publish_at ?? a.updated_at ?? a.created_at),
    read: readingTime(a.body),
    image_url: a.image_url,
    gradient: gradientFor(a.id),
  };
}

export function NewsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [items, setItems] = useState<ArticleVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listNews();
        const live = data.filter((a) => a.status === "live").map(toVM);
        setItems(live);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    items.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [items]);

  const filtered = items.filter((a) => filter === "All" || a.category === filter);
  const featured = filtered[0];
  const sidebar = filtered.slice(1, 4);
  const rest = filtered.slice(4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6 pt-8 pb-6 md:pt-12 md:pb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">FixItNow News &amp; Insights</h1>
        <p className="mt-3 text-muted-foreground">Home maintenance tips, platform updates, and industry guides — all in one place.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6 py-16 text-center text-muted-foreground">
          Loading articles…
        </section>
      ) : filtered.length === 0 ? (
        <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6 py-16 text-center text-muted-foreground">
          No articles yet. Check back soon.
        </section>
      ) : (
        <>
          {(featured || sidebar.length > 0) && (
            <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6">
              <div className="grid gap-5 lg:grid-cols-2">
                {featured && (
                  <Link to="/news/$id" params={{ id: featured.id }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                    <div
                      className={`relative aspect-[16/10] bg-gradient-to-br ${featured.gradient}`}
                      style={featured.image_url ? { backgroundImage: `url(${featured.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                    >
                      <span className="absolute bottom-4 left-4 rounded-md bg-card/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
                        {featured.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold leading-snug sm:text-2xl group-hover:text-primary transition-colors">{featured.title}</h2>
                      <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
                      <p className="mt-6 text-xs text-muted-foreground">{featured.date} · {featured.read}</p>
                    </div>
                  </Link>
                )}

                <div className="grid gap-5">
                  {sidebar.map((a) => (
                    <ArticleRow key={a.id} a={a} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6 py-10 md:py-16">
              <h2 className="mb-8 text-2xl font-bold tracking-tight">All Articles</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} a={a} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

function ArticleCard({ a }: { a: ArticleVM }) {
  return (
    <Link to="/news/$id" params={{ id: a.id }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <div
        className={`aspect-[16/9] bg-gradient-to-br ${a.gradient}`}
        style={a.image_url ? { backgroundImage: `url(${a.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
        {a.excerpt && <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>}
        <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </Link>
  );
}

function ArticleRow({ a }: { a: ArticleVM }) {
  return (
    <Link to="/news/$id" params={{ id: a.id }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <div
        className={`aspect-[16/4] bg-gradient-to-br ${a.gradient}`}
        style={a.image_url ? { backgroundImage: `url(${a.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
        <p className="mt-3 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </Link>
  );
}
