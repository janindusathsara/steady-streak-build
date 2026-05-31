import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminNewsPage } from "@/pages/admin/AdminNewsPage";
import { useCurrentUser } from "@/hooks/use-current-user";
import { userDashboardPath } from "@/lib/role";

export const Route = createFileRoute("/_authenticated/$username/update-news")({
  component: UpdateNewsRoute,
});

function UpdateNewsRoute() {
  const { username } = useParams({ from: "/_authenticated/$username/update-news" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/update-news", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (profile.username.toLowerCase() !== username.toLowerCase()) return null;
  if (profile.role !== "admin") {
    navigate({ to: userDashboardPath(profile.username), replace: true });
    return null;
  }
  return <AdminNewsPage />;
}
