import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/pages/services/ServicesPage";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Find Services — FixItNow" },
      { name: "description", content: "Browse 2,400+ verified home service professionals across 30+ categories on FixItNow." },
    ],
  }),
});
