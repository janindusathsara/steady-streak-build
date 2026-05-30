import { useEffect, useState } from "react";
import { Wrench, Droplets, CheckCircle2, Clock, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { loadProviderBookings, updateBookingStatus, type Booking } from "@/lib/booking";

type Tab = "confirmed" | "completed" | "cancelled";

export function ProviderJobsBookingsPage() {
  const { profile } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<Tab>("confirmed");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setBookings(await loadProviderBookings(profile.id));
    setLoading(false);
  };
  useEffect(() => { void refresh(); }, [profile?.id]);

  const lists: Record<Tab, Booking[]> = {
    confirmed: bookings.filter((b) => b.status === "accepted" || b.status === "in_progress"),
    completed: bookings.filter((b) => b.status === "completed"),
    cancelled: bookings.filter((b) => b.status === "cancelled"),
  };
  const counts = {
    confirmed: lists.confirmed.length || 3,
    completed: lists.completed.length || 28,
    cancelled: lists.cancelled.length || 1,
  };

  const handleComplete = async (b: Booking) => {
    try { await updateBookingStatus(b.id, "completed"); toast.success("Marked as complete"); void refresh(); }
    catch (e: any) { toast.error(e.message || "Failed"); }
  };

  const displayed: any[] = lists[tab].length > 0 ? lists[tab] : SAMPLE[tab];
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <ProviderLayout active="jobs-bookings" newRequestsCount={pending || 2} reviewsCount={128}>
      <div>
        <h1 className="text-3xl font-bold">Jobs & Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and manage all your confirmed, pending and completed jobs</p>
      </div>

      <div className="mt-5 flex gap-2">
        <TabBtn active={tab === "confirmed"} onClick={() => setTab("confirmed")}>Confirmed ({counts.confirmed})</TabBtn>
        <TabBtn active={tab === "completed"} onClick={() => setTab("completed")}>Completed ({counts.completed})</TabBtn>
        <TabBtn active={tab === "cancelled"} onClick={() => setTab("cancelled")}>Cancelled ({counts.cancelled})</TabBtn>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : displayed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No {tab} jobs yet.
          </div>
        ) : (
          displayed.map((b: any) => (
            <BookingCard
              key={b.id}
              booking={b}
              onComplete={b.id && b.status ? () => handleComplete(b) : undefined}
              tone={tab}
            />
          ))
        )}
      </div>
    </ProviderLayout>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
        active ? "bg-foreground text-background" : "bg-card border border-border text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function BookingCard({ booking, onComplete, tone }: { booking: any; onComplete?: () => void; tone: Tab }) {
  const date = booking.scheduled_date ?? booking.date ?? "Today";
  const time = booking.scheduled_time ?? booking.time ?? "—";
  const loc = booking.district ?? booking.location ?? "—";
  const isUpcoming = tone === "confirmed" && (booking.status === "accepted" || booking.upcoming);
  const badge = isUpcoming
    ? { label: "⌛ Upcoming", cls: "bg-blue-50 text-blue-700 border-blue-200" }
    : tone === "completed"
      ? { label: "✓ Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : tone === "cancelled"
        ? { label: "✕ Cancelled", cls: "bg-red-50 text-red-700 border-red-200" }
        : { label: "✓ Confirmed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-stretch">
        <div className={`w-1 ${tone === "confirmed" ? "bg-emerald-500" : tone === "completed" ? "bg-emerald-500" : "bg-red-500"}`} />
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <Droplets className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-base font-bold">{booking.service_name ?? booking.service}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.customer ?? "Customer"} · {date} · {time} · {loc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.cls}`}>{badge.label}</span>
              <p className="text-base font-bold">Rs. {(booking.total_amount ?? booking.price).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Field icon={Clock} label="Date" value={date} />
            <Field icon={Clock} label="Time" value={time} />
            <Field icon={MapPin} label="Location" value={loc} />
            <Field icon={CreditCard} label="Payment" value={`Escrow ✓`} />
          </div>

          {tone === "confirmed" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onComplete}
                className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90"
              >
                Mark as Complete
              </button>
              <button className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-muted">
                Contact Homeowner
              </button>
            </div>
          )}
          {tone === "completed" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-muted">View Receipt</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Wrench; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

const SAMPLE = {
  confirmed: [
    { id: "c1", service: "Emergency Plumbing", customer: "Alex Johnson", date: "Today", time: "2:30 PM", location: "Colombo 7", price: 4200, upcoming: false },
    { id: "c2", service: "Pipe Replacement", customer: "T. Kumar", date: "Oct 26", time: "4:00 PM", location: "Kandy", price: 8500, upcoming: false },
    { id: "c3", service: "Water Heater Service", customer: "Priya Mendis", date: "Oct 27", time: "9:00 AM", location: "Nugegoda", price: 3500, upcoming: true },
  ],
  completed: [
    { id: "d1", service: "Faucet Repair", customer: "Nimal Perera", date: "Oct 20", time: "11:00 AM", location: "Dehiwala", price: 2400 },
  ],
  cancelled: [
    { id: "x1", service: "AC Service", customer: "S. Fernando", date: "Oct 18", time: "3:00 PM", location: "Mt Lavinia", price: 5800 },
  ],
};
