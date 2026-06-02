import { useState } from "react";
import { Search, Star } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";

interface Provider {
  initials: string; name: string; email: string;
  category: string; icon: string; district: string;
  jobs: number; rating: number; status: "Active" | "Suspended" | "New" | "Top";
}

const PROVIDERS: Provider[] = [
  { initials: "MS", name: "Marcus Sterling", email: "marcus.s@gmail.com", category: "Plumbing", icon: "🔧", district: "Colombo", jobs: 342, rating: 4.9, status: "Top" },
  { initials: "ER", name: "Elena Rodriguez", email: "elena.r@gmail.com", category: "Electrical", icon: "⚡", district: "Colombo", jobs: 218, rating: 4.8, status: "Top" },
  { initials: "JW", name: "James Wilson", email: "james.w@yahoo.com", category: "HVAC", icon: "❄️", district: "Gampaha", jobs: 156, rating: 4.6, status: "Active" },
  { initials: "RP", name: "Rajan Perera", email: "rajan.p@gmail.com", category: "Painting", icon: "🎨", district: "Kandy", jobs: 94, rating: 4.9, status: "Top" },
  { initials: "TB", name: "Thilanka Bandara", email: "thilanka.b@gmail.com", category: "Carpentry", icon: "🪚", district: "Matara", jobs: 12, rating: 3.8, status: "Suspended" },
  { initials: "AK", name: "Ashan Kumara", email: "ashan.k@gmail.com", category: "Plumbing", icon: "🔧", district: "Colombo", jobs: 67, rating: 4.7, status: "New" },
];

type Tab = "all" | "top" | "new" | "suspended";

export function AdminProvidersPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");

  const filtered = PROVIDERS.filter((p) => {
    if (tab === "top" && p.status !== "Top") return false;
    if (tab === "new" && p.status !== "New") return false;
    if (tab === "suspended" && p.status !== "Suspended") return false;
    if (q && !`${p.name} ${p.category} ${p.district}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout active="providers">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-background">Service Providers</h1>
        <p className="mt-1 text-sm text-background/60">All verified and active service professionals on the platform</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat value="142" label="Active Providers" color="text-emerald-400" />
        <Stat value="18" label="Categories" color="text-sky-400" />
        <Stat value="4.8" label="Avg. Rating" color="text-background" />
        <Stat value="6" label="Suspended" color="text-destructive" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabPill active={tab === "all"} onClick={() => setTab("all")} primary>All (142)</TabPill>
        <TabPill active={tab === "top"} onClick={() => setTab("top")}>Top Rated (40)</TabPill>
        <TabPill active={tab === "new"} onClick={() => setTab("new")}>New (12)</TabPill>
        <TabPill active={tab === "suspended"} onClick={() => setTab("suspended")}>Suspended (6)</TabPill>
        <div className="relative ml-auto min-w-[280px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search provider, category or district…"
            className="w-full rounded-full border border-background/10 bg-background/5 py-2 pl-10 pr-4 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-background/10 bg-background/5">
        <table className="w-full text-sm">
          <thead className="bg-background/5">
            <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-background/40">
              <th className="px-5 py-3">Provider</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">District</th>
              <th className="px-3 py-3">Jobs Done</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background/10">
            {filtered.map((p) => (
              <tr key={p.email} className="hover:bg-background/5">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary">{p.initials}</div>
                    <div>
                      <p className="font-bold text-background">{p.name}</p>
                      <p className="text-xs text-background/50">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-background/80"><span className="mr-1">{p.icon}</span>{p.category}</td>
                <td className="px-3 py-3 text-background/70">{p.district}</td>
                <td className="px-3 py-3 text-background/80">{p.jobs}</td>
                <td className="px-3 py-3"><span className="inline-flex items-center gap-1 text-background"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}</span></td>
                <td className="px-3 py-3">
                  {p.status === "Suspended" ? (
                    <span className="rounded-full border border-destructive/40 px-2 py-0.5 text-[10px] font-bold text-destructive">Suspended</span>
                  ) : (
                    <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Active</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toast("Coming soon")} className="rounded-md border border-background/15 px-3 py-1 text-xs font-semibold text-background/80 hover:bg-background/10">View</button>
                    {p.status === "Suspended" ? (
                      <button onClick={() => toast.success("Reinstated")} className="rounded-md border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-400/10">Reinstate</button>
                    ) : (
                      <button onClick={() => toast.success("Suspended")} className="rounded-md border border-background/15 px-3 py-1 text-xs font-semibold text-background/80 hover:bg-background/10">Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-background/10 bg-background/5 p-5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-background/60">{label}</p>
    </div>
  );
}

function TabPill({ active, primary, onClick, children }: { active: boolean; primary?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
        active && primary ? "bg-primary text-primary-foreground" :
        active ? "bg-background/15 text-background" :
        "border border-background/15 text-background/70 hover:bg-background/10"
      }`}>{children}</button>
  );
}
