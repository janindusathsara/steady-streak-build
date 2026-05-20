import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/about/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About FixItNow — Connecting homes with trusted experts" },
      { name: "description", content: "Since 2024, FixItNow has set the standard in home repair — vetted professionals, secure payments, guaranteed results." },
    ],
  }),
});
