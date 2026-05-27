import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProviderJobsPage } from "@/pages/jobs/ProviderJobsPage";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/$username/jobs")({
  component: JobsGuard,
});

function JobsGuard() {
  const { username } = useParams({ from: "/_authenticated/$username/jobs" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/dashboard", params: { username: profile.username }, replace: true });
    }
    if (!loading && profile && profile.role !== "provider") {
      navigate({ to: "/$username/dashboard", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);

  if (loading || !profile) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (profile.role !== "provider") return null;
  return <ProviderJobsPage />;
}
