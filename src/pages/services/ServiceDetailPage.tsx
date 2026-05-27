import { Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Search, MapPin, Star, Shield, CheckCircle2, Zap, Clock, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { getService } from "@/lib/services-data";

const DISTRICTS = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Negombo"];
const TIMES = ["Morning (8 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)", "ASAP"];

export function ServiceDetailPage() {
  const { serviceId } = useParams({ from: "/services/$serviceId/" });
  const service = getService(serviceId);

  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!service) return [];
    return service.providers.filter((p) => {
      if (query && !`${p.name} ${p.title}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === "rated" && !p.topRated) return false;
      if (filter === "available" && !p.availability.toLowerCase().includes("available")) return false;
      return true;
    });
  }, [service, filter, query]);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner */}
      <section
        className="relative overflow-hidden text-background"
        style={{ background: "linear-gradient(135deg, oklch(0.42 0.10 60) 0%, oklch(0.32 0.06 50) 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-14 sm:pt-12 sm:pb-20">
          <nav className="flex items-center gap-1.5 text-xs text-background/70">
            <Link to="/" className="hover:text-background">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-background">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-background">{service.name}</span>
          </nav>

          <div className="mt-6 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/15 text-3xl backdrop-blur">
                {service.emoji}
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">{service.name} Services</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/15 px-3 py-1 font-semibold backdrop-blur"><Star className="h-3 w-3 fill-current" /> Top Category</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background/15 px-3 py-1 font-semibold backdrop-blur">✓ {service.totalSpecialists.toLocaleString()}+ Specialists</span>
                <span className="opacity-90">{service.avgRating} avg. rating</span>
                <span className="opacity-50">·</span>
                <span className="opacity-90">{service.jobsDone.toLocaleString()}+ jobs done</span>
              </div>
            </div>

            <div className="rounded-2xl bg-background/95 p-5 text-foreground shadow-xl backdrop-blur sm:min-w-[240px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Starting From</p>
              <p className="mt-1.5 text-3xl font-bold">Rs. {service.startingPrice.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">/service</span></p>
              <Link to="/book" className="mt-4 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">Book Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-10">
            {/* Sub-services */}
            <div>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-primary">{service.name} Sub-Services</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.subServices.map((s) => (
                  <Link
                    key={s.id}
                    to="/services/$serviceId/$subServiceId"
                    params={{ serviceId: service.id, subServiceId: s.id }}
                    className="rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">{s.emoji}</div>
                    <p className="mt-3 font-semibold">{s.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                    <p className="mt-3 text-sm"><span className="font-bold text-primary">Rs. {s.priceFrom.toLocaleString()}</span> <span className="text-xs text-muted-foreground">onwards</span></p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Providers */}
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">Available {service.name === "Plumbing" ? "Plumbers" : "Specialists"} Near You</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or specialty…"
                    className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>
                <select className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none">
                  <option>Sort: Top Rated</option>
                  <option>Sort: Nearest</option>
                  <option>Sort: Lowest Price</option>
                </select>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "available", label: "Available Now" },
                  { id: "rated", label: "Top Rated" },
                  { id: "near", label: "Within 5km" },
                  { id: "cheap", label: "Rs. under 2500/hr" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      filter === f.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {filtered.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-background" style={{ backgroundColor: p.color }}>{p.initials}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{p.title}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                          {p.topRated && <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">⭐ Top Rated</span>}
                          {p.verified && <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 font-semibold text-foreground">✓ Verified</span>}
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-center sm:max-w-md">
                          <Stat v={p.rating.toFixed(1)} l="Rating" />
                          <Stat v={p.jobsDone.toString()} l="Jobs Done" />
                          <Stat v={p.experience} l="Experience" />
                        </div>
                        <div className="mt-3 space-y-1 text-xs">
                          <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {p.area} · {p.distance}</p>
                          <p className="text-success">✓ {p.availability}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <p className="text-sm"><span className="text-lg font-bold">Rs. {p.hourly.toLocaleString()}</span><span className="text-xs text-muted-foreground"> /hr</span></p>
                      <Link to="/book" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity">Book Now</Link>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No providers match those filters.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold">
                <span className="text-base">🛠️</span> Quick Book a {service.name === "Plumbing" ? "Plumber" : "Specialist"}
              </p>
              <div className="mt-4 space-y-3">
                <Field label="Service Type">
                  <select className={inputCls}>
                    {service.subServices.map((s) => <option key={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Date">
                  <input type="date" className={inputCls} />
                </Field>
                <Field label="Preferred Time">
                  <select className={inputCls}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
                </Field>
                <Field label="Your District">
                  <select className={inputCls}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select>
                </Field>
                <button className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
                  Find & Book Now →
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Why Choose FixItNow?</p>
              <ul className="mt-3 space-y-2.5 text-xs">
                <Perk icon={<Shield className="h-3.5 w-3.5" />} text="Secure escrow payment — released only after job completion" />
                <Perk icon={<CheckCircle2 className="h-3.5 w-3.5" />} text="All providers verified with NIC and trade certificates" />
                <Perk icon={<MapPin className="h-3.5 w-3.5" />} text="Live GPS tracking once your provider is on the way" />
                <Perk icon={<Star className="h-3.5 w-3.5" />} text="Rate your experience after every job" />
                <Perk icon={<Clock className="h-3.5 w-3.5" />} text="24/7 customer support for any issue" />
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Frequently Asked Questions</p>
              <div className="mt-3 divide-y divide-border">
                {service.faqs.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={f.q}>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left text-xs font-semibold"
                      >
                        {f.q}
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && <p className="pb-3 text-xs leading-relaxed text-muted-foreground">{f.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <p className="text-base font-bold text-primary">{v}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}

function Perk({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2 text-foreground">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">{icon}</span>
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
