import { http } from "./http";

export interface ProfileMe {
  id: string;
  email: string | null;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: "homeowner" | "provider" | "admin";
  phone?: string;
  address?: string;
  district?: string;
  bio?: string;
}

export interface HomeownerProfileStats {
  totalBookings: number;
  activeProjects: number;
  totalSpent: string;
  walletBalance: string;
  reviewsGiven: number;
  memberSince: string;
}

export interface AdminProfileStats {
  activeUsers: string;
  liveProviders: string;
  openTickets: string;
  clusterLoad: string;
  lastAudit: string;
  memberSince: string;
}

export const profileService = {
  async me(): Promise<ProfileMe> {
    const { data } = await http.get("/me");
    return {
      id: String(data?.id ?? ""),
      email: data?.email ?? null,
      username: data?.username ?? null,
      displayName: data?.display_name ?? data?.displayName ?? null,
      avatarUrl: data?.avatar_url ?? data?.avatarUrl ?? null,
      role: (data?.role ?? "homeowner") as ProfileMe["role"],
      phone: data?.phone,
      address: data?.address,
      district: data?.district,
      bio: data?.bio,
    };
  },
  async update(payload: Partial<ProfileMe> & Record<string, unknown>) {
    const { data } = await http.patch("/me", payload);
    return data;
  },
  async homeownerStats(): Promise<HomeownerProfileStats> {
    const { data } = await http.get("/homeowners/me/stats");
    return {
      totalBookings: Number(data?.total_bookings ?? data?.totalBookings ?? 0),
      activeProjects: Number(data?.active_projects ?? data?.activeProjects ?? 0),
      totalSpent: String(data?.total_spent ?? data?.totalSpent ?? "—"),
      walletBalance: String(data?.wallet_balance ?? data?.walletBalance ?? "—"),
      reviewsGiven: Number(data?.reviews_given ?? data?.reviewsGiven ?? 0),
      memberSince: String(data?.member_since ?? data?.memberSince ?? "—"),
    };
  },
  async adminStats(): Promise<AdminProfileStats> {
    const { data } = await http.get("/admin/me/stats");
    return {
      activeUsers: String(data?.active_users ?? data?.activeUsers ?? "—"),
      liveProviders: String(data?.live_providers ?? data?.liveProviders ?? "—"),
      openTickets: String(data?.open_tickets ?? data?.openTickets ?? "—"),
      clusterLoad: String(data?.cluster_load ?? data?.clusterLoad ?? "—"),
      lastAudit: String(data?.last_audit ?? data?.lastAudit ?? "—"),
      memberSince: String(data?.member_since ?? data?.memberSince ?? "—"),
    };
  },
};
