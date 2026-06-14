// Provider dashboard stats.
import { http } from "./http";

export interface ProviderStats {
  active_jobs: { value: number; hint: string };
  weekly_earnings: { value: string; hint: string };
  avg_rating: { value: string; hint: string };
  completion_rate: { value: string; hint: string };
  monthly: Array<{ month: string; amount: number }>;
  monthly_peak?: string;
  monthly_ytd?: string;
}

export const providerStatsService = {
  me: () => http.get<ProviderStats>("/providers/me/stats").then((r) => r.data),
};
