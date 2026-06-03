import { createFileRoute } from "@tanstack/react-router";
import { AdminProvidersPage } from "@/pages/admin/AdminProvidersPage";

export const Route = createFileRoute("/_authenticated/$username/providers/")({
  component: AdminProvidersPage,
});
