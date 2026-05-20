import { createFileRoute } from "@tanstack/react-router";
import { NewsPage } from "@/pages/news/NewsPage";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News & Insights — FixItNow" },
      { name: "description", content: "Home maintenance tips, platform updates, and industry guides — all in one place." },
    ],
  }),
});
