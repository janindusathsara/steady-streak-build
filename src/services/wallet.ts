import { http } from "./http";

export interface WalletBalance {
  available: number;
  pending: number;
  updatedAt?: string;
}

export interface WalletTransaction {
  id: string;
  desc: string;
  date: string;
  ref: string;
  type: string;
  amount: string;
  tone: "credit" | "transfer" | "fee";
}

export interface WalletStats {
  thisWeek: number;
  thisMonth: number;
  ytd: number;
  avgPerJob: number;
  weeklyTrend: { label: string; value: number; active?: boolean }[];
  weekAvg: number;
  growthPct: number;
}

export const walletService = {
  async balance(): Promise<WalletBalance> {
    const { data } = await http.get("/wallet/balance");
    return {
      available: Number(data?.available ?? data?.balance ?? 0),
      pending: Number(data?.pending ?? 0),
      updatedAt: data?.updated_at ?? data?.updatedAt,
    };
  },
  async stats(): Promise<WalletStats> {
    const { data } = await http.get("/wallet/stats");
    return {
      thisWeek: Number(data?.this_week ?? data?.thisWeek ?? 0),
      thisMonth: Number(data?.this_month ?? data?.thisMonth ?? 0),
      ytd: Number(data?.ytd ?? 0),
      avgPerJob: Number(data?.avg_per_job ?? data?.avgPerJob ?? 0),
      weeklyTrend: Array.isArray(data?.weekly_trend ?? data?.weeklyTrend)
        ? (data.weekly_trend ?? data.weeklyTrend).map((w: any) => ({
            label: String(w.label),
            value: Number(w.value),
            active: !!w.active,
          }))
        : [],
      weekAvg: Number(data?.week_avg ?? data?.weekAvg ?? 0),
      growthPct: Number(data?.growth_pct ?? data?.growthPct ?? 0),
    };
  },
  async transactions(): Promise<WalletTransaction[]> {
    const { data } = await http.get("/wallet/transactions");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map((t: any) => ({
      id: String(t.id ?? t.ref),
      desc: String(t.desc ?? t.description ?? ""),
      date: String(t.date ?? ""),
      ref: String(t.ref ?? t.reference ?? t.id ?? ""),
      type: String(t.type ?? ""),
      amount: String(t.amount ?? ""),
      tone: (t.tone ?? "credit") as WalletTransaction["tone"],
    }));
  },
  async withdraw(amount: number, accountId?: string) {
    const { data } = await http.post("/wallet/withdraw", { amount, account_id: accountId });
    return data;
  },
};
