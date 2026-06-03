import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const HOMEOWNERS: Record<string, {
  initials: string; name: string; email: string; phone: string; address: string; district: string; city: string;
  bookings: number; spent: string; since: string; status: "Active" | "New" | "Flagged"; nic: string;
}> = {
  "priya-mendis": { initials: "PM", name: "Priya Mendis", email: "priya.m@gmail.com", phone: "+94 77 123 4567", address: "23/A, Park Road", district: "Colombo", city: "Colombo 7", bookings: 14, spent: "Rs. 48,200", since: "Jan 2026", status: "Active", nic: "199123456V" },
  "ranjith-wijesinghe": { initials: "RW", name: "Ranjith Wijesinghe", email: "ranjith.w@yahoo.com", phone: "+94 71 987 6543", address: "12, Temple Lane", district: "Kandy", city: "Kandy", bookings: 8, spent: "Rs. 22,500", since: "Mar 2026", status: "Active", nic: "198567432V" },
  "sunitha-de-silva": { initials: "SD", name: "Sunitha De Silva", email: "sunitha.d@gmail.com", phone: "+94 76 555 1234", address: "5B, Lake Drive", district: "Gampaha", city: "Gampaha", bookings: 21, spent: "Rs. 78,000", since: "Oct 2025", status: "Active", nic: "197812345V" },
  "nuwan-kumara": { initials: "NK", name: "Nuwan Kumara", email: "nuwan.k@hotmail.com", phone: "+94 75 234 5678", address: "88, Beach Road", district: "Matara", city: "Matara", bookings: 3, spent: "Rs. 7,800", since: "May 2026", status: "New", nic: "200012345V" },
  "layla-fernando": { initials: "LF", name: "Layla Fernando", email: "layla.f@gmail.com", phone: "+94 77 111 2233", address: "45, Galle Road", district: "Colombo", city: "Colombo 3", bookings: 6, spent: "Rs. 18,400", since: "Feb 2026", status: "Flagged", nic: "199587654V" },
  "anoma-jayawardena": { initials: "AJ", name: "Anoma Jayawardena", email: "anoma.j@gmail.com", phone: "+94 70 444 5566", address: "9, High Level Road", district: "Colombo", city: "Nugegoda", bookings: 11, spent: "Rs. 34,000", since: "Nov 2025", status: "Active", nic: "198765432V" },
};

const ACTIVE = [
  { ref: "FXN-204812", service: "AC Repair & Service", provider: "Marcus Sterling", date: "Today · 2:00 PM", amount: "Rs. 4,200", status: "In Progress" },
  { ref: "FXN-204798", service: "Plumbing Leak Fix", provider: "Ashan Kumara", date: "Tomorrow · 10:00 AM", amount: "Rs. 2,800", status: "Accepted" },
];
const PAST = [
  { ref: "FXN-204500", service: "Electrical Rewiring", provider: "Elena Rodriguez", date: "12 May 2026", amount: "Rs. 8,200", status: "Completed", rating: 5 },
  { ref: "FXN-204321", service: "House Painting", provider: "Rajan Perera", date: "28 Apr 2026", amount: "Rs. 24,500", status: "Completed", rating: 5 },
  { ref: "FXN-204110", service: "Carpentry — Door Fix", provider: "Thilanka Bandara", date: "15 Apr 2026", amount: "Rs. 3,400", status: "Completed", rating: 4 },
  { ref: "FXN-203987", service: "Deep Cleaning", provider: "James Wilson", date: "02 Apr 2026", amount: "Rs. 6,800", status: "Cancelled", rating: 0 },
];

export function AdminHomeownerDetailPage() {
  const { username, id } = useParams({ from: "/_authenticated/$username/homeowners/$id" });
  const h = HOMEOWNERS[id] ?? HOMEOWNERS["priya-mendis"];

  return (
    <AdminLayout active="homeowners">
      <Link to="/$username/homeowners" params={{ username }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-background/60 hover:text-background">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Homeowners
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left profile card */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{h.initials}</div>
            <p className="mt-3 text-lg font-bold">{h.name}</p>
            <p className="text-xs text-background/60">Homeowner · Member since {h.since}</p>
            <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-[10px] font-bold ${h.status === "Active" ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300" : h.status === "New" ? "border-sky-500/30 bg-sky-500/15 text-sky-300" : "border-red-500/30 bg-red-500/15 text-red-300"}`}>{h.status}</span>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <KPI value={String(h.bookings)} label="Bookings" />
              <KPI value={h.spent} label="Total Spent" />
            </div>
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-background/50">Contact</h3>
            <ul className="mt-3 space-y-3">
              <Info icon={Mail}>{h.email}</Info>
              <Info icon={Phone}>{h.phone}</Info>
              <Info icon={MapPin}>{h.address}, {h.city}, {h.district}</Info>
              <Info icon={CreditCard}>NIC: {h.nic}</Info>
              <Info icon={Calendar}>Joined {h.since}</Info>
            </ul>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-xl border border-background/15 py-2.5 text-xs font-bold text-background/80 hover:bg-background/10">Send Message</button>
            <button className="flex-1 rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20">Suspend</button>
          </div>
        </aside>

        {/* Right — details */}
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-4">
            <Stat value={String(h.bookings)} label="Total Bookings" tone="text-sky-400" />
            <Stat value={String(ACTIVE.length)} label="Active" tone="text-amber-400" />
            <Stat value={String(PAST.filter((b) => b.status === "Completed").length)} label="Completed" tone="text-emerald-400" />
            <Stat value="4.8" label="Avg. Rating Given" tone="text-background" />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Active Bookings</h2>
            <BookingTable rows={ACTIVE} />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Past Bookings</h2>
            <BookingTable rows={PAST} showRating />
          </section>

          <section className="rounded-2xl border border-background/10 bg-background/5 p-6">
            <h2 className="text-lg font-bold">Account Activity</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["Last login", "2 hours ago · 175.157.10.4"],
                ["Last booking placed", "Today · 9:42 AM"],
                ["Preferred payment", "Card ending 4421"],
                ["Saved addresses", "2"],
                ["Disputes raised", h.status === "Flagged" ? "1 open" : "None"],
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

function BookingTable({ rows, showRating }: { rows: Array<{ ref: string; service: string; provider: string; date: string; amount: string; status: string; rating?: number }>; showRating?: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-background/50">
            <th className="py-2">Ref</th>
            <th className="py-2">Service</th>
            <th className="py-2">Provider</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            {showRating && <th className="py-2">Rating</th>}
            <th className="py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-background/10">
          {rows.map((r) => (
            <tr key={r.ref}>
              <td className="py-2.5 text-xs text-background/70">{r.ref}</td>
              <td className="py-2.5 font-semibold">{r.service}</td>
              <td className="py-2.5 text-background/80">{r.provider}</td>
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
