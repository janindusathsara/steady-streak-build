import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BookingWizard } from "@/pages/booking/BookingWizard";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): { subService?: string; step?: number } => ({
    subService: typeof s.subService === "string" ? s.subService : undefined,
    step: typeof s.step === "number" ? s.step : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const params = new URLSearchParams();
      if (search.subService) params.set("subService", search.subService);
      const redirectTo = `/book${params.toString() ? "?" + params.toString() : ""}`;
      throw redirect({ to: "/login", search: { redirect: redirectTo } as any });
    }
  },
  component: BookingWizard,
});
