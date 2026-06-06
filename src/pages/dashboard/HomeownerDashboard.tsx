import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Filter, MapPin, Clock, Star, Bell, Wrench,
  LayoutGrid, ShieldCheck, Activity, Wallet as WalletIcon,
  Settings, LifeBuoy, LogOut, CalendarDays, MessageCircle, Phone, Mail, Home,
} from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { SERVICES } from "@/lib/services-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Tab = "dashboard" | "security" | "system" | "wallet" | "bookings" | "active" | "preferences" | "support";

export function HomeownerDashboard({ initialTab = "dashboard" }: { initialTab?: Tab } = {}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { profile } = useCurrentUser();
  const navigate = useNavigate();

  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">FixItNow</span>
          </Link>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            {username ? (
              <Link to="/$username/dashboard" params={{ username }} className="font-bold text-foreground">Home</Link>
            ) : (
              <Link to="/" className="font-bold text-foreground">Home</Link>
            )}
            <Link to="/services" className="hover:text-foreground">Services</Link>
            <Link to="/news" className="hover:text-foreground">News</Link>
            <Link to="/about" className="hover:text-foreground">About Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            {username ? (
              <Link
                to="/$username/notification"
                params={{ username }}
                className="relative rounded-full p-2 hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Link>
            ) : (
              <button className="relative rounded-full p-2 hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <div className="hidden text-right text-xs sm:block">
              <p className="font-bold text-foreground">{displayName}</p>
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Homeowner
              </span>
            </div>
            {username ? (
              <Link
                to="/$username/profile"
                params={{ username }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background hover:opacity-90"
                aria-label="My profile"
              >
                {initials}
              </Link>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">{initials}</div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-5 py-6">
        {/* Sidebar */}
        <aside className="sticky top-[73px] hidden h-[calc(100vh-89px)] w-60 shrink-0 flex-col md:flex">
          <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-4 text-primary-foreground shadow-sm">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <p className="text-sm font-bold">Welcome Home</p>
            </div>
            <p className="mt-1 text-xs font-semibold">{displayName}</p>
            <p className="text-[11px] opacity-80">Your trusted service hub</p>
          </div>

          <nav className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4">
            <NavGroup label="Main">
              <SideLink icon={LayoutGrid} label="Dashboard" to="/$username/dashboard" username={username} active={tab === "dashboard"} />
            </NavGroup>

            <NavGroup label="Bookings">
              <SideLink icon={Clock} label="Active Bookings" to="/$username/active-bookings" username={username} active={tab === "active"} />
              <SideLink icon={CalendarDays} label="Past Bookings" to="/$username/past-bookings" username={username} active={tab === "bookings"} />
            </NavGroup>

            <NavGroup label="Account">
              <SideLink icon={ShieldCheck} label="Security Check" to="/$username/security" username={username} active={tab === "security"} />
              <SideItem icon={Activity} label="System Health" active={tab === "system"} onClick={() => setTab("system")} />
              <SideLink icon={WalletIcon} label="Wallet" to="/$username/wallet" username={username} active={tab === "wallet"} />
              <SideItem icon={Settings} label="Preferences" active={tab === "preferences"} onClick={() => setTab("preferences")} />
            </NavGroup>

            <div className="pt-1">
              <SideItem icon={LifeBuoy} label="Support" active={tab === "support"} onClick={() => setTab("support")} />
            </div>
          </nav>

          <button onClick={handleLogout} className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          {tab === "dashboard" && <DashboardView />}
          {tab === "security" && <SecurityView />}
          {tab === "system" && <SystemHealthView />}
          {tab === "wallet" && <WalletView />}
          {tab === "bookings" && <PastBookingsView />}
          {tab === "active" && <ActiveBookingsView />}
          {tab === "preferences" && <PreferencesView />}
          {tab === "support" && <SupportView />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SideLink({ icon: Icon, label, to, username, active }: { icon: any; label: string; to: "/$username/dashboard" | "/$username/security" | "/$username/wallet" | "/$username/past-bookings" | "/$username/active-bookings"; username: string; active: boolean }) {
  const cls = `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
    active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
  if (!username) {
    return <span className={cls}><Icon className="h-4 w-4" /> {label}</span>;
  }
  return (
    <Link to={to} params={{ username }} className={cls}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function SideItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* ---------------- Active Bookings ---------------- */
function ActiveBookingsView() {
  const stats = [
    { icon: "⚙️", v: "3", l: "Active Now" },
    { icon: "🚗", v: "1", l: "En Route" },
    { icon: "🛠️", v: "2", l: "In Progress" },
    { icon: "💰", v: "Rs. 18,500", l: "In Escrow" },
  ];
  const bookings = [
    {
      icon: "❄️", iconBg: "bg-blue-100",
      title: "AC Service & Gas Refill", status: "In Progress", tone: "warn", ref: "#FIN-2026-08195",
      cat: "❄️ HVAC", date: "Today", time: "09:00 AM", addr: "42 Palm Grove, Colombo 3",
      provider: "James Wilson", pInit: "JW", phase: "Technician on-site · Refilling gas",
      eta: "Est. completion: 11:30 AM", price: "Rs. 7,500", pay: "Held in escrow",
      actions: ["Track Live", "Message"],
    },
    {
      icon: "🔧", iconBg: "bg-amber-100",
      title: "Kitchen Sink Leak Fix", status: "En Route", tone: "ok", ref: "#FIN-2026-08214",
      cat: "🔧 Plumbing", date: "Today", time: "01:30 PM", addr: "42 Palm Grove, Colombo 3",
      provider: "Marcus Sterling", pInit: "MS", phase: "Provider en route · ETA 18 mins",
      eta: "Arriving by 01:48 PM", price: "Rs. 4,800", pay: "Held in escrow",
      actions: ["Track Live", "Message"],
    },
    {
      icon: "⚡", iconBg: "bg-yellow-100",
      title: "Outdoor Light Installation", status: "Scheduled", tone: "info", ref: "#FIN-2026-08230",
      cat: "⚡ Electrical", date: "Tomorrow", time: "10:00 AM", addr: "42 Palm Grove, Colombo 3",
      provider: "Elena Rodriguez", pInit: "ER", phase: "Confirmed · Awaiting service date",
      eta: "Starts in 19 hours", price: "Rs. 6,200", pay: "Held in escrow",
      actions: ["Reschedule", "Cancel"],
    },
  ];
  const toneCls = (t: string) =>
    t === "ok" ? "bg-emerald-50 text-emerald-700" :
    t === "warn" ? "bg-amber-50 text-amber-700" :
    t === "info" ? "bg-blue-50 text-blue-700" : "bg-muted text-foreground";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live status of your ongoing and upcoming service jobs</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-2xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.ref} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${b.iconBg}`}>{b.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{b.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${toneCls(b.tone)}`}>{b.status}</span>
                <span className="text-[11px] text-muted-foreground">{b.ref}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>{b.cat}</span>
                <span>📅 {b.date}</span>
                <span>{b.time}</span>
                <span>📍 {b.addr}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">{b.pInit}</span>
                <span className="font-semibold">{b.provider}</span>
                <span className="text-primary">• {b.phase}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{b.eta}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold">{b.price}</p>
              <p className="text-[10px] text-muted-foreground">{b.pay}</p>
              <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                {b.actions.map((a, i) => (
                  <button key={a} className={`rounded-lg px-3 py-1.5 text-[10px] font-bold ${i === 0 ? "bg-foreground text-background" : "border border-border text-foreground hover:bg-muted"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardView() {
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
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
          <Link to="/$username/book" params={{ username: username }} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Find Help</Link>
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
                  <Link to="/$username/book" params={{ username: username }} className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-opacity">Book Now</Link>
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

/* ---------------- Past Bookings ---------------- */
function PastBookingsView() {
  const stats = [
    { icon: "📋", v: "24", l: "Total Bookings" },
    { icon: "✅", v: "20", l: "Completed" },
    { icon: "❌", v: "3", l: "Cancelled" },
    { icon: "💰", v: "Rs. 428K", l: "Total Spent" },
  ];
  const filters = ["All (24)", "Completed (20)", "Cancelled (3)", "In Dispute (1)"];
  const bookings = [
    {
      icon: "🔧", iconBg: "bg-amber-100",
      title: "Faucet & Tap Repair", status: "Completed", statusTone: "ok", ref: "#FIN-2026-08471",
      cat: "🔧 Plumbing", date: "23 May 2026", time: "10:00 AM", addr: "42 Palm Grove, Colombo 3", svcType: "⚡ On-the-Spot",
      provider: "Marcus Sterling", pInit: "MS", rating: "★★★★★ 4.9", review: "✓ Review Submitted",
      price: "Rs. 4,200", pay: "Paid via Visa ···· 4242", actions: ["Book Again", "Invoice"],
    },
    {
      icon: "⚡", iconBg: "bg-yellow-100",
      title: "Switch & Socket Installation", status: "Completed", statusTone: "ok", ref: "#FIN-2026-08310",
      cat: "⚡ Electrical", date: "20 May 2026", time: "02:00 PM", addr: "42 Palm Grove, Colombo 3", svcType: "📅 Scheduled",
      provider: "Elena Rodriguez", pInit: "ER", rating: "★★★★★ 4.8", review: "✓ Review Submitted",
      price: "Rs. 3,800", pay: "Paid via Wallet", actions: ["Book Again", "Invoice"],
    },
    {
      icon: "❄️", iconBg: "bg-blue-100",
      title: "AC Service & Gas Refill", status: "In Progress", statusTone: "warn", ref: "#FIN-2026-08195",
      cat: "❄️ HVAC", date: "18 May 2026", time: "09:00 AM", addr: "42 Palm Grove, Colombo 3", svcType: "⚡ On-the-Spot",
      provider: "James Wilson", pInit: "JW", rating: "★★★★☆ 4.6", review: "💰 Rs. 7,500 in Escrow",
      price: "Rs. 7,500", pay: "Escrow held", actions: ["Confirm Done", "Track"], highlight: true,
    },
    {
      icon: "🎨", iconBg: "bg-pink-100",
      title: "Interior Wall Painting", status: "Completed", statusTone: "ok", ref: "#FIN-2026-07882",
      cat: "🎨 Painting", date: "10 May 2026", time: "08:00 AM", addr: "42 Palm Grove, Colombo 3", svcType: "📅 Scheduled",
      provider: "Rajan Perera", pInit: "RP", rating: "★★★★★ 4.9", review: "⭐ Leave a Review",
      price: "Rs. 18,000", pay: "Paid via Visa ···· 4242", actions: ["Book Again", "Invoice"],
    },
    {
      icon: "🪚", iconBg: "bg-orange-100",
      title: "Cabinet Door Repair", status: "Cancelled", statusTone: "bad", ref: "#FIN-2026-07741",
      cat: "🪚 Carpentry", date: "3 May 2026", time: "11:00 AM", addr: "42 Palm Grove, Colombo 3",
      note: "Cancelled by homeowner · 2 hrs before job · Full refund issued",
      price: "Rs. 2,800", pay: "↩ Refunded", actions: ["Rebook"], strike: true,
    },
    {
      icon: "🚽", iconBg: "bg-cyan-100",
      title: "Toilet Flush & Cistern Fix", status: "Completed", statusTone: "ok", ref: "#FIN-2026-07530",
      cat: "🔧 Plumbing", date: "28 Apr 2026", time: "10:30 AM", addr: "42 Palm Grove, Colombo 3", svcType: "⚡ On-the-Spot",
      provider: "Marcus Sterling", pInit: "MS", rating: "★★★★★ 4.9", review: "✓ Review Submitted",
      price: "Rs. 2,200", pay: "Paid via Wallet", actions: ["Book Again", "Invoice"],
    },
  ];
  const [active, setActive] = useState(0);
  const toneCls = (t?: string) =>
    t === "ok" ? "bg-emerald-50 text-emerald-700" : t === "warn" ? "bg-amber-50 text-amber-700" : t === "bad" ? "bg-red-50 text-red-700" : "bg-muted text-foreground";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Past Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">View, review and manage all your service history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-2xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              active === i ? "bg-foreground text-background" : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex min-w-[260px] flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input placeholder="Search by service, provider or booking ref…" className="flex-1 bg-transparent text-xs outline-none" />
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.ref} className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${b.highlight ? "border-amber-300 bg-amber-50/50" : "border-border bg-card"}`}>
            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${b.iconBg}`}>{b.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{b.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${toneCls(b.statusTone)}`}>{b.status}</span>
                <span className="text-[11px] text-muted-foreground">{b.ref}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>{b.cat}</span>
                <span>📅 {b.date}</span>
                <span>{b.time}</span>
                <span>📍 {b.addr}</span>
                {b.svcType && <span>{b.svcType}</span>}
              </div>
              {b.provider && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">{b.pInit}</span>
                  <span className="font-semibold">{b.provider}</span>
                  <span className="text-amber-500">{b.rating}</span>
                  <span className="text-muted-foreground">{b.review}</span>
                </div>
              )}
              {b.note && <p className="mt-2 text-[11px] text-muted-foreground">{b.note}</p>}
            </div>
            <div className="text-right">
              <p className={`text-base font-bold ${b.strike ? "text-muted-foreground line-through" : ""}`}>{b.price}</p>
              <p className="text-[10px] text-muted-foreground">{b.pay}</p>
              <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                {b.actions.map((a, i) => (
                  <button key={a} className={`rounded-lg px-3 py-1.5 text-[10px] font-bold ${i === 0 ? "bg-foreground text-background" : "border border-border text-foreground hover:bg-muted"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold hover:bg-muted">Load More Bookings (18 remaining)</button>
      </div>
    </div>
  );
}

/* ---------------- Preferences ---------------- */
function PreferencesView() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const notifications = [
    { t: "Booking Confirmations", d: "Get notified when a booking is confirmed", on: true },
    { t: "Provider On The Way", d: "Alert when your pro is en route", on: true },
    { t: "Payment Receipts", d: "Invoice & payment confirmation emails", on: true },
    { t: "Promotional Offers", d: "Deals, discounts and seasonal offers", on: false },
    { t: "Newsletter", d: "Monthly home tips and platform news", on: false },
    { t: "SMS Alerts", d: "Text messages for critical updates", on: true },
  ];
  const privacy = [
    { t: "Share Activity with Providers", d: "Allow pros to see your booking history", on: true },
    { t: "Personalised Recommendations", d: "AI-based service suggestions", on: true },
    { t: "Anonymous Usage Analytics", d: "Help improve the platform", on: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customise your FixItNow experience to suit your needs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Appearance</p>
            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Theme</p>
                  <p className="text-[11px] text-muted-foreground">Choose your preferred colour theme</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTheme("light")} className={`h-9 w-9 rounded-lg border-2 bg-background ${theme === "light" ? "border-primary" : "border-border"}`} />
                  <button onClick={() => setTheme("dark")} className={`h-9 w-9 rounded-lg border-2 bg-foreground ${theme === "dark" ? "border-primary" : "border-border"}`} />
                  <button onClick={() => setTheme("auto")} className={`h-9 w-9 rounded-lg border-2 ${theme === "auto" ? "border-primary" : "border-border"}`} style={{ background: "linear-gradient(135deg, var(--background) 50%, var(--foreground) 50%)" }} />
                </div>
              </div>
              <Field label="Language" desc="Interface display language">
                <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option>English</option><option>සිංහල</option><option>தமிழ்</option>
                </select>
              </Field>
              <Field label="Currency Display" desc="Show prices in your preferred currency">
                <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option>LKR (Rs.)</option><option>USD ($)</option><option>EUR (€)</option>
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Booking Preferences</p>
            <div className="mt-5 space-y-5">
              <Field label="Preferred Service Time" desc="Default booking time slot">
                <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option>Morning (8 AM – 12 PM)</option><option>Afternoon (12 PM – 5 PM)</option><option>Evening (5 PM – 9 PM)</option>
                </select>
              </Field>
              <ToggleRow t="Auto-confirm Repeat Providers" d="Skip confirmation for trusted pros" defaultOn />
              <ToggleRow t="Show Price Estimates First" d="Display cost breakdown before booking" defaultOn />
              <ToggleRow t="Enable Live GPS Tracking" d="Real-time provider location on map" defaultOn />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Notification Settings</p>
            <div className="mt-5 space-y-4">
              {notifications.map((n) => <ToggleRow key={n.t} t={n.t} d={n.d} defaultOn={n.on} />)}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Privacy & Data</p>
            <div className="mt-5 space-y-4">
              {privacy.map((p) => <ToggleRow key={p.t} t={p.t} d={p.d} defaultOn={p.on} />)}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90">Save Preferences</button>
              <button className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted">Reset Defaults</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ t, d, defaultOn }: { t: string; d: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{t}</p>
        <p className="text-[11px] text-muted-foreground">{d}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

/* ---------------- Support ---------------- */
function SupportView() {
  const tickets = [
    { id: "#TKT-2048", t: "Refund query", d: "Raised 2 days ago · Payment / Refund", s: "In Review", tone: "warn" },
    { id: "#TKT-2031", t: "GPS not updating", d: "Raised 8 days ago · GPS / Tracking", s: "Resolved", tone: "ok" },
  ];
  const faqs = [
    { q: "How do I cancel a booking?", a: 'Go to My Bookings → find your booking → click "Cancel". Cancellations made 2+ hours before the job are fully refunded. Within 2 hours may incur a 10% cancellation fee.', open: true },
    { q: "When will I receive my refund?", a: "Refunds typically appear in your wallet within 24 hours, and on your card within 5–7 business days." },
    { q: "How does the escrow payment work?", a: "Funds are held securely until you confirm the job is complete, then released to the provider." },
    { q: "How do I raise a dispute?", a: "Open the booking in Past Bookings and click Raise Dispute. Our team will review within 24 hours." },
    { q: "Can I request the same provider again?", a: "Yes — open their profile from your booking history and tap Book Again." },
  ];
  const toneCls = (t: string) => t === "ok" ? "bg-emerald-50 text-emerald-700" : t === "warn" ? "bg-amber-50 text-amber-700" : "bg-muted text-foreground";
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">Get help, raise a ticket or browse our FAQ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: MessageCircle, t: "Live Chat", d: "Chat with a support agent in real-time", s: "● Available Now", tone: "text-emerald-600" },
          { icon: Phone, t: "Phone Support", d: "Call us on 0771234567 · 0767654321", s: "● Lines Open", tone: "text-emerald-600" },
          { icon: Mail, t: "Email Support", d: "fixitnow@gmail.com · Reply in 24hrs", s: "⏱ 24hr Response", tone: "text-primary" },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <c.icon className="h-6 w-6" />
            </div>
            <p className="mt-3 font-bold">{c.t}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{c.d}</p>
            <p className={`mt-2 text-[11px] font-semibold ${c.tone}`}>{c.s}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Raise a Support Ticket</p>
          <div className="mt-4 space-y-3">
            <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Select issue category</option><option>Payment / Refund</option><option>GPS / Tracking</option><option>Account</option><option>Booking</option>
            </select>
            <input placeholder="Subject — briefly describe your issue" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Related Booking (optional)</option><option>#FIN-2026-08471</option><option>#FIN-2026-08310</option>
            </select>
            <textarea rows={4} placeholder="Describe your issue in detail — the more context you provide, the faster we can help…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Priority: Normal</option><option>Priority: High</option><option>Priority: Urgent</option>
            </select>
            <button className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90">Submit Ticket →</button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">My Open Tickets</p>
            <div className="mt-4 space-y-2">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{t.id} — {t.t}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${toneCls(t.tone)}`}>{t.s}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Contact Information</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> 0771234567 · 0767654321</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> fixitnow@gmail.com</li>
              <li className="flex items-center gap-2">🖨 Fax: +94761234567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> University of Moratuwa, Sri Lanka</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Mon–Sat 8 AM – 8 PM · Sun 9 AM – 5 PM</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Frequently Asked Questions</p>
        <div className="mt-4 divide-y divide-border">
          {faqs.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={f.q} className="py-3">
                <button onClick={() => setOpenIdx(open ? -1 : i)} className="flex w-full items-center justify-between text-left">
                  <span className="text-sm font-semibold">{f.q}</span>
                  <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
                </button>
                {open && <p className="mt-2 text-xs text-muted-foreground">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>
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
