import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { HomeownerDashboard } from "@/pages/dashboard/HomeownerDashboard";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/$username/past-bookings")({
  component: PastBookingsRoute,
});

function PastBookingsRoute() {
  const { username } = useParams({ from: "/_authenticated/$username/past-bookings" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/past-bookings", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (profile.username.toLowerCase() !== username.toLowerCase()) return null;
  return <HomeownerDashboard initialTab="bookings" />;
}
