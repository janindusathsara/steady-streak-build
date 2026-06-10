import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNewApi, tokens } from "@/lib/api-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    if (useNewApi()) {
      if (!tokens.access) throw redirect({ to: "/login" });
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
