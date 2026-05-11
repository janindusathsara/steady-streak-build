import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Infinity as InfinityIcon, Flame, CalendarDays, Moon, Bell, BarChart3, CloudUpload,
  CheckCircle2, TrendingUp, Sparkles, ArrowRight, Star, Quote,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import shadowBg from "@/assets/shadow-bg.jpg";


export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Continuum — Build lasting habits, one day at a time" },
      { name: "description", content: "A calm, focused habit tracker. Track streaks, visualize progress, and build your daily ritual. Free, ad-free, distraction-free." },
    ],
  }),
});

function LandingPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          navigate({ to: "/app" });
        } else {
          setChecked(true);
        }
      });
    }).catch(() => setChecked(true));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Features />
      <HowItWorks />
      <Reviews />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ─── Hero (dark, full-bleed, with navbar) ─── */
function Hero() {
  return (
    <>
      <section className="relative pb-24 pt-0 lg:pb-32 lg:pt-8 xl:pb-40 xl:pt-12" style={{ background: "#050d0a" }}>
        {/* Background image — weighted to the right */}
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
          aria-hidden="true"
        />
        {/* Left-side gradient for text legibility */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, rgba(5,13,10,0.5), rgba(5,13,10,0.13), transparent)` }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.26), transparent, rgba(5,13,10,0))` }} />

        {/* Navbar */}
        <nav className="relative z-20 max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <InfinityIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
            <span className="text-xl font-semibold text-white/90 tracking-tight">Continuum</span>
          </Link>

          <div className="hidden sm:flex items-center gap-8 text-sm text-white">
            <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white/70 transition-colors">How it works</a>
            <a href="#reviews" className="hover:text-white/70 transition-colors">Reviews</a>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 text-white px-5 py-2.5 text-sm font-medium hover:bg-white/20 backdrop-blur-sm transition-all duration-200 active:scale-[0.97]"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Hero content — left aligned */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-24 pb-12">
          <div className="max-w-xl">
            <ScrollReveal delay={80}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white text-left" style={{ lineHeight: "1.08" }}>
                Build lasting habits,<br />one day at a time
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="mt-6 text-lg text-white text-left" style={{ textWrap: "pretty", lineHeight: "1.6" }}>
                Continuum is a calm, focused habit tracker that helps you build consistency through streaks, visual progress, and zero distractions.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FDAA3E] text-[#1a1a1a] px-7 py-3.5 text-sm font-bold hover:bg-[#fdb95e] transition-all duration-200 active:scale-[0.97] shadow-lg shadow-[#FDAA3E]/25"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Features ─── */
const features = [
  { icon: Flame, title: "Streak tracking", desc: "Watch your momentum build day by day. Never break the chain." },
  { icon: CalendarDays, title: "Calendar heatmap", desc: "See your consistency at a glance with a beautiful 30-day view." },
  { icon: BarChart3, title: "Smart insights", desc: "Current streak, longest streak, completion rate — all the stats that matter." },
  { icon: Bell, title: "Gentle reminders", desc: "Set custom reminder times so you never forget your daily rituals." },
  { icon: Moon, title: "Dark mode", desc: "Easy on the eyes, day or night. Follows your system or your choice." },
  { icon: CloudUpload, title: "Cloud sync", desc: "Sign in to sync your habits across devices. Your data, always safe." },
];

function Features() {
  return (
    <section id="features" className="py-28 relative bg-white">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url(${shadowBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', opacity: 0.75 }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left: App preview — light mode on mint bg */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div className="relative">
              <div className="rounded-xl bg-white border border-black/[0.06] shadow-xl overflow-hidden">
                {/* Mock browser chrome */}
                <div className="border-b border-black/5 px-5 py-3 flex items-center gap-3 bg-gray-50/80">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                  </div>
                  <div className="flex-1" />
                </div>

                {/* Mock app content — light mode */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-black/40">Good morning</p>
                    <p className="text-lg font-semibold text-black/90 mt-0.5">Your daily ritual</p>
                    <p className="text-xs text-black/40 mt-1">Tuesday, March 25 · 2 of 4 minted</p>
                  </div>

                  {/* Mock progress ring */}
                  <div className="flex justify-center py-3">
                    <div className="w-20 h-20 rounded-full border-[4px] border-black/[0.06] flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="35" fill="none" strokeWidth="4" stroke="#FDAA3E" strokeDasharray="220" strokeDashoffset="110" strokeLinecap="round" />
                      </svg>
                      <span className="text-lg font-bold text-black/80">50%</span>
                    </div>
                  </div>

                  {/* Mock habit cards */}
                  {[
                    { name: "Morning meditation", color: "#FDAA3E", done: true },
                    { name: "Read 20 pages", color: "hsl(217, 91%, 60%)", done: true },
                    { name: "Exercise 30 min", color: "hsl(25, 95%, 53%)", done: false },
                    { name: "Journal", color: "hsl(270, 95%, 75%)", done: false },
                  ].map((h) => (
                    <div key={h.name} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                      <span className={`flex-1 text-sm ${h.done ? "line-through text-black/30" : "text-black/70"}`}>{h.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${h.done ? "bg-primary border-primary" : "border-black/15"}`}>
                        {h.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Features content */}
          <div className="flex-1">
            <ScrollReveal>
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Features</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.15" }}>
                  Everything you need,<br />nothing you don't
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 70}>
                  <div className="group rounded-2xl border border-black/[0.04] bg-black/[0.03] p-5 hover:bg-black/[0.05] hover:border-black/[0.08] transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─── */
const steps = [
  { num: "1", icon: CheckCircle2, title: "Create your habits", desc: "Add the habits you want to build — daily, specific days, or a weekly goal." },
  { num: "2", icon: Sparkles, title: "Tap to complete", desc: "One tap each day to log your progress. Quick, satisfying, done." },
  { num: "3", icon: TrendingUp, title: "Watch your growth", desc: "See streaks grow, heatmaps fill in, and your consistency compound over time." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-white border-y border-border/30">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.15" }}>
              Three steps to a better routine
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line between steps (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px border-t-2 border-dashed border-primary/20" />

          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 100}>
              <div className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 text-lg font-bold shadow-lg shadow-primary/15">
                  {s.num}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reviews ─── */
const reviews = [
  { name: "Daniel Cooper", role: "Product designer", avatar: "https://trovdwfeqyzlxzrtfbjv.supabase.co/storage/v1/object/public/assets/avatars/e20b66f6-e7e9-4c00-93d3-506c78cb66c2/avatar-19.jpg", quote: "Finally a habit app that doesn't try to be a social network. Just me and my habits.", rating: 5 },
  { name: "Emma Lindström", role: "Software engineer", avatar: "https://trovdwfeqyzlxzrtfbjv.supabase.co/storage/v1/object/public/assets/avatars/307e7512-1637-4ea2-a5cd-875afeb1002b/avatar-21.jpg", quote: "The streak tracking is addictive in the best way. I've been consistent for 47 days now.", rating: 5 },
  { name: "Ryan Mitchell", role: "Grad student", avatar: "https://trovdwfeqyzlxzrtfbjv.supabase.co/storage/v1/object/public/assets/avatars/6b77ccde-dbfd-4c23-8c9f-ce748683068a/avatar-16.jpg", quote: "Love the heatmap. Seeing my progress visually keeps me motivated more than any badge system.", rating: 5 },
  { name: "Mei Lin", role: "Freelance writer", avatar: "https://trovdwfeqyzlxzrtfbjv.supabase.co/storage/v1/object/public/assets/avatars/b706d9a7-3a45-4fdd-ab47-c7023d4d0cfa/avatar-20.jpg", quote: "Simple, clean, no ads. This is what every habit tracker should be. Dark mode is gorgeous too.", rating: 5 },
];

function Reviews() {
  return (
    <section id="reviews" className="py-28">
      <div className="max-w-5xl mx-auto px-5">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.15" }}>
              Loved by habit builders
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <ScrollReveal key={r.name} delay={i * 80}>
              <div className="relative rounded-2xl border border-border/50 bg-card p-6 overflow-hidden">
                {/* Decorative quote mark */}
                <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/[0.06] rotate-180" />

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5 relative">"{r.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-[4.5rem] h-[4.5rem] rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#050d0a" }}>
      {/* Reuse hero bg for visual cohesion */}
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050d0a] via-transparent to-[#050d0a] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white" style={{ lineHeight: "1.15" }}>
            Ready to build better habits?
          </h2>
          <p className="mt-4 text-white max-w-md mx-auto" style={{ textWrap: "pretty" }}>
            Join thousands of people using Continuum to build consistency, one day at a time.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDAA3E] text-[#1a1a1a] px-8 py-4 text-sm font-semibold hover:bg-[#fdb95e] transition-all duration-200 active:scale-[0.97] shadow-lg shadow-[#FDAA3E]/25"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <InfinityIcon className="w-6 h-6 text-foreground" strokeWidth={2.5} />
            <span className="font-semibold text-foreground text-sm">Continuum</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#reviews" className="hover:text-foreground transition-colors">Reviews</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Get started</Link>
          </div>

          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Continuum</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Scroll reveal wrapper (animations removed) ─── */
function ScrollReveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>;
}
