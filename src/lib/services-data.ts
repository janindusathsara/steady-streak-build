import electrician from "@/assets/cover/service-electrician.jpg";
import mason from "@/assets/cover/service-mason.jpg";
import plumber from "@/assets/cover/service-plumber.jpg";
import carpenter from "@/assets/cover/service-carpenter.jpg";
import painter from "@/assets/cover/service-painter.jpg";
import hvac from "@/assets/cover/service-hvac.jpg";
import welder from "@/assets/cover/service-welder.jpg";
import cleaner from "@/assets/cover/service-cleaner.jpg";

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
  included: string[];
  providers: Provider[];
  reviews: Review[];
};

export type Provider = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  distance: string;
  availability: string;
  hourly: number;
  color: string;
};

export type Review = {
  initials: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  color: string;
};

const baseProviders = (label: string): Provider[] => [
  { id: "p1", name: "Marcus Sterling", title: `Master ${label}`, rating: 4.9, reviews: 128, distance: "2.4 mi", availability: "Available now", hourly: 85, color: "oklch(0.42 0.04 55)" },
  { id: "p2", name: "Rapid Response Co.", title: `Emergency ${label} · 24/7`, rating: 4.9, reviews: 210, distance: "1.8 mi", availability: "< 1 hour", hourly: 95, color: "oklch(0.55 0.10 60)" },
  { id: "p3", name: "David Miller", title: `Certified ${label}`, rating: 4.8, reviews: 94, distance: "3.1 mi", availability: "Today", hourly: 70, color: "oklch(0.78 0.14 75)" },
];

const baseReviews: Review[] = [
  { initials: "AJ", name: "Alex Johnson", date: "Oct 24, 2024", rating: 5, text: "Arrived within 90 minutes, diagnosed the issue, and had it fixed in 2 hours. Absolutely professional. Worth every penny.", color: "oklch(0.55 0.10 60)" },
  { initials: "SR", name: "Sarah R.", date: "Oct 18, 2024", rating: 5, text: "Emergency at 11pm — water everywhere. Rapid Response had someone here in 45 minutes. Fixed the main valve, cleaned up. Unreal service.", color: "oklch(0.65 0.15 320)" },
  { initials: "TK", name: "T. Kumar", date: "Oct 12, 2024", rating: 4, text: "Good work on the blockage. David was thorough and explained everything clearly. Would book again.", color: "oklch(0.55 0.14 160)" },
];

export const SERVICES: ServiceCategory[] = [
  { id: "plumber", name: "Plumbing", emoji: "🔧", specialists: "1.2k+ Specialists", img: plumber, tagline: "Leaks, pipes, fixtures.", description: "Plumbing covers burst pipes, severe leaks, blocked drains, water heater failures, and any plumbing issue requiring attention. Our verified plumbers respond within 2 hours — often much sooner — and carry a full stock of common repair parts for same-visit fixes.", priceRange: "$45 – $120", startingPrice: 45, avgRating: 4.9, avgResponse: "< 18 min", totalSpecialists: 1240, included: ["On-site diagnosis and fault assessment", "Emergency pipe repair or replacement", "Water isolation and damage prevention", "Detailed work report and invoice", "Post-job system pressure test"], providers: baseProviders("Plumber"), reviews: baseReviews },
  { id: "electrician", name: "Electrical", emoji: "⚡", specialists: "850 Specialists", img: electrician, tagline: "Wiring, repairs, installations.", description: "Full-service electrical work — outlet repairs, panel upgrades, lighting installation, and emergency power restoration. Licensed electricians, code-compliant work, and a 1-year guarantee on every job.", priceRange: "$60 – $140", startingPrice: 60, avgRating: 4.8, avgResponse: "< 25 min", totalSpecialists: 850, included: ["Circuit fault diagnostics", "Wiring repair and replacement", "Outlet & switch installation", "Safety inspection report", "Code compliance verification"], providers: baseProviders("Electrician"), reviews: baseReviews },
  { id: "painter", name: "Painting", emoji: "🎨", specialists: "640 Specialists", img: painter, tagline: "Interior & exterior painting.", description: "Professional interior and exterior painting. Surface prep, premium paints, and clean execution — from a single accent wall to a full repaint.", priceRange: "$40 – $90", startingPrice: 40, avgRating: 4.7, avgResponse: "Same day", totalSpecialists: 640, included: ["Surface prep and priming", "Premium paint application", "Furniture protection", "Multi-coat finish", "Clean site at completion"], providers: baseProviders("Painter"), reviews: baseReviews },
  { id: "carpenter", name: "Carpentry", emoji: "🪚", specialists: "410 Specialists", img: carpenter, tagline: "Furniture, doors, custom builds.", description: "Custom carpentry, door fitting, furniture repair, and built-ins. Experienced craftspeople with their own tools.", priceRange: "$55 – $130", startingPrice: 55, avgRating: 4.8, avgResponse: "< 1 hour", totalSpecialists: 410, included: ["On-site measurement", "Material sourcing", "Custom build or repair", "Finishing and sealing", "Cleanup"], providers: baseProviders("Carpenter"), reviews: baseReviews },
  { id: "hvac", name: "HVAC", emoji: "❄️", specialists: "420 Specialists", img: hvac, tagline: "AC service & installation.", description: "Air conditioning service, repair, installation, and seasonal maintenance. Certified HVAC technicians.", priceRange: "$70 – $180", startingPrice: 70, avgRating: 4.8, avgResponse: "< 30 min", totalSpecialists: 420, included: ["System diagnostics", "Refrigerant top-up", "Filter replacement", "Performance test", "Maintenance report"], providers: baseProviders("HVAC Tech"), reviews: baseReviews },
  { id: "cleaner", name: "Cleaning", emoji: "🧹", specialists: "930 Specialists", img: cleaner, tagline: "Deep & routine home cleaning.", description: "Deep cleans, move-in / move-out cleans, and recurring home cleaning. Vetted, insured cleaning crews.", priceRange: "$30 – $80", startingPrice: 30, avgRating: 4.9, avgResponse: "Same day", totalSpecialists: 930, included: ["Full home cleaning", "Kitchen & bathroom deep clean", "Eco-friendly products", "Trash removal", "Satisfaction guarantee"], providers: baseProviders("Cleaner"), reviews: baseReviews },
  { id: "mason", name: "Masonry", emoji: "🧱", specialists: "280 Specialists", img: mason, tagline: "Brickwork, plastering, tiling.", description: "Brickwork, plastering, tiling, and concrete repairs by experienced masons.", priceRange: "$55 – $150", startingPrice: 55, avgRating: 4.7, avgResponse: "< 1 hour", totalSpecialists: 280, included: ["Site assessment", "Brick / block work", "Plastering and finishing", "Tile installation", "Cleanup"], providers: baseProviders("Mason"), reviews: baseReviews },
  { id: "welder", name: "Welding", emoji: "🔥", specialists: "190 Specialists", img: welder, tagline: "Gates, grills, metalwork.", description: "Mobile welding for gates, grills, railings, and structural metalwork. MIG/TIG/Arc capable.", priceRange: "$65 – $160", startingPrice: 65, avgRating: 4.8, avgResponse: "Today", totalSpecialists: 190, included: ["On-site assessment", "Metal cutting and welding", "Surface treatment", "Paint / primer touch-up", "Quality check"], providers: baseProviders("Welder"), reviews: baseReviews },
];

export function getService(id: string): ServiceCategory | undefined {
  return SERVICES.find((s) => s.id === id);
}
