import { Link } from "@tanstack/react-router";
import { Search, MapPin, Star, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SERVICES } from "@/lib/services-data";

const POPULAR = ["Faucet Repair", "AC Maintenance", "Roof Inspection", "Garden Design"];

const TOP_RATED = [
  { id: "plumber", name: "Marcus Sterling", title: "Master Plumber", area: "Downtown Colombo", avail: "Available within 2 hours", price: 85, rating: 4.9 },
  { id: "electrician", name: "Elena Rodriguez", title: "Electrical Specialist", area: "Negombo", avail: "Available today", price: 95, rating: 4.8 },
  { id: "hvac", name: "James Wilson", title: "HVAC & Cooling", area: "Gampaha", avail: "Scheduled slots open", price: 120, rating: 5.0 },
  { id: "painter", name: "Sarah Chen", title: "Professional Painter", area: "Kandy", avail: "Available within 24 hrs", price: 65, rating: 4.7 },
];

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero search */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ lineHeight: 1.05 }}>
            Find the Right <span className="text-primary">Expert</span> for Any Job
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Browse 2,400+ verified professionals across 30+ service categories.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="What service do you need?"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 sm:border-l-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <select className="w-full bg-transparent py-2.5 text-sm outline-none sm:w-auto">
                <option>Your location</option>
                <option>Colombo</option>
                <option>Kandy</option>
                <option>Galle</option>
              </select>
            </div>
            <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              Search Now
            </button>
          </div>

          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Popular:</span>
            {POPULAR.map((p) => (
              <button key={p} className="rounded-full border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse All Categories</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline">View All 30+ Categories →</a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              to="/services/$serviceId"
              params={{ serviceId: s.id }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {s.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.specialists}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top rated providers */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top Rated Providers</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline">View More →</a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_RATED.map((p) => (
            <div key={p.name} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-36" style={{ background: `linear-gradient(135deg, var(--primary) 0%, oklch(0.55 0.10 60) 100%)` }}>
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Top Rated</span>
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-foreground/80 px-2 py-1 text-[11px] font-semibold text-background">
                  <Star className="h-3 w-3 fill-current text-primary" /> {p.rating}
                </span>
              </div>
              <div className="space-y-2 p-4">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{p.title}</p>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {p.area}</p>
                <p className="text-xs text-success">✓ {p.avail}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm"><span className="text-lg font-bold">${p.price}</span><span className="text-xs text-muted-foreground">/hr</span></p>
                  <Link to="/book" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:px-10">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Upgrade to Gold Membership</h3>
            <p className="mt-1 text-sm opacity-90">Enjoy 0% service fees, priority booking, and extended warranties.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-sm hover:opacity-90 transition-opacity">
            Subscribe to Gold — $29.99/mo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
          {[
            { icon: "🛡️", title: "Secure Escrow", desc: "Payment held safely until you confirm the job is complete to your satisfaction." },
            { icon: "⭐", title: "Verified Pros", desc: "Every professional undergoes a rigorous 5-step background and certification check." },
            { icon: "🕒", title: "24/7 Support", desc: "Our dedicated support team is always ready to assist with any project needs." },
          ].map((t) => (
            <div key={t.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{t.icon}</div>
              <p className="mt-3 font-semibold">{t.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
