import { createFileRoute } from "@tanstack/react-router";
import { ProviderDashboard } from "@/pages/dashboard/ProviderDashboard";

export const Route = createFileRoute("/dashboard/provider")({
  component: ProviderDashboard,
});
