import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, X, Star } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { findProviderRequest } from "@/lib/provider-requests-data";
import { toast } from "sonner";

export function AdminProviderRequestDetailPage({ id }: { id: string }) {
  const { username } = useParams({ from: "/_authenticated/$username/provider-request/$id" });
  const navigate = useNavigate();
  const req = findProviderRequest(id);

  if (!req) {
    return (
      <AdminLayout active="provider-requests">
        <div className="rounded-2xl border border-background/10 bg-background/5 p-10 text-center">
          <p className="text-background/70">Request not found.</p>
          <Link to="/$username/provider-request" params={{ username }} className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Back</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="provider-requests">
      <div className="mb-5 flex items-center gap-4">
        <Link to="/$username/provider-request" params={{ username }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-background/15 px-3 py-1.5 text-xs font-semibold text-background/80 hover:bg-background/10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-background">Provider Application — {req.name}</h1>
          <p className="text-xs text-background/55">Submitted {req.applied} · Awaiting admin decision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="rounded-2xl border border-background/10 bg-background/5 p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{req.initials}</div>
            <div>
              <h2 className="text-lg font-bold text-background">{req.name}</h2>
              <p className="text-xs text-background/55">{req.category} · Applied {req.appliedAt}</p>
              <span className="mt-1.5 inline-block rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">Pending Review</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Full Name" value={req.fullName} />
            <Field label="NIC Number" value={req.nic} />
            <Field label="Phone" value={req.phone} />
            <Field label="Email" value={req.email} />
            <Field label="Service Category" value={`${req.categoryIcon} ${req.category}`} />
            <Field label="Sub-Speciality" value={req.subSpeciality} />
            <Field label="District" value={req.district} />
            <Field label="Experience" value={req.experience} />
            <Field label="Hourly Rate" value={req.hourlyRate} />
            <Field label="Availability" value={req.availability} />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-background/40">Uploaded Documents</p>
            <div className="flex flex-wrap gap-2">
              {req.documents.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5 rounded-md border border-background/15 bg-background/5 px-3 py-1.5 text-xs text-background/80">
                  <span>{d.icon}</span>{d.name} <Check className="h-3 w-3 text-emerald-400" />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-background/40">Admin Notes</p>
            <textarea defaultValue={req.adminNotes} rows={3}
              className="w-full rounded-lg border border-background/15 bg-background/5 p-3 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { toast.success("Provider approved"); navigate({ to: "/$username/provider-request", params: { username } }); }}
              className="rounded-lg bg-emerald-500/90 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">✓ Approve Provider</button>
            <button onClick={() => { toast.error("Application rejected"); navigate({ to: "/$username/provider-request", params: { username } }); }}
              className="rounded-lg border border-destructive/50 px-5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10">✗ Reject Application</button>
            <button onClick={() => navigate({ to: "/$username/provider-request", params: { username } })}
              className="rounded-lg border border-background/15 px-5 py-2.5 text-sm font-semibold text-background/80 hover:bg-background/10">Cancel</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background/40">Application Score</p>
            <div className="mt-3 text-center">
              <p className="text-3xl font-bold text-emerald-400">{req.score}<span className="text-lg text-background/40">/100</span></p>
              <p className="mt-1 text-xs text-background/60">{req.scoreLabel}</p>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              {req.checks.map((c) => (
                <div key={c.label} className="flex items-center justify-between border-t border-background/10 pt-2 first:border-0 first:pt-0">
                  <span className="text-background/70">{c.label}</span>
                  <span className={c.ok ? "font-bold text-emerald-400" : "font-bold text-primary"}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {req.similar.length > 0 && (
            <div className="rounded-2xl border border-background/10 bg-background/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-background/40">Similar Providers Nearby</p>
              <div className="mt-3 space-y-3">
                {req.similar.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-[10px] font-bold text-background">{s.i}</div>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-background">{s.name}</p>
                      <p className="flex items-center gap-1 text-background/55">{s.meta} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{s.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-background/10 bg-background/5 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-background/40">{label}</p>
      <p className="mt-1 text-sm font-semibold text-background">{value}</p>
    </div>
  );
}
