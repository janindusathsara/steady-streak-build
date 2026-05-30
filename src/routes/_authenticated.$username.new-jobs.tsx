import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProviderNewJobsPage } from "@/pages/jobs/ProviderNewJobsPage";

export const Route = createFileRoute("/_authenticated/$username/new-jobs")({
  component: RouteCmp,
});

function RouteCmp() {
  const { username } = useParams({ from: "/_authenticated/$username/new-jobs" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/new-jobs", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (profile.role !== "provider") return null;
  return <ProviderNewJobsPage />;
}
