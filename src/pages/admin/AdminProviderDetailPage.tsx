import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Star, BadgeCheck } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const PROVIDERS: Record<string, {
  initials: string; name: string; email: string; phone: string; address: string; district: string;
  category: string; icon: string; jobs: number; rating: number; status: "Active" | "Suspended" | "New" | "Top";
  nic: string; since: string; hourlyRate: string; verified: boolean; bio: string;
}> = {
  "marcus-sterling": { initials: "MS", name: "Marcus Sterling", email: "marcus.s@gmail.com", phone: "+94 77 234 5678", address: "12, Galle Road, Colombo 04", district: "Colombo", category: "Plumbing", icon: "🔧", jobs: 342, rating: 4.9, status: "Top", nic: "198512345V", since: "Aug 2024", hourlyRate: "Rs. 1,800", verified: true, bio: "Master plumber with 15+ years experience in residential and commercial systems." },
  "elena-rodriguez": { initials: "ER", name: "Elena Rodriguez", email: "elena.r@gmail.com", phone: "+94 71 345 6789", address: "8, Ward Place, Colombo 07", district: "Colombo", category: "Electrical", icon: "⚡", jobs: 218, rating: 4.8, status: "Top", nic: "198723456V", since: "Nov 2024", hourlyRate: "Rs. 2,000", verified: true, bio: "Certified electrician specializing in solar and smart-home installations." },
  "james-wilson": { initials: "JW", name: "James Wilson", email: "james.w@yahoo.com", phone: "+94 76 555 4321", address: "33, Negombo Road, Gampaha", district: "Gampaha", category: "HVAC", icon: "❄️", jobs: 156, rating: 4.6, status: "Active", nic: "198834567V", since: "Feb 2025", hourlyRate: "Rs. 1,600", verified: true, bio: "HVAC technician — split AC, central cooling, refrigeration." },
  "rajan-perera": { initials: "RP", name: "Rajan Perera", email: "rajan.p@gmail.com", phone: "+94 70 678 9012", address: "9, Peradeniya Road, Kandy", district: "Kandy", category: "Painting", icon: "🎨", jobs: 94, rating: 4.9, status: "Top", nic: "199045678V", since: "Jan 2025", hourlyRate: "Rs. 1,200", verified: true, bio: "Interior & exterior painting with premium finishes." },
  "thilanka-bandara": { initials: "TB", name: "Thilanka Bandara", email: "thilanka.b@gmail.com", phone: "+94 75 789 0123", address: "21, Beach Road, Matara", district: "Matara", category: "Carpentry", icon: "🪚", jobs: 12, rating: 3.8, status: "Suspended", nic: "199156789V", since: "Sep 2025", hourlyRate: "Rs. 1,400", verified: false, bio: "Furniture repair and custom woodwork." },
  "ashan-kumara": { initials: "AK", name: "Ashan Kumara", email: "ashan.k@gmail.com", phone: "+94 77 890 1234", address: "55, Marine Drive, Colombo 06", district: "Colombo", category: "Plumbing", icon: "🔧", jobs: 67, rating: 4.7, status: "New", nic: "199567890V", since: "Apr 2026", hourlyRate: "Rs. 1,500", verified: true, bio: "Plumbing & pipe-fitting specialist." },
};

const ACTIVE = [
  { ref: "FXN-204812", service: "AC Repair & Service", customer: "Priya Mendis", date: "Today · 2:00 PM", amount: "Rs. 4,200", status: "In Progress" },
  { ref: "FXN-204798", service: "Tap Replacement", customer: "Sunitha De Silva", date: "Tomorrow · 10:00 AM", amount: "Rs. 2,800", status: "Accepted" },
];
const PAST = [
  { ref: "FXN-204500", service: "Pipe Leak Fix", customer: "Anoma Jayawardena", date: "12 May 2026", amount: "Rs. 5,200", status: "Completed", rating: 5 },
  { ref: "FXN-204321", service: "Bathroom Plumbing", customer: "Layla Fernando", date: "28 Apr 2026", amount: "Rs. 14,500", status: "Completed", rating: 5 },
  { ref: "FXN-204110", service: "Drain Cleaning", customer: "Ranjith Wijesinghe", date: "15 Apr 2026", amount: "Rs. 3,400", status: "Completed", rating: 4 },
  { ref: "FXN-203987", service: "Water Heater Install", customer: "Nuwan Kumara", date: "02 Apr 2026", amount: "Rs. 9,800", status: "Cancelled", rating: 0 },
];

export function AdminProviderDetailPage() {
  const { username, id } = useParams({ from: "/_authenticated/$username/providers/$id" });
  const p = PROVIDERS[id] ?? PROVIDERS["marcus-sterling"];

  return (
    <AdminLayout active="providers">
      <Link to="/$username/providers" params={{ username }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-background/60 hover:text-background">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Service Providers
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/30 text-2xl font-bold text-primary">{p.initials}</div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-lg font-bold">
              {p.name}
              {p.verified && <BadgeCheck className="h-4 w-4 text-sky-400" />}
            </p>
            <p className="text-xs text-background/60">{p.icon} {p.category} · Since {p.since}</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold text-amber-300">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)} · {p.jobs} jobs
            </div>
            <div className="mt-3">
              <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold ${
                p.status === "Suspended" ? "border-red-500/30 bg-red-500/15 text-red-300" :
                p.status === "New" ? "border-sky-500/30 bg-sky-500/15 text-sky-300" :
                p.status === "Top" ? "border-amber-500/30 bg-amber-500/15 text-amber-300" :
                "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              }`}>{p.status === "Top" ? "Top Rated" : p.status}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <KPI value={String(p.jobs)} label="Jobs Done" />
              <KPI value={p.hourlyRate} label="Hourly" />
            </div>
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-background/50">Contact</h3>
            <ul className="mt-3 space-y-3">
              <Info icon={Mail}>{p.email}</Info>
              <Info icon={Phone}>{p.phone}</Info>
              <Info icon={MapPin}>{p.address}</Info>
              <Info icon={Briefcase}>NIC: {p.nic}</Info>
            </ul>
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-background/50">About</h3>
            <p className="mt-2 text-xs text-background/70">{p.bio}</p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-xl border border-background/15 py-2.5 text-xs font-bold text-background/80 hover:bg-background/10">Message</button>
            {p.status === "Suspended" ? (
              <button className="flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20">Reinstate</button>
            ) : (
              <button className="flex-1 rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20">Suspend</button>
            )}
          </div>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-4">
            <Stat value={String(p.jobs)} label="Total Jobs" tone="text-sky-400" />
            <Stat value={String(ACTIVE.length)} label="Active Jobs" tone="text-amber-400" />
            <Stat value={p.rating.toFixed(1)} label="Avg. Rating" tone="text-background" />
            <Stat value="98%" label="Completion Rate" tone="text-emerald-400" />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Active Jobs</h2>
            <JobsTable rows={ACTIVE} />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Past Jobs</h2>
            <JobsTable rows={PAST} showRating />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Performance & Verification</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Verification", p.verified ? "Verified ✓" : "Pending"],
                ["Last job", "Today · 09:42 AM"],
                ["Response time", "≈ 8 min avg"],
                ["Disputes", p.status === "Suspended" ? "3 open" : "0"],
                ["Payout method", "Bank · BOC ****1234"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between border-b border-background/10 pb-2 last:border-0">
                  <span className="text-background/70">{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function Info({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-xs text-background/80">
      <Icon className="mt-0.5 h-3.5 w-3.5 text-background/50" />
      <span className="flex-1">{children}</span>
    </li>
  );
}
function KPI({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-background/10 bg-background/[0.04] p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-background/50">{label}</p>
    </div>
  );
}
function Stat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-4 text-center">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-[11px] text-background/50">{label}</p>
    </div>
  );
}
function JobsTable({ rows, showRating }: { rows: Array<{ ref: string; service: string; customer: string; date: string; amount: string; status: string; rating?: number }>; showRating?: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-background/50">
            <th className="py-2">Ref</th><th className="py-2">Service</th><th className="py-2">Customer</th>
            <th className="py-2">Date</th><th className="py-2">Amount</th>
            {showRating && <th className="py-2">Rating</th>}
            <th className="py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-background/10">
          {rows.map((r) => (
            <tr key={r.ref}>
              <td className="py-2.5 text-xs text-background/70">{r.ref}</td>
              <td className="py-2.5 font-semibold">{r.service}</td>
              <td className="py-2.5 text-background/80">{r.customer}</td>
              <td className="py-2.5 text-xs text-background/70">{r.date}</td>
              <td className="py-2.5 text-background/80">{r.amount}</td>
              {showRating && <td className="py-2.5">{r.rating ? "★".repeat(r.rating) : "—"}</td>}
              <td className="py-2.5 text-right">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                  r.status === "Completed" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
                  r.status === "Cancelled" ? "border-red-500/30 bg-red-500/10 text-red-300" :
                  "border-amber-500/30 bg-amber-500/10 text-amber-300"
                }`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
