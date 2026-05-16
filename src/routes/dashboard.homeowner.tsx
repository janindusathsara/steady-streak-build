import { createFileRoute } from "@tanstack/react-router";
import { HomeownerDashboard } from "@/components/pages/dashboard/HomeownerDashboard";

export const Route = createFileRoute("/dashboard/homeowner")({
  component: HomeownerDashboard,
});
