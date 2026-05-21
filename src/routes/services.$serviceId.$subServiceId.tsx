import { createFileRoute } from "@tanstack/react-router";
import { SubServiceDetailPage } from "@/pages/services/SubServiceDetailPage";

export const Route = createFileRoute("/services/$serviceId/$subServiceId")({
  component: SubServiceDetailPage,
});
