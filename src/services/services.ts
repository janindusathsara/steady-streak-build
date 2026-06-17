import { http } from "./http";

export type ServiceCard = {
  id: string;
  title: string;
  category: string;
  rateType: string;
  rateAmount: string;
  minFee: string;
  shortSummary: string;
  fullDescription: string;
  duration: string;
  warranty: string;
  coverImage: string | null;
  status: "live" | "hidden";
  districts: string;
  emoji: string;
  bg: string;
  // derived for list view
  priceLine: string;
  description: string;
  published: boolean;
};

function fromApi(s: any): ServiceCard {
  return {
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
  };
}

export function emptyCard(): ServiceCard {
  return {
    id: crypto.randomUUID(),
    title: "",
    category: "Plumbing",
    rateType: "Per Hour",
    rateAmount: "",
    minFee: "",
    shortSummary: "",
    fullDescription: "",
    duration: "",
    warranty: "",
    coverImage: null,
    status: "live",
    districts: "All Districts",
    emoji: "🛠️",
    bg: "from-slate-800 to-slate-600",
    priceLine: "",
    description: "",
    published: true,
  };
}

export function syncDerived(card: ServiceCard): ServiceCard {
  const rate =
    card.rateAmount && card.rateType
      ? `Rs. ${Number(card.rateAmount).toLocaleString()} / ${card.rateType
          .toLowerCase()
          .replace("per ", "")
          .replace("fixed", "job · Fixed")}`
      : "";
  const min = card.minFee ? ` · Min Rs. ${Number(card.minFee).toLocaleString()}` : "";
  return {
    ...card,
    priceLine: rate + min,
    description: card.fullDescription || card.shortSummary,
    published: card.status === "live",
  };
}

export const servicesService = {
  async list(): Promise<ServiceCard[]> {
    const { data } = await http.get("/services");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map(fromApi);
  },
  async get(id: string): Promise<ServiceCard | null> {
    try {
      const { data } = await http.get(`/services/${id}`);
      return data ? fromApi(data) : null;
    } catch {
      return null;
    }
  },
  async create(card: Partial<ServiceCard>): Promise<ServiceCard> {
    const { data } = await http.post("/services", card);
    return fromApi(data);
  },
  async update(id: string, card: Partial<ServiceCard>): Promise<ServiceCard> {
    const { data } = await http.patch(`/services/${id}`, card);
    return fromApi(data);
  },
  async remove(id: string) {
    await http.delete(`/services/${id}`);
  },
  async togglePublish(id: string, published: boolean): Promise<ServiceCard> {
    const { data } = await http.patch(`/services/${id}`, {
      published,
      status: published ? "live" : "hidden",
    });
    return fromApi(data);
  },
};
