import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Filter, MapPin, Clock, Star, Bell,
  LayoutDashboard, ShieldCheck, Activity, Wallet as WalletIcon,
  Settings, LifeBuoy, LogOut,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { SERVICES } from "@/lib/services-data";

type Tab = "dashboard" | "security" | "system" | "wallet" | "preferences" | "support";

export function HomeownerDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-muted/40 text-foreground flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">FN</span>
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="hover:text-foreground transition-colors">Find Services</a>
            <a href="#" className="hover:text-foreground transition-colors">My Wallet</a>
            <a href="#" className="hover:text-foreground transition-colors">Go Gold</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden text-right text-xs sm:block">
              <p className="font-semibold">Alex Johnson</p>
              <p className="text-muted-foreground">Premium Member</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">AJ</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between">
          <nav className="space-y-1 text-sm">
            <SideItem icon={LayoutDashboard} label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
            <SideItem icon={ShieldCheck} label="Security Check" active={tab === "security"} onClick={() => setTab("security")} />
            <SideItem icon={Activity} label="System Health" active={tab === "system"} onClick={() => setTab("system")} />
            <SideItem icon={WalletIcon} label="Wallet" active={tab === "wallet"} onClick={() => setTab("wallet")} />
            <SideItem icon={Settings} label="Preferences" active={tab === "preferences"} onClick={() => setTab("preferences")} />
            <div className="my-3 border-t border-border" />
            <SideItem icon={LifeBuoy} label="Support" active={tab === "support"} onClick={() => setTab("support")} />
          </nav>
          <button className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="min-w-0">
          {tab === "dashboard" && <DashboardView />}
          {tab === "security" && <SecurityView />}
          {tab === "system" && <SystemHealthView />}
          {tab === "wallet" && <WalletView />}
          {tab === "preferences" && <PlaceholderView title="Preferences" desc="Manage your account preferences." />}
          {tab === "support" && <PlaceholderView title="Support" desc="Get help from our team." />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function SideItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
        active ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardView() {
  const services = SERVICES.slice(0, 6);
  const providers = [
    { name: "Marcus Sterling", title: "Master Plumber", area: "Downtown Brooklyn", avail: "Within 2 hours", price: 85, rating: 4.9, color: "oklch(0.42 0.04 55)" },
    { name: "Elena Rodriguez", title: "Electrical Specialist", area: "Queens Village", avail: "Today", price: 95, rating: 4.8, color: "oklch(0.55 0.10 60)" },
    { name: "James Wilson", title: "HVAC & Cooling", area: "Manhattan Heights", avail: "Scheduled", price: 120, rating: 5.0, color: "oklch(0.78 0.14 75)" },
    { name: "Sarah Chen", title: "Professional Painter", area: "Jersey City", avail: "Within 24 hours", price: 65, rating: 4.7, color: "oklch(0.88 0.06 70)" },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-card p-8 text-center">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Trusted by 50,000+ homeowners
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          What do you need <span className="text-primary">fixed</span> today?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Connect with certified local professionals for everything from emergency leaks to high-end home renovations.
        </p>
        <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Try 'Emergency Plumber' or 'Wall Painting'…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
          <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Find Help</button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Explore Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">Specialized help for every corner of your home</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-primary hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {services.map((s) => (
            <Link key={s.id} to="/services/$serviceId" params={{ serviceId: s.id }} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center hover:bg-muted/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{s.emoji}</div>
              <p className="text-xs font-medium">{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">↗ Highly Recommended</p>
            <h2 className="mt-1 text-2xl font-bold">Top Rated Professionals</h2>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => (
            <div key={p.name} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-32" style={{ backgroundColor: p.color }}>
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-bold">
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {p.rating}
                </span>
              </div>
              <div className="space-y-1.5 p-4">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs font-bold text-primary">{p.title}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {p.area}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {p.avail}</p>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <p className="text-xs"><span className="text-base font-bold">${p.price}</span><span className="text-muted-foreground">/hr</span></p>
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-opacity">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Security ---------------- */
function SecurityView() {
  const checklist = [
    { icon: "✅", title: "Strong Password", desc: "Last changed 32 days ago", status: "Passed", tone: "ok" },
    { icon: "✅", title: "Email Verified", desc: "alex@example.com", status: "Verified", tone: "ok" },
    { icon: "⚠️", title: "Two-Factor Auth", desc: "Not yet enabled — recommended", status: "Disabled", tone: "warn" },
    { icon: "✅", title: "Phone Verified", desc: "+94 77 123 4567", status: "Verified", tone: "ok" },
    { icon: "🔴", title: "Recovery Email", desc: "Backup email not set", status: "Missing", tone: "bad" },
  ];
  const toneCls = (t: string) =>
    t === "ok" ? "text-emerald-600 bg-emerald-50" : t === "warn" ? "text-amber-700 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Check</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review your account security status and manage authentication settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: "conic-gradient(rgb(16 185 129) 0 288deg, rgb(229 231 235) 288deg 360deg)" }}>
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card">
              <span className="text-3xl font-bold text-emerald-600">80</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          <p className="mt-4 font-bold">Security Score</p>
          <p className="text-xs text-muted-foreground">Good — a few improvements recommended</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Security Checklist</p>
          <div className="mt-4 space-y-2">
            {checklist.map((c) => (
              <div key={c.title} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${toneCls(c.tone)}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Two-Factor Authentication</p>
        <p className="mt-2 text-sm text-muted-foreground">Enable 2FA to add an extra layer of protection to your account.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "📱", t: "SMS / OTP", d: "One-time code sent to your registered phone number", active: true },
            { icon: "🔑", t: "Authenticator App", d: "Use Google Authenticator or Authy for secure TOTP codes" },
            { icon: "📧", t: "Email OTP", d: "Verification code delivered to your email inbox" },
            { icon: "🛡️", t: "Security Key", d: "Hardware FIDO2 key (YubiKey) for strongest protection" },
          ].map((o) => (
            <div key={o.t} className={`rounded-xl border p-4 ${o.active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <div className="text-xl">{o.icon}</div>
              <p className="mt-2 font-semibold text-sm">{o.t}</p>
              <p className="text-[11px] text-muted-foreground">{o.d}</p>
            </div>
          ))}
        </div>
        <button className="mt-5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90">Enable 2FA Now</button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Change Password</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Current Password" type="password" defaultValue="********" />
          <Input label="New Password" type="password" placeholder="Create strong password" />
          <div className="sm:col-span-2"><Input label="Confirm New Password" type="password" placeholder="Re-enter new password" /></div>
        </div>
        <button className="mt-5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90">Update Password</button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Recent Login Activity</p>
        <div className="mt-4 space-y-2">
          {[
            { t: "Chrome on Windows · Colombo, LK", d: "IP: 203.91.xx.xx · Current session", w: "Just now", dot: "bg-emerald-500" },
            { t: "Safari on iPhone 14 · Colombo, LK", d: "IP: 203.91.xx.xx · Signed out", w: "2 days ago", dot: "bg-muted-foreground" },
            { t: "Firefox on Mac · Colombo, LK", d: "IP: 112.134.xx.xx · Signed out", w: "5 days ago", dot: "bg-muted-foreground" },
            { t: "Chrome on Android · Negombo, LK", d: "IP: 202.21.xx.xx · Signed out", w: "12 days ago", dot: "bg-muted-foreground" },
          ].map((l) => (
            <div key={l.t} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${l.dot}`} />
                <div>
                  <p className="text-sm font-semibold">{l.t}</p>
                  <p className="text-[11px] text-muted-foreground">{l.d}</p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">{l.w}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- System Health ---------------- */
function SystemHealthView() {
  const stats = [
    { icon: "🟢", v: "99.9%", l: "Platform Uptime" },
    { icon: "⚡", v: "142ms", l: "Avg. Response" },
    { icon: "👥", v: "1,284", l: "Active Users Now" },
    { icon: "📋", v: "47", l: "Jobs In Progress" },
  ];
  const services = [
    { icon: "🔍", t: "Booking Engine", d: "Live search and matching", v: "99.9%" },
    { icon: "💳", t: "Payment Gateway", d: "Stripe / Local bank processing", v: "100%" },
    { icon: "📍", t: "GPS Tracking", d: "Real-time provider location", v: "99.7%" },
    { icon: "🔔", t: "Notifications", d: "Email / SMS / Push alerts", v: "97.4% ⚠" },
    { icon: "🗄️", t: "Database", d: "MySQL primary & replica", v: "100%" },
  ];
  const metrics = [
    { l: "API Response Time", v: "142ms (Good)", pct: 30, c: "bg-emerald-500" },
    { l: "Server CPU Usage", v: "34%", pct: 34, c: "bg-amber-500" },
    { l: "Memory Usage", v: "61%", pct: 61, c: "bg-orange-600" },
    { l: "Storage Used", v: "45%", pct: 45, c: "bg-amber-500" },
    { l: "Error Rate", v: "0.03% (Excellent)", pct: 5, c: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Health</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live platform status, performance metrics and service uptime monitoring</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-2xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Core Services Status</p>
          <div className="mt-4 space-y-2">
            {services.map((s) => (
              <div key={s.t} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.t}</p>
                    <p className="text-[11px] text-muted-foreground">{s.d}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">{s.v} •</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Performance Metrics</p>
          <div className="mt-4 space-y-4">
            {metrics.map((m) => (
              <div key={m.l}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{m.l}</span>
                  <span className="text-muted-foreground">{m.v}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${m.c}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Recent Platform Activity</p>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            { d: "bg-emerald-500", t: "✅ Booking #FIN-0847 completed — Plumbing · Colombo", w: "5 minutes ago" },
            { d: "bg-amber-600", t: "💳 Payment of Rs. 4,200 processed successfully", w: "18 minutes ago" },
            { d: "bg-blue-500", t: "📍 Provider Rajan Perera en route — ETA 12 mins", w: "31 minutes ago" },
            { d: "bg-amber-500", t: "⚠ Notification delivery slight delay — SMS queue", w: "1 hour ago" },
            { d: "bg-emerald-500", t: "💾 Daily backup completed successfully", w: "2 hours ago" },
          ].map((a) => (
            <li key={a.t} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${a.d}`} />
              <div>
                <p className="font-semibold">{a.t}</p>
                <p className="text-[11px] text-muted-foreground">{a.w}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Backup & Data Status</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "💾", t: "Full Backup", d: "Last: Sun 02:00 AM", s: "✓ OK", bg: "bg-emerald-50" },
            { icon: "📁", t: "Incremental", d: "Last: Today 01:00 AM", s: "✓ OK", bg: "bg-emerald-50" },
            { icon: "🔄", t: "Live Replication", d: "Mirror: Active", s: "● Live", bg: "bg-blue-50" },
          ].map((b) => (
            <div key={b.t} className={`rounded-xl p-4 text-center ${b.bg}`}>
              <div className="text-2xl">{b.icon}</div>
              <p className="mt-1 font-bold">{b.t}</p>
              <p className="text-[11px] text-muted-foreground">{b.d}</p>
              <p className="mt-1 text-xs font-semibold">{b.s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Wallet ---------------- */
function WalletView() {
  const txs = [
    { icon: "🔧", t: "Plumbing — Faucet Repair", d: "Marcus Sterling · 23 May 2026", s: "Completed", a: "− Rs. 4,200", neg: true },
    { icon: "⚡", t: "Electrical — Switch Installation", d: "Elena Rodriguez · 20 May 2026", s: "Completed", a: "− Rs. 3,800", neg: true },
    { icon: "❄️", t: "HVAC — AC Service", d: "James Wilson · 18 May 2026", s: "In Escrow", a: "− Rs. 7,500", neg: true },
    { icon: "💰", t: "Wallet Top-Up", d: "Bank Transfer · 15 May 2026", s: "Credit", a: "+ Rs. 50,000", neg: false },
    { icon: "↩️", t: "Refund — Cancelled Booking", d: "Painting Service · 10 May 2026", s: "Refunded", a: "+ Rs. 2,000", neg: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your balance, transactions and payment methods</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.32_0.05_55)] to-[oklch(0.42_0.08_55)] p-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-75">Available Balance</p>
          <p className="mt-2 text-3xl font-bold">Rs. 124,050</p>
          <p className="mt-1 text-xs opacity-75">FixItNow Escrow Wallet · Gold Member</p>
          <div className="mt-5 flex gap-2">
            <button className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-foreground">+ Add Funds</button>
            <button className="flex-1 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">Withdraw</button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-2xl">📊</div>
          <p className="mt-2 text-2xl font-bold">Rs. 428,000</p>
          <p className="text-xs text-muted-foreground">Total Spent (All Time)</p>
          <p className="mt-2 text-xs text-emerald-600">↑ Rs. 12,400 this month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-2xl">🔁</div>
          <p className="mt-2 text-2xl font-bold">Rs. 18,500</p>
          <p className="text-xs text-muted-foreground">In Escrow (Active Jobs)</p>
          <p className="mt-2 text-xs text-primary">3 jobs in progress</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Recent Transactions</p>
            <button className="rounded-lg border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">View All</button>
          </div>
          <div className="mt-4 space-y-2">
            {txs.map((t) => (
              <div key={t.t} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg">{t.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{t.t}</p>
                    <p className="text-[11px] text-muted-foreground">{t.d}</p>
                    <p className="text-[10px] font-bold text-primary">{t.s}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.neg ? "text-foreground" : "text-emerald-600"}`}>{t.a}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Payment Methods</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary bg-primary/10 p-3">
                <div className="text-xl">💳</div>
                <p className="mt-1 text-sm font-bold">Visa ···· 4242</p>
                <p className="text-[10px] text-muted-foreground">Expires 08/27 · Default</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-xl">🏦</div>
                <p className="mt-1 text-sm font-bold">Bank Transfer</p>
                <p className="text-[10px] text-muted-foreground">Sampath Bank</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-xl">📱</div>
                <p className="mt-1 text-sm font-bold">Dialog Genie</p>
                <p className="text-[10px] text-muted-foreground">Mobile Wallet</p>
              </div>
              <button className="rounded-xl border border-dashed border-border p-3 text-center text-xs font-semibold text-muted-foreground hover:bg-muted">
                <p className="text-xl">+</p>Add Method
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Gold Member Benefits</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>⭐ 0% platform service fee on all bookings</li>
              <li>⭐ Priority booking — skip the queue</li>
              <li>⭐ Extended 6-month workmanship warranty</li>
              <li>⭐ Dedicated Gold support line</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function PlaceholderView({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        Coming soon.
      </div>
    </div>
  );
}

function Input({ label, type = "text", defaultValue, placeholder }: { label: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
