import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ProviderServiceCardEditorPage from "@/pages/services/ProviderServiceCardEditorPage";
import { cardsStore } from "@/lib/service-cards-store";

export const Route = createFileRoute("/_authenticated/$username/myservices/$cardId")({
  component: RouteCmp,
});

function RouteCmp() {
  const { username, cardId } = useParams({
    from: "/_authenticated/$username/myservices/$cardId",
  });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({
        to: "/$username/myservices/$cardId",
        params: { username: profile.username, cardId },
        replace: true,
      });
    }
  }, [loading, profile, username, cardId, navigate]);
  if (loading || !profile)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  if (profile.role !== "provider") return null;
  const card = cardsStore.get(cardId);
  if (!card)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Card not found
      </div>
    );
  return <ProviderServiceCardEditorPage initial={card} />;
}
