import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Image as ImageIcon } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  cardsStore,
  emptyCard,
  syncDerived,
  type ServiceCard,
} from "@/lib/service-cards-store";

interface Props {
  initial?: ServiceCard;
}

export default function ProviderServiceCardEditorPage({ initial }: Props) {
  const navigate = useNavigate();
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
  const [card, setCard] = useState<ServiceCard>(initial ?? emptyCard());
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ServiceCard>(k: K, v: ServiceCard[K]) =>
    setCard((c) => ({ ...c, [k]: v }));

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    const reader = new FileReader();
    reader.onload = () => set("coverImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    if (!card.title.trim()) return toast.error("Service title is required");
    cardsStore.upsert(syncDerived(card));
    toast.success(initial ? "Card updated" : "Card published");
    navigate({ to: "/$username/myservices", params: { username } });
  };

  return (
    <ProviderLayout active="service-cards" newRequestsCount={2} reviewsCount={128}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">
            <button
              onClick={() => navigate({ to: "/$username/myservices", params: { username } })}
              className="hover:text-foreground"
            >
              Service Cards
            </button>{" "}
            → {initial ? "Edit Card" : "Create New"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {initial ? "Edit Service Card" : "Create Service Card"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {initial
              ? "Update your marketplace listing"
              : "Publish a new listing visible to homeowners in the marketplace"}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/$username/myservices", params: { username } })}
            className="rounded-xl"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handlePublish}
            className="rounded-xl bg-amber-900 px-4 font-semibold text-white hover:bg-amber-900/90"
          >
            <Sparkles className="mr-1 h-4 w-4" />
            {initial ? "Save Changes" : "Publish Card"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Step 1 */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Step 1 — Basic Info</h2>
            <p className="text-xs text-muted-foreground">Clear title, category and pricing</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="SERVICE TITLE">
                <Input
                  placeholder="e.g. Emergency Plumbing Service"
                  value={card.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>
              <Field label="CATEGORY">
                <select
                  value={card.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Plumbing", "Electrical", "Carpentry", "Cleaning", "Painting", "AC Repair"].map(
                    (o) => (
                      <option key={o}>{o}</option>
                    )
                  )}
                </select>
              </Field>
              <Field label="RATE TYPE">
                <select
                  value={card.rateType}
                  onChange={(e) => set("rateType", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Per Hour", "Fixed", "Per Visit"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="RATE AMOUNT (RS.)">
                <Input
                  placeholder="e.g. 2800"
                  value={card.rateAmount}
                  onChange={(e) => set("rateAmount", e.target.value)}
                />
              </Field>
              <Field label="MINIMUM FEE (RS.)" full>
                <Input
                  placeholder="e.g. 1500"
                  value={card.minFee}
                  onChange={(e) => set("minFee", e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Step 2 */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Step 2 — Description</h2>
            <p className="text-xs text-muted-foreground">What's included in this service</p>
            <div className="mt-4 space-y-4">
              <Field label="SHORT SUMMARY">
                <Input
                  placeholder="One-line preview for marketplace listings…"
                  value={card.shortSummary}
                  onChange={(e) => set("shortSummary", e.target.value)}
                />
              </Field>
              <Field label="FULL DESCRIPTION">
                <Textarea
                  rows={4}
                  placeholder="Describe your service in detail — inclusions, exclusions, process, guarantees…"
                  value={card.fullDescription}
                  onChange={(e) => set("fullDescription", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="EST. DURATION">
                  <Input
                    placeholder="e.g. 1–3 hours"
                    value={card.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                </Field>
                <Field label="WARRANTY">
                  <Input
                    placeholder="e.g. 30-day guarantee"
                    value={card.warranty}
                    onChange={(e) => set("warranty", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Step 3 — Cover Image</h2>
            <p className="text-xs text-muted-foreground">Upload a high-quality photo</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/50 px-4 py-10 text-center hover:bg-muted/50"
            >
              {card.coverImage ? (
                <img
                  src={card.coverImage}
                  alt="cover"
                  className="h-32 w-auto rounded-lg object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-amber-600" />
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-[11px] text-muted-foreground">
                    PNG, JPG · Max 5MB · Recommended 800×500px
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </button>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Live Preview
            </p>
            <div
              className={`mt-2 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br ${card.bg}`}
            >
              {card.coverImage ? (
                <img
                  src={card.coverImage}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-5xl">{card.emoji}</span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold">{card.title || "Your Service Title"}</h3>
              <p className="text-xs text-muted-foreground">
                Rs. {card.rateAmount || "???"} / {card.rateType.toLowerCase().replace("per ", "")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.shortSummary ||
                  "Description preview appears here once you fill in the form fields…"}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    card.status === "live"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  ● {card.status === "live" ? "Live" : "Hidden"}
                </span>
                <button className="rounded-lg bg-foreground px-3 py-1 text-[11px] font-semibold text-background">
                  Book Now
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold">Visibility Settings</h3>
            <div className="mt-3 space-y-3">
              <Field label="STATUS">
                <select
                  value={card.status}
                  onChange={(e) => set("status", e.target.value as "live" | "hidden")}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="live">● Publish Immediately</option>
                  <option value="hidden">● Save as Hidden</option>
                </select>
              </Field>
              <Field label="AVAILABLE DISTRICTS">
                <select
                  value={card.districts}
                  onChange={(e) => set("districts", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["All Districts", "Colombo", "Gampaha", "Kandy", "Galle"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>
        </div>
      </div>
    </ProviderLayout>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
