import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ProviderServiceCardsPage from "@/pages/services/ProviderServiceCardsPage";

export const Route = createFileRoute("/_authenticated/$username/myservices")({
  component: RouteCmp,
});

function RouteCmp() {
  const { username } = useParams({ from: "/_authenticated/$username/myservices" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/myservices", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (profile.role !== "provider") return null;
  return <ProviderServiceCardsPage />;
}
