import { http } from "./http";
import type { ProviderRequest, ProviderRequestStatus } from "@/lib/provider-requests-data";

export interface ProviderRequestStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export const providerRequestsService = {
  async list(): Promise<ProviderRequest[]> {
    const { data } = await http.get("/provider-requests");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list as ProviderRequest[];
  },
  async stats(): Promise<ProviderRequestStats> {
    const { data } = await http.get("/provider-requests/stats");
    return {
      pending: Number(data?.pending ?? 0),
      approved: Number(data?.approved ?? 0),
      rejected: Number(data?.rejected ?? 0),
      total: Number(data?.total ?? 0),
    };
  },
  async get(id: string): Promise<ProviderRequest> {
    const { data } = await http.get(`/provider-requests/${id}`);
    return data as ProviderRequest;
  },
  async updateStatus(id: string, status: ProviderRequestStatus, notes?: string) {
    const { data } = await http.patch(`/provider-requests/${id}`, { status, admin_notes: notes });
    return data;
  },
  approve(id: string, notes?: string) {
    return this.updateStatus(id, "Approved", notes);
  },
  reject(id: string, notes?: string) {
    return this.updateStatus(id, "Rejected", notes);
  },
};
