import { createFileRoute, useParams } from "@tanstack/react-router";
import { AdminCategoryRequestDetailPage } from "@/pages/admin/AdminCategoryRequestDetailPage";

export const Route = createFileRoute("/_authenticated/$username/category-request/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/_authenticated/$username/category-request/$id" });
  return <AdminCategoryRequestDetailPage id={id} />;
}
