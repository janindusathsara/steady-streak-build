import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/pages/dashboard/AdminDashboard";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminDashboard,
});
