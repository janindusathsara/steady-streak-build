import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ProviderServiceCardEditorPage from "@/pages/services/ProviderServiceCardEditorPage";

export const Route = createFileRoute("/_authenticated/$username/myservices/new")({
  component: RouteCmp,
});

function RouteCmp() {
  const { username } = useParams({ from: "/_authenticated/$username/myservices/new" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({
        to: "/$username/myservices/new",
        params: { username: profile.username },
        replace: true,
      });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  if (profile.role !== "provider") return null;
  return <ProviderServiceCardEditorPage />;
}
