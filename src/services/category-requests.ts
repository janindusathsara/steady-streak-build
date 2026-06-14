import { http } from "./http";
import type { CategoryRequest } from "@/lib/category-requests-data";

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
  async get(id: string): Promise<CategoryRequest> {
    const { data } = await http.get(`/category-requests/${id}`);
    return data as CategoryRequest;
  },
  async create(payload: Partial<CategoryRequest>) {
    const { data } = await http.post("/category-requests", payload);
    return data;
  },
  async approve(id: string, notes?: string) {
    const { data } = await http.patch(`/category-requests/${id}`, { status: "Active", admin_notes: notes });
    return data;
  },
  async reject(id: string, notes?: string) {
    const { data } = await http.patch(`/category-requests/${id}`, { status: "Rejected", admin_notes: notes });
    return data;
  },
};
