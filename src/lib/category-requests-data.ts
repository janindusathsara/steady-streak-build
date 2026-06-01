export type CategoryRequestStatus = "Pending" | "Active" | "Rejected";

export interface CategoryRequest {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  requestedBy: string;
  requesterEmail: string;
  contact: string;
  providersWaiting: number;
  applied: string;
  status: CategoryRequestStatus;
  priceRange: string;
  platformFee: string;
  demand: string;
  description: string;
  subCategories: Array<{ icon: string; label: string }>;
  adminNotes: string;
  requestedAgo: string;
  createdAt: string;
  monthlyBookings: string;
  monthlyRevenue: string;
  searchHits: string;
  providers: Array<{ i: string; name: string; city: string; years: string }>;
  extraProviders: number;
}

export const CATEGORY_REQUESTS: CategoryRequest[] = [
  {
    id: "1", icon: "🌿", name: "Garden & Landscaping", subtitle: "Outdoor care & design",
    requestedBy: "Ruwan Silva", requesterEmail: "ruwan.s@gmail.com", contact: "+94 77 890 1234",
    providersWaiting: 12, applied: "3h ago", status: "Pending",
    priceRange: "Rs. 2,500 – Rs. 8,000", platformFee: "8% (Standard)", demand: "High ↑",
    description: "Covers all outdoor maintenance including lawn mowing, hedge trimming, garden design, plant care, irrigation systems and landscaping for residential and commercial properties.",
    subCategories: [
      { icon: "🌱", label: "Lawn Mowing" }, { icon: "✂️", label: "Hedge Trimming" },
      { icon: "💧", label: "Irrigation" }, { icon: "🌸", label: "Plant Care" }, { icon: "🌳", label: "Garden Design" },
    ],
    adminNotes: "High demand — 12 providers waiting. Popular in Colombo suburbs. Recommend approval with standard 8% fee.",
    requestedAgo: "3 hours ago", createdAt: "28 May 2026, 09:02 AM",
    monthlyBookings: "80–120", monthlyRevenue: "Rs. 24K+", searchHits: "340 / week",
    providers: [
      { i: "RS", name: "Ruwan Silva", city: "Colombo", years: "5yr" },
      { i: "CN", name: "Chamara Nonis", city: "Gampaha", years: "3yr" },
      { i: "PT", name: "Prasad Tennakoon", city: "Colombo", years: "8yr" },
    ], extraProviders: 9,
  },
  {
    id: "2", icon: "🔐", name: "Smart Home & Security", subtitle: "Installation & monitoring",
    requestedBy: "Dinesh Jayawardena", requesterEmail: "dinesh.j@gmail.com", contact: "+94 71 222 3344",
    providersWaiting: 8, applied: "1d ago", status: "Pending",
    priceRange: "Rs. 5,000 – Rs. 25,000", platformFee: "10%", demand: "Medium",
    description: "Smart home device installation, CCTV setup, alarm systems and 24/7 monitoring services.",
    subCategories: [{ icon: "📹", label: "CCTV" }, { icon: "🚨", label: "Alarms" }, { icon: "💡", label: "Smart Lights" }],
    adminNotes: "Growing segment, especially in urban areas.",
    requestedAgo: "1 day ago", createdAt: "27 May 2026",
    monthlyBookings: "40–70", monthlyRevenue: "Rs. 18K+", searchHits: "210 / week",
    providers: [{ i: "DJ", name: "Dinesh Jayawardena", city: "Colombo", years: "4yr" }], extraProviders: 7,
  },
  {
    id: "3", icon: "🐜", name: "Pest Control", subtitle: "Fumigation & pest removal",
    requestedBy: "Amara Dissanayake", requesterEmail: "amara.d@yahoo.com", contact: "+94 76 555 9988",
    providersWaiting: 6, applied: "2d ago", status: "Pending",
    priceRange: "Rs. 3,000 – Rs. 12,000", platformFee: "8% (Standard)", demand: "Medium",
    description: "Termite, rodent and insect pest control with safe fumigation methods.",
    subCategories: [{ icon: "🪳", label: "Cockroach" }, { icon: "🐀", label: "Rodent" }, { icon: "🐝", label: "Wasp" }],
    adminNotes: "Seasonal demand peaks in monsoon.",
    requestedAgo: "2 days ago", createdAt: "26 May 2026",
    monthlyBookings: "30–50", monthlyRevenue: "Rs. 12K+", searchHits: "150 / week",
    providers: [{ i: "AD", name: "Amara Dissanayake", city: "Kandy", years: "6yr" }], extraProviders: 5,
  },
  {
    id: "4", icon: "🏊", name: "Pool Cleaning", subtitle: "Pool maintenance & chemicals",
    requestedBy: "Pradeep Abeysekara", requesterEmail: "pradeep.a@gmail.com", contact: "+94 77 333 1212",
    providersWaiting: 9, applied: "5d ago", status: "Active",
    priceRange: "Rs. 4,000 – Rs. 15,000", platformFee: "8% (Standard)", demand: "Medium",
    description: "Pool cleaning, chemical balancing, equipment maintenance and seasonal services.",
    subCategories: [{ icon: "💧", label: "Chemical" }, { icon: "🧹", label: "Cleaning" }],
    adminNotes: "Active category, performing well.",
    requestedAgo: "5 days ago", createdAt: "23 May 2026",
    monthlyBookings: "50–80", monthlyRevenue: "Rs. 20K+", searchHits: "180 / week",
    providers: [{ i: "PA", name: "Pradeep Abeysekara", city: "Colombo", years: "7yr" }], extraProviders: 8,
  },
  {
    id: "5", icon: "🚗", name: "Vehicle Repair", subtitle: "Car servicing & repair",
    requestedBy: "Lasith Malinga", requesterEmail: "lasith.m@gmail.com", contact: "+94 70 999 8877",
    providersWaiting: 3, applied: "8d ago", status: "Rejected",
    priceRange: "Rs. 5,000 – Rs. 50,000", platformFee: "10%", demand: "Low",
    description: "On-site car servicing, oil changes and mobile repair services.",
    subCategories: [{ icon: "🔧", label: "Service" }, { icon: "🛢️", label: "Oil Change" }],
    adminNotes: "Rejected — out of platform scope (home services focus).",
    requestedAgo: "8 days ago", createdAt: "20 May 2026",
    monthlyBookings: "10–20", monthlyRevenue: "Rs. 5K", searchHits: "40 / week",
    providers: [{ i: "LM", name: "Lasith Malinga", city: "Galle", years: "10yr" }], extraProviders: 2,
  },
];

export function findCategoryRequest(id: string) {
  return CATEGORY_REQUESTS.find((c) => c.id === id);
}
