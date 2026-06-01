import { createFileRoute } from "@tanstack/react-router";
import { AdminCategoryRequestsPage } from "@/pages/admin/AdminCategoryRequestsPage";

export const Route = createFileRoute("/_authenticated/$username/category-request/")({
  component: AdminCategoryRequestsPage,
});
