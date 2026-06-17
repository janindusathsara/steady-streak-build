import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ProviderServiceCardEditorPage from "@/pages/services/ProviderServiceCardEditorPage";
import { servicesService, type ServiceCard } from "@/services/services";

export const Route = createFileRoute("/_authenticated/$username/myservices/$cardId")({
  component: RouteCmp,
});

function RouteCmp() {
  const { username, cardId } = useParams({
    from: "/_authenticated/$username/myservices/$cardId",
  });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  const [card, setCard] = useState<ServiceCard | null>(null);
  const [cardLoading, setCardLoading] = useState(true);

  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({
        to: "/$username/myservices/$cardId",
        params: { username: profile.username, cardId },
        replace: true,
      });
    }
  }, [loading, profile, username, cardId, navigate]);

  useEffect(() => {
    let alive = true;
    servicesService.get(cardId)
      .then((c) => { if (alive) setCard(c); })
      .finally(() => { if (alive) setCardLoading(false); });
    return () => { alive = false; };
  }, [cardId]);

  if (loading || !profile || cardLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  if (profile.role !== "provider") return null;
  if (!card)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Card not found
      </div>
    );
  return <ProviderServiceCardEditorPage initial={card} />;
}
