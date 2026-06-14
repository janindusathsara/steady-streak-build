import {
  loadCategories,
  loadSubServices,
  loadProvidersForCategory,
  type Category as ApiCategory,
  type SubService as ApiSubService,
  type Provider as ApiProvider,
} from "@/lib/booking";
import {
  SERVICES,
  getService as getStaticService,
  getSubService as getStaticSubService,
  type ServiceCategory,
  type SubService,
  type Provider,
} from "@/lib/services-data";

const PROVIDER_COLORS = [
  "oklch(0.42 0.04 55)",
  "oklch(0.55 0.10 60)",
  "oklch(0.78 0.14 75)",
  "oklch(0.55 0.14 160)",
  "oklch(0.65 0.15 320)",
];

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "P";
}

function mapSub(s: ApiSubService, fallbackEmoji = "🛠️"): SubService {
  return {
    id: s.slug || s.id,
    name: s.name,
    description: s.description ?? "",
    priceFrom: Number(s.base_price ?? 0),
    emoji: s.icon ?? fallbackEmoji,
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

function staticBySlug(slug: string): ServiceCategory | undefined {
  return getStaticService(slug);
}

function mergeCategory(api: ApiCategory, subs: ApiSubService[], providers: ApiProvider[]): ServiceCategory {
  const fallback = staticBySlug(api.slug);
  const mappedSubs = subs.map((s) => mapSub(s, fallback?.emoji));
  const mappedProviders = providers.map((p, i) => mapProvider(p, i, api.name));
  return {
    id: api.slug,
    name: api.name,
    emoji: api.icon ?? fallback?.emoji ?? "🛠️",
    specialists: `${api.pros_count ?? mappedProviders.length}+ Specialists`,
    img: fallback?.img ?? "",
    tagline: fallback?.tagline ?? "",
    description: fallback?.description ?? "",
    priceRange: fallback?.priceRange ?? "",
    startingPrice: mappedSubs.length ? Math.min(...mappedSubs.map((s) => s.priceFrom)) : fallback?.startingPrice ?? 0,
    avgRating: fallback?.avgRating ?? 4.8,
    avgResponse: fallback?.avgResponse ?? "< 30 min",
    totalSpecialists: api.pros_count ?? fallback?.totalSpecialists ?? 0,
    jobsDone: fallback?.jobsDone ?? 0,
    included: fallback?.included ?? [],
    subServices: mappedSubs.length ? mappedSubs : fallback?.subServices ?? [],
    providers: mappedProviders.length ? mappedProviders : fallback?.providers ?? [],
    reviews: fallback?.reviews ?? [],
    faqs: fallback?.faqs ?? [],
  };
}

export const browseService = {
  async listCategories(): Promise<ServiceCategory[]> {
    try {
      const cats = await loadCategories();
      if (!cats.length) return SERVICES;
      return cats.map((c) => {
        const fb = staticBySlug(c.slug);
        return {
          id: c.slug,
          name: c.name,
          emoji: c.icon ?? fb?.emoji ?? "🛠️",
          specialists: `${c.pros_count ?? 0}+ Specialists`,
          img: fb?.img ?? "",
          tagline: fb?.tagline ?? "",
          description: fb?.description ?? "",
          priceRange: fb?.priceRange ?? "",
          startingPrice: fb?.startingPrice ?? 0,
          avgRating: fb?.avgRating ?? 4.8,
          avgResponse: fb?.avgResponse ?? "< 30 min",
          totalSpecialists: c.pros_count ?? 0,
          jobsDone: fb?.jobsDone ?? 0,
          included: fb?.included ?? [],
          subServices: fb?.subServices ?? [],
          providers: fb?.providers ?? [],
          reviews: fb?.reviews ?? [],
          faqs: fb?.faqs ?? [],
        } as ServiceCategory;
      });
    } catch {
      return SERVICES;
    }
  },

  async getServiceBySlug(slug: string): Promise<ServiceCategory | undefined> {
    try {
      const cats = await loadCategories();
      const match = cats.find((c) => c.slug === slug);
      if (!match) return staticBySlug(slug);
      const [subs, providers] = await Promise.all([
        loadSubServices(match.id).catch(() => [] as ApiSubService[]),
        loadProvidersForCategory(match.id).catch(() => [] as ApiProvider[]),
      ]);
      return mergeCategory(match, subs, providers);
    } catch {
      return staticBySlug(slug);
    }
  },

  async getSubService(serviceSlug: string, subSlug: string) {
    const service = await this.getServiceBySlug(serviceSlug);
    if (!service) return getStaticSubService(serviceSlug, subSlug);
    const sub = service.subServices.find((s) => s.id === subSlug);
    if (!sub) return getStaticSubService(serviceSlug, subSlug);
    return { service, sub };
  },
};
