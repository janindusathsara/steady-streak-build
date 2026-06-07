import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearch, useParams } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, MapPin, Star, Clock, Shield, Lock, Zap, CalendarDays, Search, Edit2 } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  loadCategories, loadSubServices, loadProvidersForCategory, getSubService,
  createBooking, type Category, type SubService, type Provider, type Booking,
} from "@/lib/booking";

const STEPS = [
  { n: 1, label: "Select Service" },
  { n: 2, label: "Choose Provider" },
  { n: 3, label: "Schedule" },
  { n: 4, label: "Confirm & Pay" },
  { n: 5, label: "Booking Done" },
];

type JobType = "on_the_spot" | "scheduled";

export function BookingWizard() {
  const search = useSearch({ from: "/$username/book" }) as { subService?: string; provider?: string; step?: number };
  const { username } = useParams({ from: "/$username/book" });
  const navigate = useNavigate();
  const { profile, loading: userLoading } = useCurrentUser();

  const [step, setStep] = useState(search.step ?? 1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subServiceId, setSubServiceId] = useState<string | null>(search.subService ?? null);
  const [jobType, setJobType] = useState<JobType>("on_the_spot");
  const [problemDesc, setProblemDesc] = useState("");

  const [providerId, setProviderId] = useState<string | null>(search.provider ?? null);

  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [scheduledTime, setScheduledTime] = useState<string>("10:00 AM");
  const [addressLine, setAddressLine] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [postalCode, setPostalCode] = useState("");
  const [landmarks, setLandmarks] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agree, setAgree] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // load categories
  useEffect(() => {
    loadCategories().then(setCategories).catch((e) => toast.error(e.message));
  }, []);

  // preload subService if passed in
  useEffect(() => {
    if (search.subService && !categoryId) {
      getSubService(search.subService).then((s) => {
        if (s) {
          setCategoryId(s.category_id);
          setSubServiceId(s.id);
        }
      });
    }
  }, [search.subService]);

  // preload provider if passed in (from "Book Now" on a provider card)
  useEffect(() => {
    if (!search.provider) return;
    import("@/integrations/supabase/client").then(({ supabase }) =>
      supabase
        .from("providers")
        .select("*, profile:profiles(id, display_name, username, avatar_url)")
        .eq("id", search.provider!)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProviders((prev) => (prev.some((p) => p.id === (data as any).id) ? prev : [data as any, ...prev]));
            setProviderId((data as any).id);
            if (!categoryId && (data as any).category_id) setCategoryId((data as any).category_id);
          }
        })
    );
  }, [search.provider]);

  // load sub-services when category changes
  useEffect(() => {
    if (categoryId) loadSubServices(categoryId).then(setSubServices);
    else setSubServices([]);
  }, [categoryId]);

  // load providers when entering step 2
  useEffect(() => {
    if (step === 2 && categoryId) {
      loadProvidersForCategory(categoryId).then(setProviders);
    }
  }, [step, categoryId]);

  const subService = useMemo(() => subServices.find((s) => s.id === subServiceId), [subServices, subServiceId]);
  const provider = useMemo(() => providers.find((p) => p.id === providerId), [providers, providerId]);
  const category = useMemo(() => categories.find((c) => c.id === categoryId), [categories, categoryId]);

  const hourlyRate = provider?.hourly_rate ?? 2800;
  const estHours = 2;
  const platformFee = 200;
  const totalAmount = hourlyRate * estHours + platformFee;

  // step gating
  const canNext = () => {
    if (step === 1) return !!(categoryId && subServiceId);
    if (step === 2) return !!providerId;
    if (step === 3) return !!(addressLine.trim() && scheduledTime);
    if (step === 4) return agree && !!profile?.id;
    return false;
  };

  const handleConfirm = async () => {
    if (!profile?.id || !provider || !subService) return;
    setSubmitting(true);
    try {
      const b = await createBooking({
        homeowner_id: profile.id,
        provider_id: provider.id,
        sub_service_id: subService.id,
        service_name: subService.name,
        job_type: jobType,
        scheduled_date: jobType === "scheduled" ? scheduledDate.toISOString().slice(0, 10) : null,
        scheduled_time: scheduledTime,
        address_line: addressLine.trim(),
        district,
        postal_code: postalCode,
        landmarks,
        problem_desc: problemDesc,
        hourly_rate: hourlyRate,
        est_hours: estHours,
        platform_fee: platformFee,
        total_amount: totalAmount,
      });
      setConfirmedBooking(b);
      setStep(5);
      toast.success("Booking confirmed!");
    } catch (e: any) {
      toast.error(e.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!profile) {
    // shouldn't render — route handles redirect, but safe-guard
    navigate({ to: "/login", search: { redirect: `/${username}/book` } as any });
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <Stepper current={step} />

        {step === 1 && (
          <Step1
            categories={categories}
            subServices={subServices}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            subServiceId={subServiceId}
            setSubServiceId={setSubServiceId}
            jobType={jobType}
            setJobType={setJobType}
            problemDesc={problemDesc}
            setProblemDesc={setProblemDesc}
            onNext={() => setStep(2)}
            canNext={canNext()}
          />
        )}

        {step === 2 && (
          <Step2
            providers={providers}
            providerId={providerId}
            setProviderId={setProviderId}
            subService={subService}
            jobType={jobType}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            canNext={canNext()}
          />
        )}

        {step === 3 && (
          <Step3
            provider={provider}
            subService={subService}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
            addressLine={addressLine}
            setAddressLine={setAddressLine}
            district={district}
            setDistrict={setDistrict}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            landmarks={landmarks}
            setLandmarks={setLandmarks}
            hourlyRate={hourlyRate}
            platformFee={platformFee}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            canNext={canNext()}
          />
        )}

        {step === 4 && (
          <Step4
            category={category}
            subService={subService}
            provider={provider}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            addressLine={addressLine}
            district={district}
            jobType={jobType}
            hourlyRate={hourlyRate}
            estHours={estHours}
            platformFee={platformFee}
            totalAmount={totalAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            agree={agree}
            setAgree={setAgree}
            submitting={submitting}
            onBack={() => setStep(3)}
            onConfirm={handleConfirm}
            canConfirm={canNext()}
          />
        )}

        {step === 5 && confirmedBooking && (
          <Step5
            booking={confirmedBooking}
            provider={provider}
            subService={subService}
            username={profile.username}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done ? "bg-emerald-600 text-white" : active ? "bg-foreground text-background" : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"} hidden sm:block`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px w-6 sm:w-12 ${done ? "bg-emerald-600" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Step 1 ---------- */
function Step1(p: {
  categories: Category[]; subServices: SubService[];
  categoryId: string | null; setCategoryId: (v: string) => void;
  subServiceId: string | null; setSubServiceId: (v: string) => void;
  jobType: JobType; setJobType: (v: JobType) => void;
  problemDesc: string; setProblemDesc: (v: string) => void;
  onNext: () => void; canNext: boolean;
}) {
  const cat = p.categories.find((c) => c.id === p.categoryId);
  return (
    <div>
      <p className="mx-auto w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Step 1 of 5</p>
      <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">What service do you need?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Choose a category and tell us a bit about the job</p>

      <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SectionLabel>Select a category</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {p.categories.map((c) => {
            const active = c.id === p.categoryId;
            return (
              <button
                key={c.id}
                onClick={() => { p.setCategoryId(c.id); p.setSubServiceId(""); }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                  active ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted/50"
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.pros_count.toLocaleString()}+ pros</p>
              </button>
            );
          })}
        </div>

        {p.categoryId && (
          <>
            <div className="my-6 border-t border-border" />
            <SectionLabel>Select specific service {cat ? `(${cat.name})` : ""}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {p.subServices.map((s) => {
                const active = s.id === p.subServiceId;
                return (
                  <button
                    key={s.id}
                    onClick={() => p.setSubServiceId(s.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                      active ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">{s.icon}</div>
                      <div>
                        <p className="text-sm font-bold">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">{s.description}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold whitespace-nowrap">Rs. {s.base_price.toLocaleString()}+</p>
                  </button>
                );
              })}
              {p.subServices.length === 0 && (
                <p className="col-span-2 text-center text-sm text-muted-foreground py-6">Pick a category to see services.</p>
              )}
            </div>

            <div className="my-6 border-t border-border" />
            <SectionLabel>Job type</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { v: "on_the_spot" as const, icon: <Zap className="h-6 w-6 mx-auto text-amber-500" />, t: "On-the-Spot", d: "Book now — provider arrives within hours" },
                { v: "scheduled" as const, icon: <CalendarDays className="h-6 w-6 mx-auto text-primary" />, t: "Schedule Ahead", d: "Choose a date & time that suits you" },
              ].map((o) => {
                const active = p.jobType === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => p.setJobType(o.v)}
                    className={`rounded-xl border p-5 text-center transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted/50"}`}
                  >
                    {o.icon}
                    <p className="mt-2 text-sm font-bold">{o.t}</p>
                    <p className="text-[11px] text-muted-foreground">{o.d}</p>
                  </button>
                );
              })}
            </div>

            <div className="my-6 border-t border-border" />
            <SectionLabel>Describe the problem <span className="text-muted-foreground font-normal normal-case">(optional but helpful)</span></SectionLabel>
            <textarea
              value={p.problemDesc}
              onChange={(e) => p.setProblemDesc(e.target.value)}
              rows={4}
              placeholder="e.g. The kitchen tap has been dripping for 2 days, water pressure seems low…"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <button
              onClick={p.onNext}
              disabled={!p.canNext}
              className="mt-6 w-full rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-40"
            >
              Continue to Choose Provider →
            </button>
            <Link to="/services" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">← Back to Services</Link>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 2 ---------- */
function Step2(p: {
  providers: Provider[]; providerId: string | null; setProviderId: (v: string) => void;
  subService?: SubService; jobType: JobType;
  onBack: () => void; onNext: () => void; canNext: boolean;
}) {
  const selected = p.providers.find((x) => x.id === p.providerId);
  const estLow = selected ? selected.hourly_rate * 1.5 : 0;
  const estHigh = selected ? selected.hourly_rate * 2 : 0;
  return (
    <div>
      <p className="mx-auto w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Step 2 of 5</p>
      <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">Choose your provider</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">All providers are verified and background-checked</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Search by name or specialty…" className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select className="rounded-full border border-border bg-background px-3 py-2.5 text-sm">
              <option>Sort: Top Rated</option>
              <option>Sort: Nearest</option>
              <option>Sort: Lowest Price</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {p.providers.length === 0 && (
              <p className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                No providers available for this service yet.
              </p>
            )}
            {p.providers.map((pr) => {
              const active = pr.id === p.providerId;
              const name = pr.profile?.display_name ?? pr.profile?.username ?? "Service Pro";
              const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={pr.id} className={`rounded-2xl border p-5 transition-all ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">{initials}</div>
                      <div>
                        <p className="text-base font-bold">{name}</p>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{pr.headline}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {pr.top_rated && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">⭐ Top Rated</span>}
                          {pr.verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">✓ Verified</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => p.setProviderId(pr.id)}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${active ? "bg-emerald-600 text-white" : "bg-foreground text-background hover:opacity-90"}`}
                    >
                      {active ? "✓ Selected" : "Select"}
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-muted/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
                    <div><p className="text-sm font-bold text-foreground">{pr.rating}</p>Rating</div>
                    <div><p className="text-sm font-bold text-foreground">{pr.jobs_done}</p>Jobs</div>
                    <div><p className="text-sm font-bold text-foreground">{pr.years_experience} yrs</p>Experience</div>
                    <div><p className="text-sm font-bold text-foreground">{pr.distance_km}km</p>Away</div>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {pr.city} · {pr.distance_km} km away</p>
                  <p className="mt-3 text-base font-bold">Rs. {pr.hourly_rate.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Your selection</p>
              {selected ? (
                <>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      {(selected.profile?.display_name ?? "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selected.profile?.display_name ?? "Service Pro"}</p>
                      <p className="text-[11px] text-muted-foreground">{selected.headline} · ⭐ {selected.rating}</p>
                    </div>
                  </div>
                  <dl className="mt-4 space-y-2 text-xs">
                    <Row k="Service" v={p.subService?.name ?? "—"} />
                    <Row k="Type" v={p.jobType === "on_the_spot" ? "On-the-Spot" : "Scheduled"} />
                    <Row k="Provider Rate" v={`Rs. ${selected.hourly_rate.toLocaleString()}/hr`} />
                    <Row k="Est. Duration" v="1–2 hours" />
                  </dl>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <p className="text-xs font-semibold">Estimated Cost</p>
                    <p className="text-sm font-bold text-primary">Rs. {estLow.toLocaleString()}–{estHigh.toLocaleString()}</p>
                  </div>
                  <button onClick={p.onNext} disabled={!p.canNext} className="mt-4 w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background hover:opacity-90 disabled:opacity-40">
                    Continue to Schedule →
                  </button>
                  <button onClick={p.onBack} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground">← Change service</button>
                </>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Pick a provider on the left to continue.</p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Why this pro?</p>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>🛡 NIC & trade certificate verified</li>
                <li>📍 Closest available — 2.4km away</li>
                <li>⚡ Arrives within 2 hours</li>
                <li>⭐ Rated highly by past customers</li>
                <li>🔒 Payment protected by escrow</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */
function Step3(p: {
  provider?: Provider; subService?: SubService;
  scheduledDate: Date; setScheduledDate: (d: Date) => void;
  scheduledTime: string; setScheduledTime: (t: string) => void;
  addressLine: string; setAddressLine: (v: string) => void;
  district: string; setDistrict: (v: string) => void;
  postalCode: string; setPostalCode: (v: string) => void;
  landmarks: string; setLandmarks: (v: string) => void;
  hourlyRate: number; platformFee: number;
  onBack: () => void; onNext: () => void; canNext: boolean;
}) {
  const slots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];
  const monthLabel = p.scheduledDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const monthDays = generateMonthDays(p.scheduledDate);
  const providerName = p.provider?.profile?.display_name ?? "your provider";
  const estLow = p.hourlyRate * 1.5 + p.platformFee;
  const estHigh = p.hourlyRate * 2 + p.platformFee;
  return (
    <div>
      <p className="mx-auto w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Step 3 of 5</p>
      <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">When should {providerName.split(" ")[0]} arrive?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Pick a date, time slot, and confirm your address</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Calendar */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Select a date</p>
            <div className="mt-3 flex items-center justify-between">
              <button className="rounded-full border border-border p-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
              <p className="text-sm font-bold">{monthLabel}</p>
              <button className="rounded-full border border-border p-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {monthDays.map((d, i) => {
                if (!d) return <div key={i} />;
                const sel = d.toDateString() === p.scheduledDate.toDateString();
                const past = d < new Date(new Date().setHours(0,0,0,0));
                return (
                  <button
                    key={i}
                    disabled={past}
                    onClick={() => p.setScheduledDate(d)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      sel ? "bg-foreground text-background" : past ? "text-muted-foreground/40" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Select a time slot — {p.scheduledDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const active = s === p.scheduledTime;
                return (
                  <button
                    key={s}
                    onClick={() => p.setScheduledTime(s)}
                    className={`rounded-xl border p-3 text-center transition-colors ${active ? "border-foreground bg-primary/10" : "border-border bg-background hover:bg-muted/50"}`}
                  >
                    <p className="text-sm font-bold">{s}</p>
                    <p className="text-[10px] text-muted-foreground">{active ? "✓ Selected" : "Open"}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">📍 Service address</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold">Street Address *</label>
                <input value={p.addressLine} onChange={(e) => p.setAddressLine(e.target.value)} placeholder="e.g. 42 Palm Grove, Colombo 3" className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold">District *</label>
                  <select value={p.district} onChange={(e) => p.setDistrict(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                    {["Colombo","Gampaha","Kalutara","Kandy","Galle","Matara","Jaffna","Negombo"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">Postal Code</label>
                  <input value={p.postalCode} onChange={(e) => p.setPostalCode(e.target.value)} placeholder="00300" className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold">Landmarks / Access Notes</label>
                <textarea value={p.landmarks} onChange={(e) => p.setLandmarks(e.target.value)} rows={3} placeholder="Blue gate on the left of the road. Third house." className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <p className="rounded-lg bg-primary/10 p-3 text-xs text-muted-foreground">🔒 Your address is only shared with the provider after booking confirmation. All location data is encrypted.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Booking summary</p>
              {p.provider && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {(p.provider.profile?.display_name ?? "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{p.provider.profile?.display_name ?? "Pro"}</p>
                    <p className="text-[11px] text-muted-foreground">⭐ {p.provider.rating} · {p.provider.headline}</p>
                  </div>
                </div>
              )}
              <dl className="mt-4 space-y-2 text-xs">
                <Row k="Service" v={p.subService?.name ?? "—"} />
                <Row k="Date" v={p.scheduledDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} />
                <Row k="Time" v={p.scheduledTime} />
                <Row k="Address" v={p.addressLine || "—"} />
              </dl>
              <div className="mt-3 border-t border-border pt-3 space-y-2 text-xs">
                <Row k="Provider Rate" v={`Rs. ${p.hourlyRate.toLocaleString()}/hr`} />
                <Row k="Est. Duration" v="1–2 hrs" />
                <Row k="Platform Fee" v={`Rs. ${p.platformFee}`} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <p className="text-xs font-bold">Est. Total</p>
                <p className="text-sm font-bold text-primary">Rs. {estLow.toLocaleString()}–{estHigh.toLocaleString()}</p>
              </div>
              <button onClick={p.onNext} disabled={!p.canNext} className="mt-4 w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background hover:opacity-90 disabled:opacity-40">
                Continue to Payment →
              </button>
              <button onClick={p.onBack} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground">← Change provider</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Step 4 ---------- */
function Step4(p: {
  category?: Category; subService?: SubService; provider?: Provider;
  scheduledDate: Date; scheduledTime: string; addressLine: string; district: string;
  jobType: JobType;
  hourlyRate: number; estHours: number; platformFee: number; totalAmount: number;
  paymentMethod: string; setPaymentMethod: (v: string) => void;
  agree: boolean; setAgree: (v: boolean) => void;
  submitting: boolean; onBack: () => void; onConfirm: () => void; canConfirm: boolean;
}) {
  const labour = p.hourlyRate * p.estHours;
  const providerName = p.provider?.profile?.display_name ?? "Provider";
  return (
    <div>
      <p className="mx-auto w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Step 4 of 5 · Final step</p>
      <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">Review & Confirm Booking</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Check all details, choose your payment method, and confirm</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Booking details review */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Booking details review</p>
            <div className="mt-4 space-y-3">
              <ReviewRow icon="🔧" title="Service" sub={`${p.category?.name ?? ""} · ${p.subService?.name ?? ""}`} value={p.subService?.name ?? ""} />
              <ReviewRow icon="👷" title="Provider" sub={`${p.provider?.headline ?? ""} · ⭐ ${p.provider?.rating ?? ""}`} value={providerName} />
              <ReviewRow icon="📅" title="Date & Time" sub={p.scheduledDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} value={p.scheduledTime} />
              <ReviewRow icon="📍" title="Service Address" sub={`${p.district}, Sri Lanka`} value={p.addressLine} />
              <ReviewRow icon="⚡" title="Job Type" sub={p.jobType === "on_the_spot" ? "Provider arrives same day" : "Pre-scheduled"} value={p.jobType === "on_the_spot" ? "On-the-Spot" : "Scheduled"} />
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Payment method</p>
            <div className="mt-4 space-y-3">
              {[
                { v: "card", icon: "💳", t: "Visa •••• 4242", d: "Expires 08/27 · Secure & encrypted", tag: "Default" },
                { v: "wallet", icon: "💰", t: "FixItNow Wallet", d: "Balance: Rs. 124,050 available" },
                { v: "bank", icon: "🏦", t: "Bank Transfer", d: "Sampath Bank · Manual verification" },
                { v: "genie", icon: "📱", t: "Dialog Genie", d: "Mobile wallet payment" },
              ].map((o) => {
                const active = p.paymentMethod === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => p.setPaymentMethod(o.v)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted/50"}`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-primary bg-primary" : "border-border"}`}>
                      {active && <span className="h-2 w-2 rounded-full bg-background" />}
                    </span>
                    <span className="text-2xl">{o.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{o.t} {o.tag && <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">{o.tag}</span>}</p>
                      <p className="text-[11px] text-muted-foreground">{o.d}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700">
              <p className="font-bold">🛡 Your payment is protected by escrow.</p>
              <p className="mt-1">Funds are held securely by FixItNow and only released to {providerName} after you confirm the job is satisfactorily complete. You are fully protected.</p>
            </div>

            <label className="mt-4 flex items-start gap-2 text-xs">
              <input type="checkbox" checked={p.agree} onChange={(e) => p.setAgree(e.target.checked)} className="mt-0.5" />
              <span>I agree to FixItNow's <span className="font-bold underline">Terms of Service</span> and <span className="font-bold underline">Booking Policy</span>. I confirm all booking details above are correct and authorise FixItNow to hold Rs. {p.totalAmount.toLocaleString()} in escrow.</span>
            </label>

            <button
              onClick={p.onConfirm}
              disabled={!p.canConfirm || p.submitting}
              className="mt-5 w-full rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" /> {p.submitting ? "Processing…" : `Confirm & Pay Rs. ${p.totalAmount.toLocaleString()} →`}
            </button>
            <button onClick={p.onBack} className="mt-3 block w-full text-center text-xs text-muted-foreground hover:text-foreground">← Back to schedule | SSL encrypted · PCI compliant</button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Order summary</p>
              {p.provider && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {(p.provider.profile?.display_name ?? "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{providerName}</p>
                    <p className="text-[11px] text-muted-foreground">⭐ {p.provider.rating} · {p.provider.headline} · {p.provider.jobs_done} jobs</p>
                  </div>
                </div>
              )}
              <dl className="mt-4 space-y-2 text-xs">
                <Row k="Service" v={p.subService?.name ?? ""} />
                <Row k="Date" v={p.scheduledDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} />
                <Row k="Time" v={p.scheduledTime} />
                <Row k="Duration (est.)" v={`${p.estHours} hours`} />
              </dl>
              <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                <Row k={`Labour (${p.estHours}hr × Rs. ${p.hourlyRate.toLocaleString()})`} v={`Rs. ${labour.toLocaleString()}`} />
                <Row k="Platform Fee" v={`Rs. ${p.platformFee}`} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <p className="text-sm font-bold">Total (Escrow)</p>
                <p className="text-base font-bold text-primary">Rs. {p.totalAmount.toLocaleString()}</p>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">Final amount adjusted after job completion</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold flex items-center gap-1"><Shield className="h-4 w-4" /> Payment Protection</p>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>🛡 Escrow holds your money until job done</li>
                <li>🔒 256-bit SSL encrypted transaction</li>
                <li>✅ Full refund if provider cancels</li>
                <li>📞 Dispute team available 24/7</li>
                <li>📄 Auto invoice after completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Step 5 ---------- */
function Step5({ booking, provider, subService, username }: { booking: Booking; provider?: Provider; subService?: SubService; username: string }) {
  const providerName = provider?.profile?.display_name ?? "the provider";
  const labour = booking.hourly_rate * booking.est_hours;
  return (
    <div>
      <p className="mx-auto w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">✓ Booking confirmed</p>
      <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">You're all set!</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Your booking is confirmed and {providerName} has been notified</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-200 bg-emerald-50">
              <Check className="h-10 w-10 text-emerald-600" strokeWidth={3} />
            </div>
            <h2 className="mt-4 text-xl font-bold">Booking Confirmed!</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your service request has been successfully placed. An SMS & email confirmation has been sent to your registered details.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs">
              <span className="font-semibold text-primary">Booking Ref ·</span>
              <span className="font-bold">#{booking.ref_code}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Booking summary</p>
            <div className="mt-4 space-y-3">
              <SummaryRow icon="🔧" t="Service" sub={`${subService?.description ?? ""}`} v={booking.service_name} />
              <SummaryRow icon="📅" t="Scheduled Date & Time" sub={new Date(booking.scheduled_date ?? booking.created_at).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} v={booking.scheduled_time ?? "—"} />
              <SummaryRow icon="📍" t="Service Address" sub={`${booking.district ?? ""}, Sri Lanka`} v={booking.address_line} />
              <SummaryRow icon="💳" t="Payment" sub={`Rs. ${booking.total_amount.toLocaleString()} held in escrow`} v="✓ Paid" badge />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Assigned professional</p>
            {provider && (
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {providerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-bold">{providerName}</p>
                    <p className="text-[11px] text-muted-foreground">{provider.headline} · {provider.years_experience} yrs experience · {provider.jobs_done} jobs completed</p>
                    <p className="text-[11px] text-amber-600">⭐⭐⭐⭐⭐ {provider.rating} ({provider.jobs_done} reviews)</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">✓ Verified Pro</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">What happens next</p>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                { t: "Booking Confirmed", d: `Your booking is placed. Payment of Rs. ${booking.total_amount.toLocaleString()} is held securely in escrow.`, when: "Just now", done: true },
                { t: "Provider Notified", d: `${providerName} has been alerted and will accept your job request.`, when: "A few seconds ago", done: true },
                { t: "Provider En Route", d: `${providerName.split(" ")[0]} will head to your location by the scheduled time.` },
                { t: "Job In Progress", d: "Service is being carried out. Track progress live from your bookings page." },
                { t: "Job Complete & Payment Released", d: "Once you confirm completion, the escrowed payment is released. An invoice is generated automatically." },
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${s.done ? "bg-emerald-600 text-white" : "border border-border bg-card text-muted-foreground"}`}>
                    {s.done ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{s.t}</p>
                    <p className="text-xs text-muted-foreground">{s.d}</p>
                    {s.when && <p className="mt-0.5 text-[10px] text-muted-foreground">{s.when}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-bold text-background hover:opacity-90">
              💬 Chat with Provider
            </button>
            <Link to="/$username/dashboard" params={{ username }} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-bold hover:bg-muted">
              View My Bookings →
            </Link>
          </div>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← Back to Home</Link>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">Order summary</p>
              {provider && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {providerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{providerName}</p>
                    <p className="text-[11px] text-muted-foreground">⭐ {provider.rating} · {provider.headline}</p>
                  </div>
                </div>
              )}
              <dl className="mt-4 space-y-2 text-xs">
                <Row k="Service" v={booking.service_name} />
                <Row k="Time" v={booking.scheduled_time ?? "—"} />
                <Row k="Duration (est.)" v={`${booking.est_hours} hours`} />
              </dl>
              <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                <Row k={`Labour (${booking.est_hours}hr × Rs. ${booking.hourly_rate.toLocaleString()})`} v={`Rs. ${labour.toLocaleString()}`} />
                <Row k="Platform Fee" v={`Rs. ${booking.platform_fee}`} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <p className="text-sm font-bold">Total Paid</p>
                <p className="text-base font-bold text-emerald-600">Rs. {booking.total_amount.toLocaleString()}</p>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">Payment held in escrow until job completion</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">📋 Quick Checklist</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>① Keep your phone nearby for provider updates</li>
                <li>② Ensure access to the service area is ready</li>
                <li>③ Confirm job completion to release payment</li>
                <li>④ Leave a review to help the community</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">🔒 You're Protected</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>🛡 Escrow holds funds until job done</li>
                <li>🔒 256-bit SSL encrypted transaction</li>
                <li>✅ Full refund if provider cancels</li>
                <li>📞 Dispute team available 24/7</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Small helpers ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{children}</p>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold text-right">{v}</dd></div>;
}
function ReviewRow({ icon, title, sub, value }: { icon: string; title: string; sub: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-right flex items-center gap-2">{value} <Edit2 className="h-3 w-3 text-primary" /></p>
    </div>
  );
}
function SummaryRow({ icon, t, sub, v, badge }: { icon: string; t: string; sub: string; v: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-bold">{t}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </div>
      {badge ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{v}</span> : <p className="text-sm font-bold">{v}</p>}
    </div>
  );
}
function generateMonthDays(d: Date): (Date | null)[] {
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let i = 1; i <= last.getDate(); i++) days.push(new Date(y, m, i));
  return days;
}
