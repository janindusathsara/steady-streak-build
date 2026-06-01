import { createFileRoute } from "@tanstack/react-router";
import { AdminHomeownersPage } from "@/pages/admin/AdminHomeownersPage";

export const Route = createFileRoute("/_authenticated/$username/homeowners")({
  component: AdminHomeownersPage,
});
