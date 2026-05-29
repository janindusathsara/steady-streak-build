import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { articles, categories, type Article, type Category } from "@/lib/news-data";

export function NewsPage() {
  const [filter, setFilter] = useState<Category>("All");
  const filtered = articles.filter((a) => filter === "All" || a.category === filter);
  const featured = filtered.find((a) => a.featured);
  const sidebar = filtered.filter((a) => !a.featured).slice(0, 3);
  const rest = filtered.filter((a) => !a.featured).slice(featured ? 3 : 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 pt-12 pb-8">
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

      {(featured || sidebar.length > 0) && (
        <section className="mx-auto max-w-6xl px-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {featured && (
              <Link to="/news/$id" params={{ id: String(featured.id) }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${featured.gradient}`}>
                  <span className="absolute bottom-4 left-4 rounded-md bg-card/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
                    {featured.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold leading-snug sm:text-2xl group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
                  <p className="mt-6 text-xs text-muted-foreground">
                    {featured.date} · {featured.read}{featured.author ? ` · ${featured.author}` : ""}
                  </p>
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

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">All Articles</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <Link to="/news/$id" params={{ id: String(a.id) }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className={`aspect-[16/9] bg-gradient-to-br ${a.gradient}`} />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
        {a.excerpt && <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>}
        <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </Link>
  );
}

function ArticleRow({ a }: { a: Article }) {
  return (
    <Link to="/news/$id" params={{ id: String(a.id) }} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className={`aspect-[16/4] bg-gradient-to-br ${a.gradient}`} />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
        <p className="mt-3 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </Link>
  );
}
