import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/home/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "FixItNow — Trusted home service professionals on demand" },
      { name: "description", content: "Book electricians, plumbers, masons, carpenters and more. FixItNow connects you with verified local professionals in minutes." },
    ],
  }),
});
