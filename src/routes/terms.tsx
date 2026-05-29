import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/pages/legal/TermsPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — FixItNow" },
      { name: "description", content: "The terms that govern your use of the FixItNow platform." },
    ],
  }),
});
