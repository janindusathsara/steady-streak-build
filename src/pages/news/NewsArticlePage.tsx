import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { articles, getArticleById } from "@/lib/news-data";

export function NewsArticlePage() {
  const { id } = useParams({ from: "/news/$id" });
  const article = getArticleById(Number(id));

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

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> All News
        </Link>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">{article.category}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {article.date} · {article.read}{article.author ? ` · ${article.author}` : ""}
        </p>

        <div className={`mt-8 aspect-[16/8] rounded-2xl bg-gradient-to-br ${article.gradient}`} />

        <p className="mt-8 text-lg leading-relaxed text-foreground/90">{article.excerpt}</p>

        <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/80">
          {article.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">More in {article.category}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link key={a.id} to="/news/$id" params={{ id: String(a.id) }} className="block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                <div className={`aspect-[16/9] bg-gradient-to-br ${a.gradient}`} />
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
                  <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.read}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
