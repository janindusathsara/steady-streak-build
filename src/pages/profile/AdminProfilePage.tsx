import { Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AdminProfilePage() {
  const { profile, email } = useCurrentUser();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Admin";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "A";

  return (
    <AdminLayout active="dashboard">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-1 text-sm text-background/60">Manage your administrator account and access settings</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-background/10 bg-background/[0.03] p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{initials}</div>
          <p className="mt-3 text-lg font-bold">{displayName}</p>
          <p className="text-xs text-background/60 capitalize">@{username} · {profile?.role}</p>
          <span className="mt-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">🛡 System Admin</span>

          <dl className="mt-6 space-y-2.5 text-left text-sm">
            {[
              ["Active Users", "1,284"],
              ["Live Providers", "342"],
              ["Open Tickets", "7"],
              ["Cluster Load", "32%"],
              ["Last Audit", "2h ago"],
              ["Member Since", "Jan 2024"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-background/10 pb-2 last:border-0">
                <dt className="text-background/60">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <button className="mt-5 w-full rounded-xl border border-background/10 py-2.5 text-xs font-semibold hover:bg-background/5">Change Profile Photo</button>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-background/10 bg-background/[0.03] p-6">
            <h2 className="font-bold">Administrator Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Display Name" defaultValue={displayName} />
              <Field label="Username" defaultValue={username} />
              <Field label="Email Address" defaultValue={email ?? ""} type="email" />
              <Field label="Phone Number" defaultValue="+94 77 123 4567" />
              <Field label="Office Location" defaultValue="HQ — Colombo 03" />
              <div>
                <label className="text-xs font-semibold">Access Level</label>
                <select className="mt-1.5 w-full rounded-lg border border-background/10 bg-background/[0.04] px-3 py-2 text-sm">
                  <option>Super Admin</option>
                  <option>Operations</option>
                  <option>Read Only</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold">Internal Notes</label>
              <textarea
                rows={3}
                defaultValue="Responsible for platform infrastructure, security audits, and provider verification workflows."
                className="mt-1.5 w-full resize-none rounded-lg border border-background/10 bg-background/[0.04] px-3 py-2 text-sm"
              />
            </div>
            <button className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">Save Changes</button>
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/[0.03] p-6">
            <h2 className="font-bold">System Alerts</h2>
            <div className="mt-4 space-y-4">
              {[
                { t: "Security Incidents", d: "Critical security and intrusion alerts", on: true },
                { t: "Service Outages", d: "Database and gateway downtime notifications", on: true },
                { t: "Provider Verifications", d: "New providers requiring approval", on: true },
                { t: "Daily Reports", d: "Email digest of platform analytics", on: false },
              ].map((n) => <Toggle key={n.t} {...n} />)}
            </div>
          </section>

          <section className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6">
            <h2 className="font-bold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-background/60">Permanently delete this administrator account. This action cannot be undone.</p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/20 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="h-3.5 w-3.5" /> Delete Account
            </button>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input key={defaultValue} type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-lg border border-background/10 bg-background/[0.04] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

function Toggle({ t, d, on }: { t: string; d: string; on: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="font-semibold text-sm">{t}</p>
        <p className="text-xs text-background/60">{d}</p>
      </div>
      <input type="checkbox" defaultChecked={on} className="peer sr-only" />
      <span className="relative h-6 w-11 flex-shrink-0 rounded-full bg-background/20 peer-checked:bg-primary transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
