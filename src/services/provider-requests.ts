import { http } from "./http";

export type ProviderRequestStatus = "Pending" | "Approved" | "Rejected";

export interface ProviderRequest {
  id: string;
  initials: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  category: string;
  categoryIcon: string;
  subSpeciality: string;
  district: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  applied: string;
  appliedAt: string;
  status: ProviderRequestStatus;
  score: number;
  scoreLabel: string;
  documents: Array<{ icon: string; name: string }>;
  adminNotes: string;
  checks: Array<{ label: string; value: string; ok: boolean }>;
  similar: Array<{ i: string; name: string; meta: string; rating: string }>;
}

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
  async get(id: string): Promise<ProviderRequest | null> {
    try {
      const { data } = await http.get(`/provider-requests/${id}`);
      return (data as ProviderRequest) ?? null;
    } catch {
      return null;
    }
  },
  async updateStatus(id: string, status: ProviderRequestStatus, notes?: string) {
    const { data } = await http.patch(`/provider-requests/${id}`, {
      status,
      admin_notes: notes,
    });
    return data;
  },
  approve(id: string, notes?: string) {
    return this.updateStatus(id, "Approved", notes);
  },
  reject(id: string, notes?: string) {
    return this.updateStatus(id, "Rejected", notes);
  },
};
