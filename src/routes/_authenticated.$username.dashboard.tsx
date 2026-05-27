import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { HomeownerDashboard } from "@/pages/dashboard/HomeownerDashboard";
import { ProviderDashboard } from "@/pages/dashboard/ProviderDashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { useCurrentUser } from "@/hooks/use-current-user";
import { userDashboardPath } from "@/lib/role";

export const Route = createFileRoute("/_authenticated/$username/dashboard")({
  component: DashboardDispatch,
});

function DashboardDispatch() {
  const { username } = useParams({ from: "/_authenticated/$username/dashboard" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: userDashboardPath(profile.username), replace: true });
    }
  }, [loading, profile, username, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (profile.username.toLowerCase() !== username.toLowerCase()) return null;

  if (profile.role === "provider") return <ProviderDashboard />;
  if (profile.role === "admin") return <AdminDashboard />;
  return <HomeownerDashboard />;
}
