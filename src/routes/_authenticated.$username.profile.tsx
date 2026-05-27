import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { useCurrentUser } from "@/hooks/use-current-user";
import { userProfilePath } from "@/lib/role";

export const Route = createFileRoute("/_authenticated/$username/profile")({
  component: ProfileGuard,
});

function ProfileGuard() {
  const { username } = useParams({ from: "/_authenticated/$username/profile" });
  const { loading, profile } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile && profile.username.toLowerCase() !== username.toLowerCase()) {
      navigate({ to: userProfilePath(profile.username), replace: true });
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

  return <ProfilePage />;
}
