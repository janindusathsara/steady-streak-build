import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/pages/legal/PrivacyPage";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — FixItNow" },
      { name: "description", content: "How FixItNow collects, uses, and protects your data." },
    ],
  }),
});
