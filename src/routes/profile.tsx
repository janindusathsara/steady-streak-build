import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ShieldCheck, BarChart3, Wallet, Settings, LifeBuoy, LogOut, LayoutDashboard, Trash2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">FN</div>
            <span className="font-bold">FixItNow Ultra-Suite</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/services" className="hover:text-foreground">Find Services</Link>
            <a href="#" className="hover:text-foreground">My Wallet</a>
            <a href="#" className="hover:text-foreground">Go Gold</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-muted"><Bell className="h-5 w-5 text-muted-foreground" /></button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">AJ</div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-tight">Alex Johnson</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
        {/* Side nav */}
        <aside className="hidden lg:block">
          <nav className="space-y-1 text-sm">
            {[
              { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard/homeowner", active: true },
              { icon: ShieldCheck, label: "Security Check" },
              { icon: BarChart3, label: "System Health" },
              { icon: Wallet, label: "Wallet" },
              { icon: Settings, label: "Preferences" },
            ].map((n) => {
              const Icon = n.icon;
              const cls = n.active ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted";
              return n.to ? (
                <Link key={n.label} to={n.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${cls}`}><Icon className="h-4 w-4" />{n.label}</Link>
              ) : (
                <a key={n.label} href="#" className={`flex items-center gap-2 rounded-lg px-3 py-2 ${cls}`}><Icon className="h-4 w-4" />{n.label}</a>
              );
            })}
          </nav>
          <div className="mt-8 space-y-1 text-sm">
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted"><LifeBuoy className="h-4 w-4" /> Support</a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-destructive hover:bg-muted"><LogOut className="h-4 w-4" /> Logout</a>
          </div>
        </aside>

        {/* Main */}
        <main>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and account settings</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Profile sidebar */}
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">AJ</div>
              <p className="mt-3 text-lg font-bold">Alex Johnson</p>
              <p className="text-xs text-muted-foreground">Homeowner · Member since 2024</p>
              <span className="mt-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">⭐ Gold Member</span>

              <dl className="mt-6 space-y-2.5 text-left text-sm">
                {[
                  ["Total Bookings", "24"],
                  ["Active Projects", "3"],
                  ["Total Spent", "$4,280"],
                  ["Wallet Balance", "$1,240.50"],
                  ["Reviews Given", "18"],
                  ["Gold Member Since", "Sep 2024"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <button className="mt-5 w-full rounded-xl border border-border py-2.5 text-xs font-semibold hover:bg-muted transition-colors">Change Profile Photo</button>
            </div>

            <div className="space-y-6">
              {/* Personal info */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-bold">Personal Information</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="First Name" defaultValue="Alex" />
                  <Field label="Last Name" defaultValue="Johnson" />
                  <Field label="Email Address" defaultValue="alex@example.com" type="email" />
                  <Field label="Phone Number" defaultValue="+94 77 123 4567" />
                  <Field label="Home Address" defaultValue="42 Palm Grove, Colombo 3" />
                  <div>
                    <label className="text-xs font-semibold">District</label>
                    <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                      <option>Western Province</option>
                      <option>Central</option>
                      <option>Southern</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold">About Your Property</label>
                  <textarea
                    rows={3}
                    defaultValue="3-bedroom villa with garden. Main concerns: plumbing and HVAC maintenance. Prefer morning bookings."
                    className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <button className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </section>

              {/* Notifications */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-bold">Notification Preferences</h2>
                <div className="mt-4 space-y-4">
                  {[
                    { t: "Booking Confirmations", d: "Get notified when a provider confirms your booking", on: true },
                    { t: "Provider En Route Alerts", d: "Receive notification when your provider is heading your way", on: true },
                    { t: "Payment Receipts", d: "Email receipts for every completed transaction", on: true },
                    { t: "Promotions & Offers", d: "Exclusive deals and Gold member benefits", on: false },
                    { t: "AI Maintenance Alerts", d: "Predictive maintenance warnings from FixItNow AI", on: true },
                  ].map((n) => <Toggle key={n.t} {...n} />)}
                </div>
              </section>

              {/* Danger zone */}
              <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
                <h2 className="font-bold text-destructive">Danger Zone</h2>
                <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Account
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Toggle({ t, d, on }: { t: string; d: string; on: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="font-semibold text-sm">{t}</p>
        <p className="text-xs text-muted-foreground">{d}</p>
      </div>
      <input type="checkbox" defaultChecked={on} className="peer sr-only" />
      <span className="relative h-6 w-11 flex-shrink-0 rounded-full bg-muted peer-checked:bg-primary transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-card after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
