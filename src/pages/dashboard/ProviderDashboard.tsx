import { Link } from "@tanstack/react-router";
import { Bell, Wrench, Calendar, DollarSign, Star, TrendingUp } from "lucide-react";

export function ProviderDashboard() {
  const jobs = [
    { id: 1, customer: "Alex Johnson", service: "Emergency Plumbing", time: "Today · 2:30 PM", status: "Confirmed", price: 85 },
    { id: 2, customer: "Maria Santos", service: "Faucet Repair", time: "Tomorrow · 10:00 AM", status: "Pending", price: 65 },
    { id: 3, customer: "T. Kumar", service: "Pipe Replacement", time: "Oct 26 · 4:00 PM", status: "Confirmed", price: 140 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">FN</div>
            <span className="font-bold">FixItNow · Pro</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#" className="font-medium text-foreground">Dashboard</a>
            <a href="#" className="hover:text-foreground">Jobs</a>
            <a href="#" className="hover:text-foreground">Earnings</a>
            <a href="#" className="hover:text-foreground">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-muted"><Bell className="h-5 w-5 text-muted-foreground" /></button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">MS</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Marcus</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your services today.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Jobs", value: "3", icon: Wrench, hint: "+1 since yesterday" },
            { label: "This Week", value: "$1,240", icon: DollarSign, hint: "+18% vs last week" },
            { label: "Avg Rating", value: "4.9", icon: Star, hint: "From 128 reviews" },
            { label: "Completion Rate", value: "98%", icon: TrendingUp, hint: "Top 5% of pros" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-3 text-3xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">Upcoming Jobs</h2>
              <a href="#" className="text-xs font-medium text-primary hover:underline">View all →</a>
            </div>
            <div className="divide-y divide-border">
              {jobs.map((j) => (
                <div key={j.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{j.service}</p>
                      <p className="text-xs text-muted-foreground">{j.customer} · {j.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${j.price}</p>
                    <span className={`text-[10px] font-semibold uppercase ${j.status === "Confirmed" ? "text-success" : "text-muted-foreground"}`}>{j.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-bold">Availability</h3>
              <p className="mt-1 text-xs text-muted-foreground">You appear as available to homeowners.</p>
              <button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">Go Offline</button>
            </div>
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <h3 className="font-bold">Boost Profile</h3>
              <p className="mt-1 text-xs opacity-90">Promoted pros get 3× more bookings on average.</p>
              <button className="mt-4 w-full rounded-xl bg-background py-2.5 text-sm font-bold text-foreground hover:opacity-90 transition-opacity">Learn More</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
