// Admin dashboard data services.
import { http } from "./http";

export interface ProviderRegistration {
  id: string;
  initials: string;
  name: string;
  category: string;
  location: string;
  submitted_at: string;
}

export interface CategoryRequest {
  id: string;
  name: string;
  icon?: string;
  tint?: string;
  requested_by: string;
  submitted_at: string;
  waiting_count: number;
}

export interface ActivityItem {
  id: string;
  type: "success" | "primary" | "info" | "destructive";
  message: string;
  time: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  pct: number;
  tone: "success" | "primary";
}

export interface DashboardOverview {
  homeowners: { total: number; delta_week: number };
  providers: { total: number; delta_week: number };
  pending: { total: number; provider: number; category: number };
  revenue_today: { value: string; delta_pct: number };
}

export const adminService = {
  providerRegistrations: () =>
    http.get<ProviderRegistration[]>("/providers/pending").then((r) => r.data),

  approveProvider: (id: string) =>
    http.post(`/providers/${id}/approve`).then((r) => r.data),

  rejectProvider: (id: string) =>
    http.post(`/providers/${id}/reject`).then((r) => r.data),

  categoryRequests: () =>
    http.get<CategoryRequest[]>("/category-requests").then((r) => r.data),

  approveCategory: (id: string) =>
    http.post(`/category-requests/${id}/approve`).then((r) => r.data),

  rejectCategory: (id: string) =>
    http.post(`/category-requests/${id}/reject`).then((r) => r.data),

  activity: () => http.get<ActivityItem[]>("/activity").then((r) => r.data),

  metrics: () => http.get<DashboardMetric[]>("/dashboard/metrics").then((r) => r.data),

  overview: () => http.get<DashboardOverview>("/dashboard/overview").then((r) => r.data),
};
