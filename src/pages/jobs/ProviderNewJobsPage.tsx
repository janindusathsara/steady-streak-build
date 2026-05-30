import { useEffect, useState } from "react";
import { Droplets, Clock, MapPin, Timer, Check, X, AlarmClock, Star } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { loadProviderBookings, updateBookingStatus, type Booking } from "@/lib/booking";

export function ProviderNewJobsPage() {
  const { profile } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setBookings(await loadProviderBookings(profile.id));
    setLoading(false);
  };
  useEffect(() => { void refresh(); }, [profile?.id]);

  const pending = bookings.filter((b) => b.status === "pending");
  const displayed: any[] = pending.length > 0 ? pending : SAMPLE;

  const act = async (b: Booking, status: Booking["status"]) => {
    try { await updateBookingStatus(b.id, status); toast.success(status === "accepted" ? "Job accepted" : "Job declined"); void refresh(); }
    catch (e: any) { toast.error(e.message || "Failed"); }
  };

  return (
    <ProviderLayout active="new-jobs" newRequestsCount={displayed.length} reviewsCount={128}>
      <div>
        <h1 className="text-3xl font-bold">New Job Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Incoming homeowner requests awaiting your Accept or Decline decision</p>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlarmClock className="h-5 w-5 text-amber-500" />
        <p className="text-xs text-amber-900">
          <span className="font-bold">{displayed.length} pending requests</span> — Please respond within the time window to maintain your response rate and Gold status.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : displayed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No new requests right now.
          </div>
        ) : (
          displayed.map((b: any) => (
            <RequestCard
              key={b.id}
              booking={b}
              onAccept={b.status ? () => act(b, "accepted") : undefined}
              onDecline={b.status ? () => act(b, "cancelled") : undefined}
            />
          ))
        )}
      </div>
    </ProviderLayout>
  );
}

function RequestCard({ booking, onAccept, onDecline }: { booking: any; onAccept?: () => void; onDecline?: () => void }) {
  const date = booking.scheduled_date ?? booking.date ?? "Tomorrow";
  const time = booking.scheduled_time ?? booking.time ?? "10:00 AM";
  const loc = booking.district ?? booking.location ?? "—";
  const note = booking.problem_desc ?? booking.note ?? "";

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <Droplets className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-bold">{booking.service_name ?? booking.service}</p>
              <p className="text-xs text-muted-foreground">
                Requested by <span className="font-semibold text-foreground">{booking.customer ?? "Customer"}</span> · {booking.requested ?? "3 hours ago"} ·
                <Star className="ml-1 inline h-3 w-3 fill-amber-400 text-amber-400" /> {booking.rating ?? "4.7"} homeowner rating
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">⌛ Pending</span>
            <p className="text-base font-bold">Rs. {(booking.total_amount ?? booking.price).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Field icon={Clock} label="Date" value={date} />
          <Field icon={Clock} label="Time" value={time} />
          <Field icon={MapPin} label="Location" value={loc} />
          <Field icon={Timer} label="Est. Duration" value={booking.duration ?? "2 hours"} />
        </div>

        {note && (
          <div className="mt-3 rounded-xl border border-border bg-card p-3 text-xs">
            <span className="font-bold">Note:</span> {note}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> Accept Job
            </button>
            <button
              onClick={onDecline}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-destructive hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" /> Decline
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">⏰ Respond within {booking.respond ?? "2 hours"}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

const SAMPLE = [
  { id: "n1", service: "Faucet & Tap Repair", customer: "Maria Santos", requested: "3 hours ago", rating: "4.7", date: "Tomorrow", time: "10:00 AM", location: "Gampaha", duration: "2 hours", price: 2800, note: "Kitchen faucet dripping constantly and bathroom tap handle is broken. I already have the replacement parts for the bathroom tap.", respond: "2 hours" },
  { id: "n2", service: "Water Heater Service", customer: "Priya Mendis", requested: "6 hours ago", rating: "4.9", date: "Oct 27", time: "09:00 AM", location: "Nugegoda", duration: "3 hours", price: 3500, note: "Solar water heater not heating properly. Please bring common replacement parts — thermostat and heating element.", respond: "6 hours" },
];
