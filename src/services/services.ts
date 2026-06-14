import { http } from "./http";
import type { ServiceCard } from "@/lib/service-cards-store";

export const servicesService = {
  async list(): Promise<ServiceCard[]> {
    const { data } = await http.get("/services");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map((s: any) => ({
      id: String(s.id),
      title: String(s.title ?? ""),
      category: String(s.category ?? ""),
      rateType: String(s.rate_type ?? s.rateType ?? "Per Hour"),
      rateAmount: String(s.rate_amount ?? s.rateAmount ?? ""),
      minFee: String(s.min_fee ?? s.minFee ?? ""),
      shortSummary: String(s.short_summary ?? s.shortSummary ?? ""),
      fullDescription: String(s.full_description ?? s.fullDescription ?? ""),
      duration: String(s.duration ?? ""),
      warranty: String(s.warranty ?? ""),
      coverImage: s.cover_image ?? s.coverImage ?? null,
      status: (s.status ?? "live") as ServiceCard["status"],
      districts: String(s.districts ?? "All Districts"),
      emoji: String(s.emoji ?? "🛠️"),
      bg: String(s.bg ?? "from-slate-800 to-slate-600"),
      priceLine: String(s.price_line ?? s.priceLine ?? ""),
      description: String(s.description ?? s.full_description ?? ""),
      published: s.published ?? s.status === "live",
    }));
  },
  async create(card: Partial<ServiceCard>) {
    const { data } = await http.post("/services", card);
    return data;
  },
  async update(id: string, card: Partial<ServiceCard>) {
    const { data } = await http.patch(`/services/${id}`, card);
    return data;
  },
  async remove(id: string) {
    await http.delete(`/services/${id}`);
  },
  async togglePublish(id: string, published: boolean) {
    const { data } = await http.patch(`/services/${id}`, { published, status: published ? "live" : "hidden" });
    return data;
  },
};
