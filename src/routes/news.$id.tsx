import { createFileRoute } from "@tanstack/react-router";
import { NewsArticlePage } from "@/pages/news/NewsArticlePage";

export const Route = createFileRoute("/news/$id")({
  component: NewsArticlePage,
  head: () => ({
    meta: [
      { title: "Article — FixItNow News" },
      { name: "description", content: "Read the latest from FixItNow." },
    ],
  }),
});
