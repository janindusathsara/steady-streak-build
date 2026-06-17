import {
  loadCategories,
  loadSubServices,
  loadProvidersForCategory,
  loadAllProviders,
  type Category as ApiCategory,
  type SubService as ApiSubService,
  type Provider as ApiProvider,
} from "@/lib/booking";

export type SubService = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  emoji: string;
};

export type Provider = {
  id: string;
  name: string;
  initials: string;
  title: string;
  rating: number;
  jobsDone: number;
  experience: string;
  area: string;
  distance: string;
  availability: string;
  hourly: number;
  topRated: boolean;
  verified: boolean;
  color: string;
  reviews: number;
};

export type Review = {
  initials: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  color: string;
};
export type Faq = { q: string; a: string };

export type ServiceCategory = {
  id: string;
  name: string;
  emoji: string;
  specialists: string;
  img: string;
  tagline: string;
  description: string;
  priceRange: string;
  startingPrice: number;
  avgRating: number;
  avgResponse: string;
  totalSpecialists: number;
  jobsDone: number;
  included: string[];
  subServices: SubService[];
  providers: Provider[];
  reviews: Review[];
  faqs: Faq[];
};

const PROVIDER_COLORS = [
  "oklch(0.42 0.04 55)",
  "oklch(0.55 0.10 60)",
  "oklch(0.78 0.14 75)",
  "oklch(0.55 0.14 160)",
  "oklch(0.65 0.15 320)",
];

function initialsFrom(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "P"
  );
}

function mapSub(s: ApiSubService): SubService {
  return {
    id: s.slug || s.id,
    name: s.name,
    description: s.description ?? "",
    priceFrom: Number(s.base_price ?? 0),
    emoji: s.icon ?? "🛠️",
  };
}

function mapProvider(p: ApiProvider, i: number, categoryName: string): Provider {
  const name = p.profile?.display_name || p.profile?.username || "Provider";
  return {
    id: p.id,
    name,
    initials: initialsFrom(name),
    title: p.headline || `${categoryName} Specialist`,
    rating: Number(p.rating ?? 0),
    jobsDone: Number(p.jobs_done ?? 0),
    experience: `${p.years_experience ?? 0} yrs`,
    area: p.city ?? "—",
    distance: p.distance_km != null ? `${p.distance_km} km away` : "",
    availability: p.available ? "Available now" : "Scheduled slots available",
    hourly: Number(p.hourly_rate ?? 0),
    topRated: !!p.top_rated,
    verified: !!p.verified,
    color: PROVIDER_COLORS[i % PROVIDER_COLORS.length],
    reviews: 0,
  };
}

function fromApi(
  api: ApiCategory,
  subs: ApiSubService[] = [],
  providers: ApiProvider[] = [],
): ServiceCategory {
  const mappedSubs = subs.map(mapSub);
  const mappedProviders = providers.map((p, i) => mapProvider(p, i, api.name));
  return {
    id: api.slug,
    name: api.name,
    emoji: api.icon ?? "🛠️",
    specialists: `${api.pros_count ?? mappedProviders.length}+ Specialists`,
    img: "",
    tagline: "",
    description: "",
    priceRange: "",
    startingPrice: mappedSubs.length ? Math.min(...mappedSubs.map((s) => s.priceFrom)) : 0,
    avgRating: 0,
    avgResponse: "",
    totalSpecialists: api.pros_count ?? 0,
    jobsDone: 0,
    included: [],
    subServices: mappedSubs,
    providers: mappedProviders,
    reviews: [],
    faqs: [],
  };
}

export const browseService = {
  async listCategories(): Promise<ServiceCategory[]> {
    try {
      const cats = await loadCategories();
      return cats.map((c) => fromApi(c));
    } catch {
      return [];
    }
  },

  async getServiceBySlug(slug: string): Promise<ServiceCategory | undefined> {
    try {
      const cats = await loadCategories();
      const match = cats.find((c) => c.slug === slug);
      if (!match) return undefined;
      const [subs, providers] = await Promise.all([
        loadSubServices(match.id).catch(() => [] as ApiSubService[]),
        loadProvidersForCategory(match.id).catch(() => [] as ApiProvider[]),
      ]);
      return fromApi(match, subs, providers);
    } catch {
      return undefined;
    }
  },

  async getSubService(serviceSlug: string, subSlug: string) {
    const service = await this.getServiceBySlug(serviceSlug);
    if (!service) return undefined;
    const sub = service.subServices.find((s) => s.id === subSlug);
    if (!sub) return undefined;
    return { service, sub };
  },

  async topProviders(limit = 4): Promise<Provider[]> {
    try {
      const list = await loadAllProviders();
      const sorted = [...list].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
      return sorted.slice(0, limit).map((p, i) => mapProvider(p, i, "Specialist"));
    } catch {
      return [];
    }
  },
};
