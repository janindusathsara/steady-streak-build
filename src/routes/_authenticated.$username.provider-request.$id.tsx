import { createFileRoute, useParams } from "@tanstack/react-router";
import { AdminProviderRequestDetailPage } from "@/pages/admin/AdminProviderRequestDetailPage";

export const Route = createFileRoute("/_authenticated/$username/provider-request/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/_authenticated/$username/provider-request/$id" });
  return <AdminProviderRequestDetailPage id={id} />;
}
