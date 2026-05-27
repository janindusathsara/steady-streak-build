import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/admin")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) throw redirect({ to: "/login" });
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", sess.session.user.id)
      .maybeSingle();
    if (data?.username) {
      throw redirect({ to: "/$username/dashboard", params: { username: data.username }, replace: true });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
