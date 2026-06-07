import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BookingWizard } from "@/pages/booking/BookingWizard";

export const Route = createFileRoute("/$username/book")({
  validateSearch: (s: Record<string, unknown>): { subService?: string; provider?: string; step?: number } => ({
    subService: typeof s.subService === "string" ? s.subService : undefined,
    provider: typeof s.provider === "string" ? s.provider : undefined,
    step: typeof s.step === "number" ? s.step : undefined,
  }),
  beforeLoad: async ({ search, params }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const p = new URLSearchParams();
      if (search.subService) p.set("subService", search.subService);
      if (search.provider) p.set("provider", search.provider);
      if (search.step) p.set("step", String(search.step));
      const redirectTo = `/${params.username}/book${p.toString() ? "?" + p.toString() : ""}`;
      throw redirect({ to: "/login", search: { redirect: redirectTo } as any });
    }
  },
  component: BookingWizard,
});
