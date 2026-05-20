import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Home as HomeIcon, Wrench, Upload, User as UserIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { toast } from "sonner";
import { setRole, dashboardPathFor } from "@/lib/role";

const DISTRICTS = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Negombo", "Jaffna", "Kurunegala", "Anuradhapura"];
const CATEGORIES = [
  { id: "plumbing", label: "Plumbing", emoji: "🔧" },
  { id: "electrical", label: "Electrical", emoji: "⚡" },
  { id: "painting", label: "Painting", emoji: "🎨" },
  { id: "carpentry", label: "Carpentry", emoji: "🪚" },
  { id: "hvac", label: "HVAC", emoji: "❄️" },
  { id: "cleaning", label: "Cleaning", emoji: "🧹" },
  { id: "masonry", label: "Masonry", emoji: "🧱" },
  { id: "welding", label: "Welding", emoji: "🔥" },
];

type Role = "homeowner" | "provider";

export function SignupPage() {
  const search = useSearch({ from: "/signup" }) as { role?: Role };
  const initial: Role = search.role === "provider" ? "provider" : "homeowner";
  const [role, setRoleLocal] = useState<Role>(initial);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {role === "homeowner" ? <><UserIcon className="h-3.5 w-3.5" /> Create Account</> : <><Wrench className="h-3.5 w-3.5" /> Join as Pro</>}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {role === "homeowner" ? "Join as a Homeowner" : "Register as a Service Provider"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {role === "homeowner"
              ? "Find verified professionals and book home services in minutes."
              : "Grow your business and connect with thousands of homeowners across Sri Lanka."}
          </p>
        </div>

        {/* Role tabs */}
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3">
          {[
            { v: "homeowner" as const, label: "Homeowner", Icon: HomeIcon },
            { v: "provider" as const, label: "Service Provider", Icon: Wrench },
          ].map(({ v, label, Icon }) => {
            const active = role === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setRoleLocal(v)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {role === "homeowner" ? <HomeownerForm /> : <ProviderForm />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------- Homeowner ------------------------------- */

function HomeownerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", district: "", address: "",
    password: "", confirm: "", agree: false,
  });

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!form.agree) return toast.error("Please accept the Terms of Service");
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}${dashboardPathFor("homeowner")}`,
          data: {
            full_name: `${form.firstName} ${form.lastName}`.trim(),
            role: "homeowner",
            phone: form.phone,
            district: form.district,
            address: form.address,
          },
        },
      });
      if (error) throw error;
      setRole("homeowner");
      toast.success("Account created! Check your email to verify.");
      navigate({ to: dashboardPathFor("homeowner") });
    } catch (err: any) {
      toast.error(err.message ?? "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {/* Profile photo */}
      <div className="flex flex-col items-start gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-primary/5 text-primary">
          <UserIcon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Profile Photo</p>
          <p className="text-xs text-muted-foreground">Add a photo to personalize your account (optional)</p>
          <button type="button" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
            <Upload className="h-3.5 w-3.5" /> Upload Photo
          </button>
        </div>
      </div>

      <div className="grid gap-4 pt-6 sm:grid-cols-2">
        <Field label="First Name" required>
          <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="e.g. Kavindu" className={inputCls} />
        </Field>
        <Field label="Last Name" required>
          <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="e.g. Perera" className={inputCls} />
        </Field>
        <Field label="Email Address" required className="sm:col-span-2">
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
        </Field>
        <Field label="Phone Number" required>
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+94 77 123 4567" className={inputCls} />
        </Field>
        <Field label="District">
          <select value={form.district} onChange={(e) => update("district", e.target.value)} className={inputCls}>
            <option value="">Select district</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Home Address" className="sm:col-span-2" hint="Used to match you with nearby service providers">
          <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, City" className={inputCls} />
        </Field>
        <Field label="Password" required className="sm:col-span-2" hint="Use 8+ characters with numbers and symbols">
          <div className="relative">
            <input required minLength={8} type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Create a strong password" className={inputCls + " pr-10"} />
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm Password" required className="sm:col-span-2">
          <input required type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Re-enter your password" className={inputCls} />
        </Field>
      </div>

      <label className="mt-6 flex items-start gap-2.5 text-sm text-muted-foreground">
        <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary" />
        <span>I agree to FixItNow's <a className="font-medium text-primary hover:underline" href="#">Terms of Service</a> and <a className="font-medium text-primary hover:underline" href="#">Privacy Policy</a>. I consent to receiving booking confirmations and service updates.</span>
      </label>

      <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60">
        {loading ? "Creating account…" : "Create My Homeowner Account →"}
      </button>

      <Divider />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in here</Link>
      </p>
    </form>
  );
}

/* ----------------------------- Service Provider ----------------------------- */

function ProviderForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", nic: "", phone: "", email: "",
    district: "", radius: "Within 5 km",
    business: "", years: "Less than 1 year", category: "plumbing",
    bio: "", hourly: "", availability: "Weekdays (Mon–Fri)",
    password: "", confirm: "", agree: false,
  });
  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!form.agree) return toast.error("Please confirm and accept the terms");
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}${dashboardPathFor("provider")}`,
          data: {
            full_name: `${form.firstName} ${form.lastName}`.trim(),
            role: "provider",
            nic: form.nic, phone: form.phone, district: form.district,
            radius: form.radius, business: form.business, years: form.years,
            category: form.category, bio: form.bio, hourly: form.hourly,
            availability: form.availability,
          },
        },
      });
      if (error) throw error;
      setRole("provider");
      toast.success("Application submitted! We'll review within 24–48 hours.");
      navigate({ to: dashboardPathFor("provider") });
    } catch (err: any) {
      toast.error(err.message ?? "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <p className="text-foreground">Verification documents will be reviewed within 24–48 hours. You'll receive an email once your account is approved and activated.</p>
      </div>

      {/* Personal */}
      <Card title="Personal Information">
        <div className="flex flex-col items-start gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-primary/5 text-primary">
            <UserIcon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Professional Profile Photo</p>
            <p className="text-xs text-muted-foreground">A clear headshot builds trust with homeowners (required for verification)</p>
            <button type="button" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
              <Upload className="h-3.5 w-3.5" /> Upload Photo
            </button>
          </div>
        </div>
        <div className="grid gap-4 pt-6 sm:grid-cols-2">
          <Field label="First Name" required><input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="e.g. Nuwan" className={inputCls} /></Field>
          <Field label="Last Name" required><input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="e.g. Silva" className={inputCls} /></Field>
          <Field label="NIC Number" required><input required value={form.nic} onChange={(e) => update("nic", e.target.value)} placeholder="e.g. 199512345678" className={inputCls} /></Field>
          <Field label="Phone Number" required><input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+94 77 123 4567" className={inputCls} /></Field>
          <Field label="Email Address" required className="sm:col-span-2"><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="professional@email.com" className={inputCls} /></Field>
          <Field label="District" required>
            <select required value={form.district} onChange={(e) => update("district", e.target.value)} className={inputCls}>
              <option value="">Select district</option>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Service Radius">
            <select value={form.radius} onChange={(e) => update("radius", e.target.value)} className={inputCls}>
              <option>Within 5 km</option><option>Within 10 km</option><option>Within 25 km</option><option>Anywhere in district</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* Professional */}
      <Card title="Professional Details">
        <div className="space-y-4">
          <Field label="Business / Trade Name" required><input required value={form.business} onChange={(e) => update("business", e.target.value)} placeholder="e.g. Nuwan's Plumbing Services" className={inputCls} /></Field>
          <Field label="Years of Experience" required>
            <select required value={form.years} onChange={(e) => update("years", e.target.value)} className={inputCls}>
              <option>Less than 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5–10 years</option><option>10+ years</option>
            </select>
          </Field>
          <div>
            <p className="mb-2 text-xs font-semibold">Primary Service Category <span className="text-destructive">*</span></p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = form.category === c.id;
                return (
                  <button key={c.id} type="button" onClick={() => update("category", c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}>
                    <span>{c.emoji}</span> {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Field label="Brief Bio / Service Description">
            <textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Describe your expertise, specialties, and what makes your service stand out…" className={inputCls + " resize-none"} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hourly Rate (LKR)">
              <div className="relative">
                <input value={form.hourly} onChange={(e) => update("hourly", e.target.value)} placeholder="e.g. 2500" className={inputCls + " pr-10"} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
              </div>
            </Field>
            <Field label="Availability">
              <select value={form.availability} onChange={(e) => update("availability", e.target.value)} className={inputCls}>
                <option>Weekdays (Mon–Fri)</option><option>Weekends</option><option>Every day</option><option>Evenings only</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      {/* Verification docs */}
      <Card title="Verification Documents">
        <div className="space-y-4">
          <UploadBox label="NIC / Passport Copy" required hint="JPG, PNG or PDF — max 5MB" />
          <UploadBox label="Trade Certificate / Qualification" hint="JPG, PNG or PDF — max 5MB" />
        </div>
      </Card>

      {/* Security */}
      <Card title="Account Security">
        <div className="space-y-4">
          <Field label="Password" required hint="Use 8+ characters with numbers and symbols">
            <div className="relative">
              <input required minLength={8} type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Create a strong password" className={inputCls + " pr-10"} />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password" required><input required type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Re-enter your password" className={inputCls} /></Field>
          <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <span>I confirm that all information provided is accurate. I agree to FixItNow's <a className="font-medium text-primary hover:underline" href="#">Terms of Service</a>, <a className="font-medium text-primary hover:underline" href="#">Privacy Policy</a>, and Provider Code of Conduct.</span>
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? "Submitting…" : "Submit Application for Review →"}
          </button>
          <Divider />
          <p className="text-center text-sm text-muted-foreground">
            Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in here</Link>
          </p>
        </div>
      </Card>
    </form>
  );
}

/* --------------------------------- bits --------------------------------- */

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow";

function Field({ label, required, hint, className = "", children }: { label: string; required?: boolean; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold">{label} {required && <span className="text-destructive">*</span>}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-primary">{title}</h2>
      {children}
    </section>
  );
}

function UploadBox({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold">{label} {required && <span className="text-destructive">*</span>}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center hover:bg-primary/10 transition-colors">
        <Upload className="h-6 w-6 text-primary" />
        <p className="text-sm font-medium">Click to upload {label.split(" /")[0]}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
        <input type="file" className="hidden" accept="image/*,application/pdf" />
      </label>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
      <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
    </div>
  );
}
