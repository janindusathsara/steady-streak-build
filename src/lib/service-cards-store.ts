import { useSyncExternalStore } from "react";

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
  // legacy for list view
  priceLine: string;
  description: string;
  published: boolean;
};

const initialCards: ServiceCard[] = [
  {
    id: "1",
    title: "Emergency Plumbing",
    category: "Plumbing",
    rateType: "Per Hour",
    rateAmount: "2800",
    minFee: "1500",
    shortSummary: "24/7 emergency plumbing response",
    fullDescription:
      "24/7 emergency plumbing for burst pipes, leaks, blockages. Arrives within 60 min. 30-day guarantee.",
    duration: "1–3 hours",
    warranty: "30-day guarantee",
    coverImage: null,
    status: "live",
    districts: "All Districts",
    emoji: "🔧",
    bg: "from-amber-900 to-amber-700",
    priceLine: "Rs. 2,800 / hr · Min Rs. 1,500",
    description:
      "24/7 emergency plumbing for burst pipes, leaks, blockages. Arrives within 60 min. 30-day guarantee.",
    published: true,
  },
  {
    id: "2",
    title: "Faucet & Tap Repair",
    category: "Plumbing",
    rateType: "Fixed",
    rateAmount: "1800",
    minFee: "",
    shortSummary: "Faucet repair or replacement",
    fullDescription:
      "Full faucet repair or replacement. Kitchen, bathroom, garden taps. 14-day workmanship guarantee.",
    duration: "1–2 hours",
    warranty: "14-day guarantee",
    coverImage: null,
    status: "live",
    districts: "All Districts",
    emoji: "🚿",
    bg: "from-slate-800 to-slate-600",
    priceLine: "Rs. 1,800 / job · Fixed price",
    description:
      "Full faucet repair or replacement. Kitchen, bathroom, garden taps. 14-day workmanship guarantee.",
    published: true,
  },
  {
    id: "3",
    title: "Pipe Replacement",
    category: "Plumbing",
    rateType: "Per Hour",
    rateAmount: "3200",
    minFee: "",
    shortSummary: "Pipe inspection and replacement",
    fullDescription:
      "Complete pipe inspection, repair or replacement. UPVC, copper and PVC. Pressure testing included. 1-year guarantee.",
    duration: "2–4 hours",
    warranty: "1-year guarantee",
    coverImage: null,
    status: "live",
    districts: "All Districts",
    emoji: "🪒",
    bg: "from-emerald-900 to-emerald-700",
    priceLine: "Rs. 3,200 / hr + materials",
    description:
      "Complete pipe inspection, repair or replacement. UPVC, copper and PVC. Pressure testing included. 1-year guarantee.",
    published: true,
  },
  {
    id: "4",
    title: "Water Heater Service",
    category: "Plumbing",
    rateType: "Fixed",
    rateAmount: "4500",
    minFee: "",
    shortSummary: "Heater install and servicing",
    fullDescription:
      "Solar and electric water heater installation and servicing. All brands. 2-year warranty.",
    duration: "2–3 hours",
    warranty: "2-year warranty",
    coverImage: null,
    status: "hidden",
    districts: "All Districts",
    emoji: "💧",
    bg: "from-slate-400 to-slate-300",
    priceLine: "Rs. 4,500 / job · Incl. fitting",
    description:
      "Solar and electric water heater installation and servicing. All brands. 2-year warranty.",
    published: false,
  },
];

let cards: ServiceCard[] = [...initialCards];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const cardsStore = {
  getAll: () => cards,
  get: (id: string) => cards.find((c) => c.id === id),
  upsert: (card: ServiceCard) => {
    const exists = cards.some((c) => c.id === card.id);
    cards = exists ? cards.map((c) => (c.id === card.id ? card : c)) : [...cards, card];
    emit();
  },
  remove: (id: string) => {
    cards = cards.filter((c) => c.id !== id);
    emit();
  },
  togglePublish: (id: string) => {
    cards = cards.map((c) =>
      c.id === id
        ? { ...c, published: !c.published, status: !c.published ? "live" : "hidden" }
        : c
    );
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useCards() {
  return useSyncExternalStore(cardsStore.subscribe, cardsStore.getAll, cardsStore.getAll);
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
      ? `Rs. ${Number(card.rateAmount).toLocaleString()} / ${card.rateType.toLowerCase().replace("per ", "").replace("fixed", "job · Fixed")}`
      : "";
  const min = card.minFee ? ` · Min Rs. ${Number(card.minFee).toLocaleString()}` : "";
  return {
    ...card,
    priceLine: rate + min,
    description: card.fullDescription || card.shortSummary,
    published: card.status === "live",
  };
}
