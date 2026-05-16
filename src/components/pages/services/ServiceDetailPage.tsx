import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, Star, Shield } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { getService } from "@/lib/services-data";

export function ServiceDetailPage() {
  const { serviceId } = useParams({ from: "/services/$serviceId" });
  const service = getService(serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <h1 className="text-2xl font-semibold">Service not found</h1>
          <Link to="/services" className="mt-4 inline-block text-primary hover:underline">Back to services →</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ratingBreakdown = [
    { stars: 5, count: 338 },
    { stars: 4, count: 49 },
    { stars: 3, count: 16 },
    { stars: 2, count: 5 },
    { stars: 1, count: 4 },
  ];
  const totalReviews = ratingBreakdown.reduce((a, b) => a + b.count, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/services" className="hover:text-foreground">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{service.name}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{service.name} Service</span>
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Hero card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-56 bg-gradient-to-br from-primary to-foreground p-6 sm:h-72">
                <span className="absolute left-6 bottom-20 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur">
                  <span>{service.emoji}</span> {service.name}
                </span>
                <h1 className="absolute left-6 bottom-6 text-2xl font-bold text-background sm:text-3xl">
                  {service.name} Service
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b border-border p-6 sm:grid-cols-4">
                {[
                  { v: service.totalSpecialists.toLocaleString(), l: "Specialists" },
                  { v: service.avgRating.toFixed(1), l: "Avg Rating" },
                  { v: service.avgResponse, l: "Avg Response" },
                  { v: `$${service.startingPrice}`, l: "Starting /hr" },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="text-xl font-bold text-primary sm:text-2xl">{s.v}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 p-6">
                <h2 className="font-bold">About This Service</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  All work is covered by the FixItNow 1-Year Guarantee. If the same issue recurs within 12 months, we return at no additional cost.
                </p>
                <div className="rounded-xl bg-muted/60 p-5">
                  <p className="text-sm font-bold">What's Typically Included</p>
                  <ul className="mt-3 space-y-2">
                    {service.included.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">✓</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Providers */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-bold">Available Providers for This Service</h2>
              <div className="mt-4 space-y-3">
                {service.providers.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg" style={{ backgroundColor: p.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs font-medium text-primary">{p.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        ★ {p.rating} · {p.reviews} reviews · {p.distance} · {p.availability}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm"><span className="text-lg font-bold">${p.hourly}</span><span className="text-xs text-muted-foreground">/hr</span></p>
                      <button className="mt-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        Book →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-bold">Customer Reviews</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-[160px_1fr]">
                <div>
                  <p className="text-5xl font-bold">{service.avgRating.toFixed(1)}</p>
                  <div className="mt-1 flex gap-0.5 text-primary">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>
                <div className="space-y-1.5">
                  {ratingBreakdown.map((r) => (
                    <div key={r.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-3 text-muted-foreground">{r.stars}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${(r.count / totalReviews) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-5 border-t border-border pt-5">
                {service.reviews.map((r) => (
                  <div key={r.name} className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-background" style={{ backgroundColor: r.color }}>{r.initials}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                        <div className="flex gap-0.5 text-primary">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-2xl font-bold">{service.priceRange}<span className="text-sm font-medium text-muted-foreground">/hr</span></p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-1 text-xs font-semibold text-foreground">
                ✓ 6 providers available now
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold">Select Service Type</label>
                  <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option>Standard Service</option>
                    <option>Emergency Repair</option>
                    <option>Installation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">Preferred Date & Time</label>
                  <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option>As soon as possible</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Pick a date…</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">Describe the Issue</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Burst pipe under kitchen sink…"
                    className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <button className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">
                  Book Now — Instant Confirmation
                </button>
                <p className="flex items-start gap-1.5 rounded-lg bg-success/15 px-3 py-2 text-[11px] text-foreground">
                  <Shield className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  Payment held in escrow — released only when you confirm satisfaction.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
