import { useNavigate } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SKILLS = [
  { label: "Emergency Plumbing", emoji: "🛠️", on: true },
  { label: "Faucet Repair", emoji: "🔧", on: true },
  { label: "Pipe Replacement", emoji: "🪈", on: true },
  { label: "Water Heater", emoji: "💧", on: true },
  { label: "Toilet Repairs", emoji: "🚽", on: false },
  { label: "Bathroom Install", emoji: "🛁", on: true },
  { label: "Electrical (Basic)", emoji: "⚡", on: false },
  { label: "Painting", emoji: "🎨", on: false },
];

export function ProviderProfilePage() {
  const { profile, email } = useCurrentUser();
  const navigate = useNavigate();
  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? username ?? "Provider";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "P";

  const handleCancel = () => {
    if (username) navigate({ to: "/$username/dashboard", params: { username } });
  };
  const handleSave = () => toast.success("Profile updated");

  return (
    <ProviderLayout active="update-profile" newRequestsCount={2} reviewsCount={128}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Update Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your business, contact and verification details accurate
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCancel} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            Cancel
          </button>
          <button onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90">
            ✓ Save Changes
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Update your basic contact and personal details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="FULL NAME" defaultValue={displayName} />
              <Field label="DISPLAY NAME" defaultValue="JS Plumbing Pro" />
              <Field label="CONTACT NUMBER" defaultValue="+94 77 123 4567" />
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Service District</label>
                <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option>Colombo</option><option>Kandy</option><option>Gampaha</option><option>Galle</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Profile Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Professional plumber with 8+ years of experience. Specialising in emergency plumbing, faucet repairs, pipe replacements and bathroom installations. Available 7 days a week, 24/7 for emergencies. All work guaranteed."
                  className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold">Skills & Specialisations</h2>
            <p className="text-xs text-muted-foreground">Select all service categories you offer</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {SKILLS.map((s) => (
                <SkillChip key={s.label} {...s} />
              ))}
            </div>
          </section>

          {/* Working hours */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold">Working Hours</h2>
            <p className="text-xs text-muted-foreground">Set your standard availability window</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <SelectField label="START TIME" defaultValue="07:00 AM" options={["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM"]} />
              <SelectField label="END TIME" defaultValue="08:00 PM" options={["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]} />
              <SelectField label="EMERGENCY JOBS" defaultValue="Accept (24/7)" options={["Accept (24/7)", "Weekdays only", "Decline"]} />
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold">Profile Picture</h3>
            <div className="mt-4 flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-foreground text-2xl font-bold text-background">{initials}</div>
              <p className="mt-2 text-xs font-semibold">{displayName}</p>
            </div>
            <button className="mt-4 flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border px-4 py-5 text-xs text-muted-foreground hover:bg-muted">
              <Camera className="h-5 w-5" />
              <span className="font-semibold text-foreground">Upload new photo</span>
              <span className="text-[10px]">JPG or PNG · Max 5MB</span>
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold">Verification Status</h3>
            <div className="mt-4 space-y-2">
              <VerifyRow label="Identity (NIC)" status="verified" />
              <VerifyRow label="Trade Certificate" status="verified" />
              <VerifyRow label="Police Clearance" status="pending" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold">Service Rate</h3>
            <div className="mt-4 space-y-3">
              <Field label="HOURLY RATE (RS.)" defaultValue="2800" />
              <Field label="MINIMUM CALL-OUT FEE" defaultValue="1500" />
            </div>
          </section>
        </div>
      </div>

      <p className="sr-only">{email}</p>
    </ProviderLayout>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input key={defaultValue} type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function SelectField({ label, defaultValue, options }: { label: string; defaultValue: string; options: string[] }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <select defaultValue={defaultValue} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SkillChip({ label, emoji, on }: { label: string; emoji: string; on: boolean }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        on
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
      }`}
    >
      <span>{emoji}</span> {label}
    </button>
  );
}

function VerifyRow({ label, status }: { label: string; status: "verified" | "pending" }) {
  const verified = status === "verified";
  return (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${verified ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
      <span className="font-semibold text-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1 font-semibold ${verified ? "text-emerald-700" : "text-amber-700"}`}>
        {verified ? "✓ Verified" : "⏳ Pending"}
      </span>
    </div>
  );
}
