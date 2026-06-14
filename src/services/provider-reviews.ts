import { http } from "./http";

export interface ProviderReview {
  id: string;
  name: string;
  city: string;
  service: string;
  date: string;
  paid: string;
  rating: number;
  text: string;
}

export interface ProviderReviewsSummary {
  avgRating: number;
  totalReviews: number;
  completionRate: number;
  totalEarned: string;
  jobsDone: number;
  experience: string;
  distribution: { stars: number; count: number; total: number }[];
}

export const providerReviewsService = {
  async list(): Promise<ProviderReview[]> {
    const { data } = await http.get("/providers/me/reviews");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map((r: any) => ({
      id: String(r.id),
      name: String(r.name ?? r.homeowner_name ?? ""),
      city: String(r.city ?? ""),
      service: String(r.service ?? ""),
      date: String(r.date ?? r.created_at ?? ""),
      paid: String(r.paid ?? r.amount ?? ""),
      rating: Number(r.rating ?? 0),
      text: String(r.text ?? r.comment ?? ""),
    }));
  },
  async summary(): Promise<ProviderReviewsSummary> {
    const { data } = await http.get("/providers/me/reviews/summary");
    return {
      avgRating: Number(data?.avg_rating ?? data?.avgRating ?? 0),
      totalReviews: Number(data?.total_reviews ?? data?.totalReviews ?? 0),
      completionRate: Number(data?.completion_rate ?? data?.completionRate ?? 0),
      totalEarned: String(data?.total_earned ?? data?.totalEarned ?? ""),
      jobsDone: Number(data?.jobs_done ?? data?.jobsDone ?? 0),
      experience: String(data?.experience ?? ""),
      distribution: Array.isArray(data?.distribution)
        ? data.distribution.map((d: any) => ({
            stars: Number(d.stars),
            count: Number(d.count),
            total: Number(d.total),
          }))
        : [],
    };
  },
  async reply(id: string, message: string) {
    const { data } = await http.post(`/reviews/${id}/reply`, { message });
    return data;
  },
};
