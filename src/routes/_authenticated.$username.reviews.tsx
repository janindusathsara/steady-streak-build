import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProviderReviewsPage } from "@/pages/reviews/ProviderReviewsPage";
import { useCurrentUser } from "@/hooks/use-current-user";
import { userDashboardPath } from "@/lib/role";

export const Route = createFileRoute("/_authenticated/$username/reviews")({
  component: ReviewsRoute,
});

function ReviewsRoute() {
  const { username } = useParams({ from: "/_authenticated/$username/reviews" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: "/$username/reviews", params: { username: profile.username }, replace: true });
    }
  }, [loading, profile, username, navigate]);
  if (loading || !profile) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (profile.username.toLowerCase() !== username.toLowerCase()) return null;
  if (profile.role !== "provider") {
    navigate({ to: userDashboardPath(profile.username), replace: true });
    return null;
  }
  return <ProviderReviewsPage />;
}
