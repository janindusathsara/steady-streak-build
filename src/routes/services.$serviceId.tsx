import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/pages/services/ServiceDetailPage";

export const Route = createFileRoute("/services/$serviceId")({
  component: ServiceDetailPage,
});
