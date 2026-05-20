import { Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, DollarSign, Trophy, Lock, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

const stats = [
  { n: "50K+", l: "Active homeowners" },
  { n: "12K+", l: "Verified professionals" },
  { n: "4.9/5", l: "Average rating" },
  { n: "99%", l: "Satisfaction rate" },
];

const values = [
  { icon: ShieldCheck, title: "Trust First", desc: "Every provider is background-checked, licence-verified and skill-assessed before joining. We never compromise on standards." },
  { icon: Zap, title: "Instant Response", desc: "Our Smart Match algorithm connects you with available professionals in under 12 minutes for emergencies." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "No surprises. You see the full cost breakdown — labour, materials, platform fee — before confirming a booking." },
  { icon: Trophy, title: "Excellence", desc: "Our reputation system ensures only the best professionals rise to the top, earning Top Rated status." },
  { icon: Lock, title: "Secure Payments", desc: "Bank-grade encryption on every transaction. Funds only release when you are satisfied." },
  { icon: Globe, title: "Community", desc: "We are building a better ecosystem for homeowners and tradespeople — fair rates and instant payouts." },
];

const team = [
  { initials: "CH", name: "Chanupa Hansaja", role: "Project Lead" },
  { initials: "MP", name: "M. Piriyatharsan", role: "Backend Developer" },
  { initials: "JS", name: "Janindu Sathsara", role: "Frontend Developer" },
  { initials: "PR", name: "Pasan Rashmika", role: "UI/UX Designer" },
];

const promise = [
  "Verified background checks",
  "Secure escrow payments",
  "24/7 dispute resolution",
  "1-year FixItNow guarantee",
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          About FixItNow
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ lineHeight: 1.05 }}>
          Connecting Homes with<br />
          <span className="text-primary">Trusted Experts</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
          Since 2024, FixItNow has been the gold standard in home repair — vetted professionals,
          secure payments, and guaranteed results.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold text-primary sm:text-4xl">{s.n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                FixItNow was founded to solve a fundamental problem: homeowners couldn't reliably find,
                book, or trust home repair professionals. We built a platform that changes that — with
                real-time tracking, secure escrow payments, and a rigorous vetting process.
              </p>
              <p>
                Every provider on our network undergoes identity verification, professional licence
                checks, background screening, and skills assessment before their first booking. Your
                home deserves nothing less.
              </p>
              <p>
                We are not just a marketplace. We are a full-stack home maintenance partner — from
                the first search to the final payment release.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg">
            <h3 className="text-xl font-bold">The FixItNow Promise</h3>
            <p className="mt-3 text-sm opacity-90">
              Funds are held in escrow and only released when you confirm satisfaction. No exceptions.
            </p>
            <ul className="mt-6 space-y-3">
              {promise.map((p) => (
                <li key={p} className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Values</h2>
            <p className="mt-3 text-muted-foreground">Every decision we make comes back to these principles.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built by Group C</h2>
        <p className="mt-3 text-muted-foreground">A dedicated team committed to making home repair hassle-free.</p>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {team.map((m, i) => {
            const colors = ["bg-primary", "bg-purple-500", "bg-emerald-600", "bg-rose-600"];
            return (
              <div key={i}>
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-bold text-white ${colors[i]}`}>
                  {m.initials}
                </div>
                <p className="mt-4 font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Find Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
