import { createFileRoute } from "@tanstack/react-router";
import { ProviderDashboard } from "@/components/pages/dashboard/ProviderDashboard";

export const Route = createFileRoute("/dashboard/provider")({
  component: ProviderDashboard,
});
