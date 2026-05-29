import { createFileRoute } from "@tanstack/react-router";
import { NewsArticlePage } from "@/pages/news/NewsArticlePage";
import { getArticleById } from "@/lib/news-data";

export const Route = createFileRoute("/news/$id")({
  component: NewsArticlePage,
  head: ({ params }) => {
    const a = getArticleById(Number(params.id));
    const title = a ? `${a.title} — FixItNow News` : "Article — FixItNow News";
    const description = a?.excerpt ?? "Read the latest from FixItNow.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
});
