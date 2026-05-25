import { Link } from "@tanstack/react-router";
import { Search, Bell, Filter, MapPin, Clock, Star, Wrench } from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { SERVICES } from "@/lib/services-data";

export function HomeownerDashboard() {
  const services = SERVICES.slice(0, 6);
  const providers = [
    { name: "Marcus Sterling", title: "Master Plumber", area: "Downtown Brooklyn", avail: "Within 2 hours", price: 85, rating: 4.9, color: "oklch(0.42 0.04 55)" },
    { name: "Elena Rodriguez", title: "Electrical Specialist", area: "Queens Village", avail: "Today", price: 95, rating: 4.8, color: "oklch(0.55 0.10 60)" },
    { name: "James Wilson", title: "HVAC & Cooling", area: "Manhattan Heights", avail: "Scheduled", price: 120, rating: 5.0, color: "oklch(0.78 0.14 75)" },
    { name: "Sarah Chen", title: "Professional Painter", area: "Jersey City", avail: "Within 24 hours", price: 65, rating: 4.7, color: "oklch(0.88 0.06 70)" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center sm:py-20">
          <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Trusted by 50,000+ homeowners
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            What do you need <span className="text-primary">fixed</span> today?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Connect with certified local professionals for everything from emergency leaks to high-end home renovations.
          </p>
          <div className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Try 'Emergency Plumber' or 'Wall Painting'…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
            <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Find Help</button>
          </div>
          <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Popular:</span>
            {["Faucet Repair", "AC Maintenance", "Garden Design", "Roofing"].map((p) => (
              <a key={p} href="#" className="text-primary hover:underline">{p}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Services */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Explore Services</h2>
              <p className="mt-1 text-sm text-muted-foreground">Specialized help for every corner of your home</p>
            </div>
            <Link to="/services" className="text-sm font-medium text-primary hover:underline">View All Categories →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {services.map((s) => (
              <Link key={s.id} to="/services/$serviceId" params={{ serviceId: s.id }} className="flex flex-col items-center gap-2 rounded-xl border border-transparent p-3 text-center hover:border-border hover:bg-muted/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{s.emoji}</div>
                <p className="text-xs font-medium">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">↗ Highly Recommended</p>
              <h2 className="mt-2 text-2xl font-bold">Top Rated Professionals</h2>
              <p className="mt-1 text-sm text-muted-foreground">Hand-picked providers with exceptional service history</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors">
                <Filter className="h-3.5 w-3.5" /> Filter Results
              </button>
              <Link to="/services" className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">View More</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((p) => (
              <div key={p.name} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-32" style={{ backgroundColor: p.color }}>
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-bold">
                    <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {p.rating}
                  </span>
                  <span className="absolute left-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                    ✓ Verified Pro
                  </span>
                </div>
                <div className="space-y-1.5 p-4">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs font-bold text-primary">{p.title}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {p.area}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> Availability: {p.avail}</p>
                  <div className="flex items-center justify-between border-t border-border pt-2.5">
                    <p className="text-xs"><span className="text-base font-bold">${p.price}</span><span className="text-muted-foreground">/hr</span></p>
                    <button className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-opacity">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10">
          <div className="grid items-center gap-6 sm:grid-cols-[1.5fr_1fr]">
            <div>
              <h3 className="text-2xl font-bold">Upgrade to Gold Membership</h3>
              <p className="mt-2 max-w-md opacity-90">Enjoy <b>0% service fees</b>, priority booking, and extended 12-month warranties on all repairs.</p>
              <button className="mt-5 rounded-xl bg-background px-5 py-3 text-sm font-bold text-foreground hover:opacity-90 transition-opacity">Discover Gold Benefits</button>
            </div>
            <div className="hidden rounded-2xl bg-background/15 p-6 backdrop-blur sm:block">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20 font-bold">G</div>
              <p className="mt-3 font-bold">FixItNow Gold</p>
              <p className="text-xs opacity-75">Premium Service Tier</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DashHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={2.5} />
          <span className="text-base font-bold tracking-tight sm:text-lg">FixItNow</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/services" className="hover:text-foreground">Find Services</Link>
          <a href="#" className="hover:text-foreground">My Wallet</a>
          <a href="#" className="hover:text-foreground">Go Gold</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 hover:bg-muted">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-muted transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">AJ</div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-tight">Alex Johnson</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Premium Member</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
