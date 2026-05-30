import { useState } from "react";
import { Plus, AlertTriangle, X } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type ServiceCard = {
  id: string;
  title: string;
  priceLine: string;
  description: string;
  published: boolean;
  emoji: string;
  bg: string;
};

const initialCards: ServiceCard[] = [
  {
    id: "1",
    title: "Emergency Plumbing",
    priceLine: "Rs. 2,800 / hr · Min Rs. 1,500",
    description:
      "24/7 emergency plumbing for burst pipes, leaks, blockages. Arrives within 60 min. 30-day guarantee.",
    published: true,
    emoji: "🔧",
    bg: "from-amber-900 to-amber-700",
  },
  {
    id: "2",
    title: "Faucet & Tap Repair",
    priceLine: "Rs. 1,800 / job · Fixed price",
    description:
      "Full faucet repair or replacement. Kitchen, bathroom, garden taps. 14-day workmanship guarantee.",
    published: true,
    emoji: "🚿",
    bg: "from-slate-800 to-slate-600",
  },
  {
    id: "3",
    title: "Pipe Replacement",
    priceLine: "Rs. 3,200 / hr + materials",
    description:
      "Complete pipe inspection, repair or replacement. UPVC, copper and PVC. Pressure testing included. 1-year guarantee.",
    published: true,
    emoji: "🪒",
    bg: "from-emerald-900 to-emerald-700",
  },
  {
    id: "4",
    title: "Water Heater Service",
    priceLine: "Rs. 4,500 / job · Incl. fitting",
    description:
      "Solar and electric water heater installation and servicing. All brands. 2-year warranty.",
    published: false,
    emoji: "💧",
    bg: "from-slate-400 to-slate-300",
  },
];

export default function ProviderServiceCardsPage() {
  const [cards, setCards] = useState<ServiceCard[]>(initialCards);
  const [confirmDelete, setConfirmDelete] = useState<ServiceCard | null>(null);
  const [editing, setEditing] = useState<ServiceCard | null>(null);
  const [creating, setCreating] = useState(false);

  const togglePublish = (id: string) =>
    setCards((c) => c.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));

  const handleDelete = () => {
    if (!confirmDelete) return;
    setCards((c) => c.filter((x) => x.id !== confirmDelete.id));
    toast.success(`Deleted "${confirmDelete.title}"`);
    setConfirmDelete(null);
  };

  const handleSave = (card: ServiceCard) => {
    setCards((c) => {
      const exists = c.find((x) => x.id === card.id);
      if (exists) return c.map((x) => (x.id === card.id ? card : x));
      return [...c, card];
    });
    toast.success(exists(cards, card.id) ? "Card updated" : "Card created");
    setEditing(null);
    setCreating(false);
  };

  return (
    <ProviderLayout active="service-cards" newRequestsCount={2} reviewsCount={128}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Cards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your public marketplace listings visible to homeowners
          </p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="rounded-xl bg-foreground px-4 py-5 font-semibold text-background hover:bg-foreground/90"
        >
          <Plus className="mr-1 h-4 w-4" /> Create New Card
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div
              className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${card.bg}`}
            >
              <span className="text-5xl">{card.emoji}</span>
              <span
                className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  card.published
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                ● {card.published ? "Live" : "Hidden"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-base font-bold">{card.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{card.priceLine}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={card.published}
                    onCheckedChange={() => togglePublish(card.id)}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {card.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setEditing(card)}
                    className="h-8 rounded-lg bg-foreground px-3 text-xs text-background hover:bg-foreground/90"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDelete(card)}
                    className="h-8 rounded-lg border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {confirmDelete && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-destructive">
                Delete "{confirmDelete.title}"?
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This action cannot be undone. The card will be permanently removed from the
                marketplace.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      )}

      {(editing || creating) && (
        <CardEditor
          initial={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </ProviderLayout>
  );
}

function exists(cards: ServiceCard[], id: string) {
  return cards.some((c) => c.id === id);
}

function CardEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: ServiceCard | null;
  onClose: () => void;
  onSave: (c: ServiceCard) => void;
}) {
  const [form, setForm] = useState<ServiceCard>(
    initial ?? {
      id: crypto.randomUUID(),
      title: "",
      priceLine: "",
      description: "",
      published: true,
      emoji: "🛠️",
      bg: "from-slate-800 to-slate-600",
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {initial ? "Edit Service Card" : "New Service Card"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Price line</Label>
            <Input
              value={form.priceLine}
              placeholder="Rs. 2,800 / hr · Min Rs. 1,500"
              onChange={(e) => setForm({ ...form, priceLine: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Emoji</Label>
              <Input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <span className="pb-1 text-sm font-medium">
                {form.published ? "Published" : "Hidden"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.title.trim()) return toast.error("Title required");
              onSave(form);
            }}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
