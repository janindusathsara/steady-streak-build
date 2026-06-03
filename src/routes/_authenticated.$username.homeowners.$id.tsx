import { createFileRoute } from "@tanstack/react-router";
import { AdminHomeownerDetailPage } from "@/pages/admin/AdminHomeownerDetailPage";

export const Route = createFileRoute("/_authenticated/$username/homeowners/$id")({
  component: AdminHomeownerDetailPage,
});
