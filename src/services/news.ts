// Thin re-export so pages depend on a service module rather than a lib helper.
export {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  publishNews,
  uploadNewsImage,
  type NewsArticle,
  type NewsPayload,
  type NewsStatus,
} from "@/lib/news-admin-data";

// Stable gradient palette used by public news cards.
const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-600 to-teal-700",
  "from-blue-500 to-violet-600",
  "from-amber-500 to-orange-600",
  "from-red-500 to-rose-700",
  "from-orange-500 to-amber-700",
  "from-indigo-500 to-violet-700",
  "from-cyan-600 to-blue-700",
  "from-emerald-700 to-green-900",
  "from-pink-600 to-rose-800",
];

export function gradientFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export function readingTime(body?: string | null): string {
  if (!body) return "1 min read";
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 220));
  return `${mins} min read`;
}

export function formatNewsDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}
