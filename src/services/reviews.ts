import { http } from "./http";

export interface Review {
  id: string;
  initials: string;
  name: string;
  city: string;
  date: string;
  text: string;
  service: string;
  pro: string;
  amount: string;
  rating: number;
  flagged?: boolean;
}

export interface ReviewStats {
  avg: number;
  total: number;
  positive: number;
  flagged: number;
  awaiting_reply: number;
  distribution: Array<{ stars: number; count: number; total: number }>;
  top_providers: Array<{ id: string; initials: string; name: string; meta: string; rating: number }>;
}

export const reviewsService = {
  list: () => http.get<Review[]>("/reviews").then((r) => r.data),
  stats: () => http.get<ReviewStats>("/reviews/stats").then((r) => r.data),
  flag: (id: string) => http.post(`/reviews/${id}/flag`).then((r) => r.data),
  hide: (id: string) => http.post(`/reviews/${id}/hide`).then((r) => r.data),
  resolve: (id: string) => http.post(`/reviews/${id}/resolve`).then((r) => r.data),
};
