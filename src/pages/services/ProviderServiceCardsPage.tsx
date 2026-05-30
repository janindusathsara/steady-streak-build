import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, AlertTriangle } from "lucide-react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cardsStore, useCards, type ServiceCard } from "@/lib/service-cards-store";

export default function ProviderServiceCardsPage() {
  const navigate = useNavigate();
  const { profile } = useCurrentUser();
  const username = profile?.username ?? "";
  const cards = useCards();
  const [confirmDelete, setConfirmDelete] = useState<ServiceCard | null>(null);

  const handleDelete = () => {
    if (!confirmDelete) return;
    cardsStore.remove(confirmDelete.id);
    toast.success(`Deleted "${confirmDelete.title}"`);
    setConfirmDelete(null);
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
          onClick={() => navigate({ to: "/$username/myservices/new", params: { username } })}
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
                    onCheckedChange={() => cardsStore.togglePublish(card.id)}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {card.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: "/$username/myservices/$cardId",
                        params: { username, cardId: card.id },
                      })
                    }
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
    </ProviderLayout>
  );
}
