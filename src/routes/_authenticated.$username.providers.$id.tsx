import { createFileRoute } from "@tanstack/react-router";
import { AdminProviderDetailPage } from "@/pages/admin/AdminProviderDetailPage";

export const Route = createFileRoute("/_authenticated/$username/providers/$id")({
  component: AdminProviderDetailPage,
});
