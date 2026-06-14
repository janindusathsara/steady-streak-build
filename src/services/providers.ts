import { http } from "./http";

export interface Provider {
  id: string;
  initials: string;
  name: string;
  email: string;
  category: string;
  icon: string;
  district: string;
  jobs: number;
  rating: number;
  status: "Active" | "Suspended" | "New" | "Top";
}

export interface ProviderStats {
  active: number;
  categories: number;
  avg_rating: number;
  suspended: number;
  top_rated: number;
  new_count: number;
}

export const providersService = {
  list: () => http.get<Provider[]>("/providers").then((r) => r.data),
  stats: () => http.get<ProviderStats>("/providers/stats").then((r) => r.data),
  suspend: (id: string) => http.post(`/providers/${id}/suspend`).then((r) => r.data),
  reinstate: (id: string) => http.post(`/providers/${id}/reinstate`).then((r) => r.data),
};
