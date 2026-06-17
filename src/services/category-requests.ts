import { http } from "./http";

export type CategoryRequestStatus = "Pending" | "Active" | "Rejected";

export interface CategoryRequest {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  requestedBy: string;
  requesterEmail: string;
  contact: string;
  providersWaiting: number;
  applied: string;
  status: CategoryRequestStatus;
  priceRange: string;
  platformFee: string;
  demand: string;
  description: string;
  subCategories: Array<{ icon: string; label: string }>;
  adminNotes: string;
  requestedAgo: string;
  createdAt: string;
  monthlyBookings: string;
  monthlyRevenue: string;
  searchHits: string;
  providers: Array<{ i: string; name: string; city: string; years: string }>;
  extraProviders: number;
}

export interface CategoryRequestStats {
  pending: number;
  active: number;
  rejected: number;
  total: number;
}

export const categoryRequestsService = {
  async list(): Promise<CategoryRequest[]> {
    const { data } = await http.get("/category-requests");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list as CategoryRequest[];
  },
  async stats(): Promise<CategoryRequestStats> {
    const { data } = await http.get("/category-requests/stats");
    return {
      pending: Number(data?.pending ?? 0),
      active: Number(data?.active ?? 0),
      rejected: Number(data?.rejected ?? 0),
      total: Number(data?.total ?? 0),
    };
  },
  async get(id: string): Promise<CategoryRequest | null> {
    try {
      const { data } = await http.get(`/category-requests/${id}`);
      return (data as CategoryRequest) ?? null;
    } catch {
      return null;
    }
  },
  async create(payload: Partial<CategoryRequest>) {
    const { data } = await http.post("/category-requests", payload);
    return data;
  },
  async approve(id: string, notes?: string) {
    const { data } = await http.patch(`/category-requests/${id}`, {
      status: "Active",
      admin_notes: notes,
    });
    return data;
  },
  async reject(id: string, notes?: string) {
    const { data } = await http.patch(`/category-requests/${id}`, {
      status: "Rejected",
      admin_notes: notes,
    });
    return data;
  },
};
