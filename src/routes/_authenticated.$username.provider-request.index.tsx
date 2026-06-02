import { createFileRoute } from "@tanstack/react-router";
import { AdminProviderRequestsPage } from "@/pages/admin/AdminProviderRequestsPage";

export const Route = createFileRoute("/_authenticated/$username/provider-request/")({
  component: AdminProviderRequestsPage,
});
