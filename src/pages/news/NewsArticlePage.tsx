import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { getNews, listNews, gradientFor, readingTime, formatNewsDate, type NewsArticle } from "@/services/news";

export function NewsArticlePage() {
  const { id } = useParams({ from: "/news/$id" });
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, all] = await Promise.all([getNews(id), listNews().catch(() => [])]);
        if (cancelled) return;
        setArticle(a);
        if (a) {
          setRelated(all.filter((x) => x.id !== a.id && x.status === "live" && x.category === a.category).slice(0, 3));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Article not found</h1>
          <p className="mt-3 text-muted-foreground">The story you're looking for has moved or no longer exists.</p>
          <Link to="/news" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <ChevronLeft className="h-4 w-4" /> Back to News
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = article.category || article.tag || "News";
  const date = formatNewsDate(article.publish_at ?? article.updated_at ?? article.created_at);
  const read = readingTime(article.body);
  const heroGradient = gradientFor(article.id);
  const paragraphs = (article.body ?? "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 sm:px-6 pt-8 pb-12 md:pt-10 md:pb-16">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> All News
        </Link>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">{category}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{date} · {read}</p>

        <div
          className={`mt-8 aspect-[16/8] rounded-2xl bg-gradient-to-br ${heroGradient}`}
          style={article.image_url ? { backgroundImage: `url(${article.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        />

        {article.excerpt && <p className="mt-8 text-lg leading-relaxed text-foreground/90">{article.excerpt}</p>}

        <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/80">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl 4xl:max-w-[1800px] px-5 sm:px-6 pb-12 md:pb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">More in {category}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => {
              const g = gradientFor(a.id);
              return (
                <Link key={a.id} to="/news/$id" params={{ id: a.id }} className="block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                  <div
                    className={`aspect-[16/9] bg-gradient-to-br ${g}`}
                    style={a.image_url ? { backgroundImage: `url(${a.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                  />
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category || a.tag}</p>
                    <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
                    <p className="mt-4 text-xs text-muted-foreground">{formatNewsDate(a.publish_at ?? a.updated_at ?? a.created_at)} · {readingTime(a.body)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
