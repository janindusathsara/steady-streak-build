import { Trash2 } from "lucide-react";
import { HomeownerLayout } from "@/components/homeowner/HomeownerLayout";
import { useCurrentUser } from "@/hooks/use-current-user";

export function ProfilePage() {
  const { profile, email } = useCurrentUser();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <HomeownerLayout active="preferences">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and account settings</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{initials}</div>
          <p className="mt-3 text-lg font-bold">{displayName}</p>
          <p className="text-xs text-muted-foreground capitalize">@{username} · {profile?.role}</p>
          <span className="mt-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">⭐ Gold Member</span>

          <dl className="mt-6 space-y-2.5 text-left text-sm">
            {[
              ["Total Bookings", "24"],
              ["Active Projects", "3"],
              ["Total Spent", "$4,280"],
              ["Wallet Balance", "$1,240.50"],
              ["Reviews Given", "18"],
              ["Member Since", "Sep 2024"],
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
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-bold">Personal Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Display Name" defaultValue={displayName} />
              <Field label="Username" defaultValue={username} />
              <Field label="Email Address" defaultValue={email ?? ""} type="email" />
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

          <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
            <h2 className="font-bold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete Account
            </button>
          </section>
        </div>
      </div>
    </HomeownerLayout>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input
        key={defaultValue}
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
