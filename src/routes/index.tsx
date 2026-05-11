import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, ArrowRight, Phone, Mail, Printer, MapPin } from "lucide-react";
import electrician from "@/assets/service-electrician.jpg";
import mason from "@/assets/service-mason.jpg";
import plumber from "@/assets/service-plumber.jpg";
import carpenter from "@/assets/service-carpenter.jpg";
import painter from "@/assets/service-painter.jpg";
import hvac from "@/assets/service-hvac.jpg";
import welder from "@/assets/service-welder.jpg";
import cleaner from "@/assets/service-cleaner.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "FixItNow — Trusted home service professionals on demand" },
      { name: "description", content: "Book electricians, plumbers, masons, carpenters and more. FixItNow connects you with verified local professionals in minutes." },
    ],
  }),
});

const services = [
  { name: "Electrician", img: electrician, desc: "Wiring, repairs, installations." },
  { name: "Mason", img: mason, desc: "Brickwork, plastering, tiling." },
  { name: "Plumber", img: plumber, desc: "Leaks, pipes, fixtures." },
  { name: "Carpenter", img: carpenter, desc: "Furniture, doors, custom builds." },
  { name: "Painter", img: painter, desc: "Interior & exterior painting." },
  { name: "HVAC Tech", img: hvac, desc: "AC service & installation." },
  { name: "Welder", img: welder, desc: "Gates, grills, metalwork." },
  { name: "Cleaner", img: cleaner, desc: "Deep & routine home cleaning." },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4">
      <nav className="flex h-16 items-center justify-between rounded-2xl border border-border/60 bg-card/90 px-5 backdrop-blur shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold tracking-tight">FixItNow</span>
        </Link>
        <div className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#news" className="hover:text-foreground transition-colors">News</a>
          <a href="#about" className="hover:text-foreground transition-colors">About Us</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Sign In</Link>
          <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-20">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Home Services, Simplified
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ lineHeight: 1.05 }}>
            Reliable repairs.<br />Right at your doorstep.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            FixItNow connects homeowners with verified local professionals — electricians, plumbers, masons,
            carpenters and more. Book in minutes. Pay on completion. Backed by our service guarantee.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity">
              Browse services <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Get started free
            </Link>
          </div>
        </div>
        <div id="about" className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">Why FixItNow</h2>
          <p>
            Every professional on our platform is background-checked, skill-verified, and rated by real customers.
            We make it effortless to find the right person for the job — whether you need a quick faucet fix or a
            full home renovation crew.
          </p>
          <p>
            Transparent pricing, real-time tracking, and instant chat with your tradesperson. No hidden fees,
            no shady contractors, no missed appointments. Just dependable help when you need it most.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { n: "10k+", l: "Jobs done" },
              { n: "500+", l: "Pros vetted" },
              { n: "4.9★", l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold text-foreground">{s.n}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our services</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find the right pro for any job</h2>
          </div>
          <a href="#" className="hidden text-sm font-medium text-primary hover:underline sm:inline">View all →</a>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.name} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.name}
                  width={640}
                  height={480}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                  {s.name}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="news" className="mx-auto max-w-6xl px-5 py-24">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 sm:p-14">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Get started</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.15 }}>
              Need a hand around the house?
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Sign up in seconds and book your first service today. Trusted pros, fair prices, zero hassle.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="h-7 w-7 text-primary" strokeWidth={2.5} />
              <span className="text-2xl font-bold">FixItNow</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-background/60">
              Trusted home service professionals, on demand.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/50">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#news" className="hover:text-primary transition-colors">News</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rate Us</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/50">Contact Us</p>
            <ul className="mt-4 space-y-2.5 text-sm text-background/80">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />0771234567 · 0767654321</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" />fixitnow@gmail.com</li>
              <li className="flex items-start gap-2"><Printer className="mt-0.5 h-4 w-4 text-primary" />Fax: +94761234567</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />University of Moratuwa, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Terms and Conditions</a>
            <a href="#" className="hover:text-background transition-colors">Privacy and Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
