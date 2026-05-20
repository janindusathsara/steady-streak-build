import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

const categories = ["All", "Platform Updates", "Maintenance Tips", "Provider Stories", "Industry News", "Gold Members"] as const;
type Category = typeof categories[number];

const articles = [
  { id: 1, category: "Platform Updates" as Category, title: "FixItNow Launches Smart Home AI Integration — Predict Problems Before They Happen", excerpt: "Our new AI Predictive Maintenance system analyses your home's history and local climate data to alert you to potential failures weeks before they become costly emergencies. Available today for all Gold members.", date: "Nov 12, 2024", read: "5 min read", author: "Platform Team", featured: true, gradient: "from-violet-500 to-indigo-600" },
  { id: 2, category: "Maintenance Tips" as Category, title: "5 Plumbing Checks Every Homeowner Should Do Before Winter", excerpt: "", date: "Nov 8, 2024", read: "3 min read", gradient: "from-emerald-600 to-teal-700" },
  { id: 3, category: "Provider Stories" as Category, title: "How Marcus Grew His Plumbing Business 3× in 6 Months", excerpt: "", date: "Nov 5, 2024", read: "4 min read", gradient: "from-blue-500 to-violet-600" },
  { id: 4, category: "Gold Members" as Category, title: "Gold Membership Now Includes 2-Year Extended Warranty", excerpt: "", date: "Oct 28, 2024", read: "2 min read", gradient: "from-amber-500 to-orange-600" },
  { id: 5, category: "Industry News" as Category, title: "Why Skilled Trades Are the Fastest-Growing Sector in 2024", excerpt: "A look at rising demand, wages, and what it means for homeowners.", date: "Oct 22, 2024", read: "6 min read", gradient: "from-red-500 to-rose-700" },
  { id: 6, category: "Maintenance Tips" as Category, title: "Your Complete HVAC Seasonal Checklist", excerpt: "Prepare your heating and cooling systems before extreme weather hits.", date: "Oct 18, 2024", read: "4 min read", gradient: "from-orange-500 to-amber-700" },
  { id: 7, category: "Platform Updates" as Category, title: "Introducing Real-Time GPS Tracking for All Bookings", excerpt: "Know exactly when your provider will arrive with our new live map.", date: "Oct 14, 2024", read: "2 min read", gradient: "from-indigo-500 to-violet-700" },
  { id: 8, category: "Provider Stories" as Category, title: "From Apprentice to Top Rated: Elena Rodriguez's Journey", excerpt: "The HVAC specialist shares how FixItNow transformed her career.", date: "Oct 10, 2024", read: "5 min read", gradient: "from-cyan-600 to-blue-700" },
  { id: 9, category: "Maintenance Tips" as Category, title: "10 Signs Your Electrical Wiring Needs Attention", excerpt: "Spot these warning signs early before they become fire hazards.", date: "Oct 6, 2024", read: "4 min read", gradient: "from-emerald-700 to-green-900" },
  { id: 10, category: "Gold Members" as Category, title: "Priority Dispatch: Gold Members Get Help in 12 Minutes", excerpt: "How Gold members skip the queue and get a technician instantly.", date: "Oct 2, 2024", read: "3 min read", gradient: "from-pink-600 to-rose-800" },
];

type Article = typeof articles[number];

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
              <article className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${featured.gradient}`}>
                  <span className="absolute bottom-4 left-4 rounded-md bg-card/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
                    {featured.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold leading-snug sm:text-2xl">{featured.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
                  <p className="mt-6 text-xs text-muted-foreground">
                    {featured.date} · {featured.read}{featured.author ? ` · ${featured.author}` : ""}
                  </p>
                </div>
              </article>
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
    <article className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className={`aspect-[16/9] bg-gradient-to-br ${a.gradient}`} />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
        {a.excerpt && <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>}
        <p className="mt-4 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </article>
  );
}

function ArticleRow({ a }: { a: Article }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className={`aspect-[16/4] bg-gradient-to-br ${a.gradient}`} />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.category}</p>
        <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
        <p className="mt-3 text-xs text-muted-foreground">{a.date} · {a.read}</p>
      </div>
    </article>
  );
}
