import electrician from "@/assets/cover/service-electrician.jpg";
import mason from "@/assets/cover/service-mason.jpg";
import plumber from "@/assets/cover/service-plumber.jpg";
import carpenter from "@/assets/cover/service-carpenter.jpg";
import painter from "@/assets/cover/service-painter.jpg";
import hvac from "@/assets/cover/service-hvac.jpg";
import welder from "@/assets/cover/service-welder.jpg";
import cleaner from "@/assets/cover/service-cleaner.jpg";

export type SubService = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  emoji: string;
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

const baseReviews: Review[] = [
  { initials: "AJ", name: "Alex Johnson", date: "Oct 24, 2024", rating: 5, text: "Arrived within 90 minutes, diagnosed the issue, and had it fixed in 2 hours. Absolutely professional. Worth every penny.", color: "oklch(0.55 0.10 60)" },
  { initials: "SR", name: "Sarah R.", date: "Oct 18, 2024", rating: 5, text: "Emergency at 11pm — water everywhere. Rapid Response had someone here in 45 minutes. Fixed the main valve, cleaned up. Unreal service.", color: "oklch(0.65 0.15 320)" },
  { initials: "TK", name: "T. Kumar", date: "Oct 12, 2024", rating: 4, text: "Good work on the blockage. David was thorough and explained everything clearly. Would book again.", color: "oklch(0.55 0.14 160)" },
];

const baseFaqs = (label: string): Faq[] => [
  { q: `How do I know the ${label.toLowerCase()} is verified?`, a: `All FixItNow ${label.toLowerCase()}s submit their NIC, trade certificates, and go through a background check before being listed.` },
  { q: "Can I book for an emergency?", a: "Yes — many providers offer emergency response within 1–2 hours. Use the Available Now filter." },
  { q: "When do I pay?", a: "Payment is held in escrow when you book and released to the provider only after you confirm the job is complete." },
  { q: "What if I'm not satisfied?", a: "Raise a dispute within 48 hours. Our support team mediates and we re-dispatch a provider at no extra cost if needed." },
];

const baseProviders = (label: string): Provider[] => [
  { id: "p1", name: "Marcus Sterling", initials: "MS", title: `Master ${label}`, rating: 4.9, jobsDone: 342, experience: "8 yrs", area: "Downtown Colombo", distance: "2.4 km away", availability: "Available within 2 hours", hourly: 2800, topRated: true, verified: true, color: "oklch(0.42 0.04 55)", reviews: 128 },
  { id: "p2", name: "Rajan Perera", initials: "RP", title: `${label} & Drainage Specialist`, rating: 4.7, jobsDone: 189, experience: "5 yrs", area: "Negombo", distance: "3.8 km away", availability: "Available today", hourly: 2200, topRated: false, verified: true, color: "oklch(0.55 0.10 60)", reviews: 94 },
  { id: "p3", name: "Kumari Fernando", initials: "KF", title: `Certified ${label}`, rating: 4.8, jobsDone: 271, experience: "6 yrs", area: "Gampaha", distance: "6.1 km away", availability: "Scheduled slots available", hourly: 2500, topRated: true, verified: true, color: "oklch(0.78 0.14 75)", reviews: 156 },
];

const subSets: Record<string, SubService[]> = {
  plumber: [
    { id: "faucet", name: "Faucet & Tap Repair", description: "Fix leaking or broken faucets, taps, and mixers in kitchen, bathroom, or outdoor areas.", priceFrom: 1500, emoji: "💧" },
    { id: "toilet", name: "Toilet Installation & Repair", description: "Complete toilet fitting, flush repair, cistern replacement and blockage clearing.", priceFrom: 2000, emoji: "🚽" },
    { id: "shower", name: "Shower & Bath Setup", description: "Install and repair shower heads, bath panels, mixing valves, and drainage systems.", priceFrom: 2500, emoji: "🚿" },
    { id: "pipe", name: "Pipe Fitting & Leak Fix", description: "Detect and repair pipe leaks, replace damaged pipes, and re-route plumbing lines.", priceFrom: 3000, emoji: "🏠" },
    { id: "drainage", name: "Drainage & Blockage", description: "Clear blocked drains, sinks, floor traps, and sewer lines using professional equipment.", priceFrom: 1800, emoji: "🪣" },
    { id: "water-heater", name: "Water Heater Service", description: "Install, repair, or service electric and solar water heaters and geysers.", priceFrom: 2200, emoji: "🔥" },
  ],
  electrician: [
    { id: "wiring", name: "House Wiring", description: "Full or partial house re-wiring with code-compliant materials and certified work.", priceFrom: 3500, emoji: "🔌" },
    { id: "outlets", name: "Outlets & Switches", description: "Install, repair, or relocate sockets, switches, and dimmers.", priceFrom: 1200, emoji: "🔘" },
    { id: "lighting", name: "Lighting Installation", description: "Ceiling lights, chandeliers, LED strips, and outdoor lighting.", priceFrom: 1800, emoji: "💡" },
    { id: "breaker", name: "Breaker / Panel Repair", description: "Troubleshoot tripping breakers, replace fuses, upgrade panels.", priceFrom: 2500, emoji: "⚡" },
    { id: "fan", name: "Fan Installation", description: "Ceiling and exhaust fan installation, balancing, and repair.", priceFrom: 1500, emoji: "🌀" },
    { id: "emergency", name: "Emergency Power", description: "Power outage diagnostics, generator hook-up, and inverter wiring.", priceFrom: 2800, emoji: "🚨" },
  ],
  painter: [
    { id: "interior", name: "Interior Painting", description: "Walls, ceilings, and trim with premium emulsion or matte finish.", priceFrom: 1200, emoji: "🎨" },
    { id: "exterior", name: "Exterior Painting", description: "Weather-resistant exterior wall coatings and waterproof finishes.", priceFrom: 1500, emoji: "🏡" },
    { id: "wood", name: "Wood & Trim Finish", description: "Doors, windows, railings — varnish, stain, or paint.", priceFrom: 1800, emoji: "🪵" },
    { id: "texture", name: "Texture & Accent Walls", description: "Decorative textures, stencil work, and feature wall finishes.", priceFrom: 2500, emoji: "🖌️" },
    { id: "waterproof", name: "Waterproofing", description: "Roof, balcony, and wall waterproofing membranes.", priceFrom: 2800, emoji: "💧" },
    { id: "touchup", name: "Touch-Up & Repair", description: "Small repairs, patching, and color matching for existing paint.", priceFrom: 800, emoji: "🩹" },
  ],
  carpenter: [
    { id: "doors", name: "Door Fitting & Repair", description: "Hang new doors, replace hinges/locks, or repair existing doors.", priceFrom: 1500, emoji: "🚪" },
    { id: "furniture", name: "Furniture Build & Repair", description: "Custom shelves, tables, and repairs to existing furniture.", priceFrom: 2500, emoji: "🪑" },
    { id: "cabinets", name: "Kitchen Cabinets", description: "Custom kitchen cabinetry, wardrobes, and storage solutions.", priceFrom: 3500, emoji: "🗄️" },
    { id: "flooring", name: "Wood Flooring", description: "Hardwood, laminate, and parquet floor installation.", priceFrom: 3000, emoji: "🟫" },
    { id: "decking", name: "Decking & Pergolas", description: "Outdoor wooden decks, pergolas, and garden structures.", priceFrom: 4000, emoji: "🌳" },
    { id: "custom", name: "Custom Built-Ins", description: "Made-to-measure built-in storage, benches, and feature pieces.", priceFrom: 3500, emoji: "📐" },
  ],
  hvac: [
    { id: "ac-install", name: "AC Installation", description: "Split, window, and inverter AC installation with copper piping.", priceFrom: 4500, emoji: "❄️" },
    { id: "ac-service", name: "AC Service & Cleaning", description: "Routine cleaning, gas top-up, and filter replacement.", priceFrom: 1800, emoji: "🧴" },
    { id: "ac-repair", name: "AC Repair", description: "Cooling issues, water leaks, compressor and PCB repairs.", priceFrom: 2500, emoji: "🛠️" },
    { id: "duct", name: "Ducting & Ventilation", description: "Duct installation, cleaning, and balancing for whole-home systems.", priceFrom: 3500, emoji: "💨" },
    { id: "fridge", name: "Refrigerator Repair", description: "Cooling, defrost, and compressor repairs for fridges.", priceFrom: 2200, emoji: "🧊" },
    { id: "maintenance", name: "Annual Maintenance", description: "Bundled annual contracts for multi-unit homes and offices.", priceFrom: 6000, emoji: "📅" },
  ],
  cleaner: [
    { id: "deep", name: "Deep Cleaning", description: "Full deep clean including kitchen, bathrooms, and floors.", priceFrom: 3500, emoji: "✨" },
    { id: "routine", name: "Routine Cleaning", description: "Weekly or bi-weekly home cleaning with trusted crews.", priceFrom: 2000, emoji: "🧹" },
    { id: "movein", name: "Move In / Move Out", description: "Top-to-bottom cleaning for empty homes before or after moving.", priceFrom: 4500, emoji: "📦" },
    { id: "carpet", name: "Carpet & Sofa", description: "Steam cleaning for carpets, sofas, and upholstery.", priceFrom: 2800, emoji: "🛋️" },
    { id: "kitchen", name: "Kitchen Deep Clean", description: "Degreasing, hood, oven, and cabinet detailing.", priceFrom: 2500, emoji: "🍳" },
    { id: "windows", name: "Window Cleaning", description: "Interior and exterior window cleaning, including high windows.", priceFrom: 1500, emoji: "🪟" },
  ],
  mason: [
    { id: "brick", name: "Brick & Block Work", description: "New walls, partitions, and structural brickwork.", priceFrom: 2500, emoji: "🧱" },
    { id: "plaster", name: "Plastering", description: "Smooth interior and weather-resistant exterior plastering.", priceFrom: 1800, emoji: "🪨" },
    { id: "tile", name: "Tiling", description: "Floor and wall tiling — ceramic, porcelain, or natural stone.", priceFrom: 2800, emoji: "▫️" },
    { id: "concrete", name: "Concrete Work", description: "Slabs, columns, driveways, and small structural pours.", priceFrom: 3500, emoji: "🏗️" },
    { id: "repair", name: "Crack & Wall Repair", description: "Repair structural cracks, replaster, and refinish.", priceFrom: 1500, emoji: "🩹" },
    { id: "garden", name: "Garden Walls & Paving", description: "Boundary walls, paving, and outdoor masonry.", priceFrom: 3000, emoji: "🌿" },
  ],
  welder: [
    { id: "gates", name: "Gates & Grills", description: "Custom gates, window grills, and security railings.", priceFrom: 3500, emoji: "🚪" },
    { id: "railings", name: "Railings & Balconies", description: "Stair railings, balcony grills, and balustrades.", priceFrom: 2800, emoji: "🪜" },
    { id: "structural", name: "Structural Welding", description: "Steel beams, frames, and structural metal work.", priceFrom: 4500, emoji: "🏗️" },
    { id: "repair", name: "On-Site Repair", description: "Mobile welding for gate hinges, broken frames, and metal parts.", priceFrom: 1800, emoji: "🛠️" },
    { id: "stainless", name: "Stainless Steel Work", description: "Hand rails, kitchen counters, and decorative stainless work.", priceFrom: 3800, emoji: "✨" },
    { id: "custom", name: "Custom Metalwork", description: "Made-to-order metal furniture, planters, and art pieces.", priceFrom: 3500, emoji: "🎨" },
  ],
};

export const SERVICES: ServiceCategory[] = [
  { id: "plumber", name: "Plumbing", emoji: "🔧", specialists: "1.2k+ Specialists", img: plumber, tagline: "Leaks, pipes, fixtures.", description: "Plumbing covers burst pipes, severe leaks, blocked drains, water heater failures, and any plumbing issue requiring attention. Our verified plumbers respond within 2 hours — often much sooner — and carry a full stock of common repair parts for same-visit fixes.", priceRange: "$45 – $120", startingPrice: 1500, avgRating: 4.8, avgResponse: "< 18 min", totalSpecialists: 1240, jobsDone: 3400, included: ["On-site diagnosis and fault assessment", "Emergency pipe repair or replacement", "Water isolation and damage prevention", "Detailed work report and invoice", "Post-job system pressure test"], subServices: subSets.plumber, providers: baseProviders("Plumber"), reviews: baseReviews, faqs: baseFaqs("Plumber") },
  { id: "electrician", name: "Electrical", emoji: "⚡", specialists: "850 Specialists", img: electrician, tagline: "Wiring, repairs, installations.", description: "Full-service electrical work — outlet repairs, panel upgrades, lighting installation, and emergency power restoration. Licensed electricians, code-compliant work, and a 1-year guarantee on every job.", priceRange: "$60 – $140", startingPrice: 1200, avgRating: 4.8, avgResponse: "< 25 min", totalSpecialists: 850, jobsDone: 2900, included: ["Circuit fault diagnostics", "Wiring repair and replacement", "Outlet & switch installation", "Safety inspection report", "Code compliance verification"], subServices: subSets.electrician, providers: baseProviders("Electrician"), reviews: baseReviews, faqs: baseFaqs("Electrician") },
  { id: "painter", name: "Painting", emoji: "🎨", specialists: "640 Specialists", img: painter, tagline: "Interior & exterior painting.", description: "Professional interior and exterior painting. Surface prep, premium paints, and clean execution — from a single accent wall to a full repaint.", priceRange: "$40 – $90", startingPrice: 800, avgRating: 4.7, avgResponse: "Same day", totalSpecialists: 640, jobsDone: 2100, included: ["Surface prep and priming", "Premium paint application", "Furniture protection", "Multi-coat finish", "Clean site at completion"], subServices: subSets.painter, providers: baseProviders("Painter"), reviews: baseReviews, faqs: baseFaqs("Painter") },
  { id: "carpenter", name: "Carpentry", emoji: "🪚", specialists: "410 Specialists", img: carpenter, tagline: "Furniture, doors, custom builds.", description: "Custom carpentry, door fitting, furniture repair, and built-ins. Experienced craftspeople with their own tools.", priceRange: "$55 – $130", startingPrice: 1500, avgRating: 4.8, avgResponse: "< 1 hour", totalSpecialists: 410, jobsDone: 1700, included: ["On-site measurement", "Material sourcing", "Custom build or repair", "Finishing and sealing", "Cleanup"], subServices: subSets.carpenter, providers: baseProviders("Carpenter"), reviews: baseReviews, faqs: baseFaqs("Carpenter") },
  { id: "hvac", name: "HVAC", emoji: "❄️", specialists: "420 Specialists", img: hvac, tagline: "AC service & installation.", description: "Air conditioning service, repair, installation, and seasonal maintenance. Certified HVAC technicians.", priceRange: "$70 – $180", startingPrice: 1800, avgRating: 4.8, avgResponse: "< 30 min", totalSpecialists: 420, jobsDone: 1900, included: ["System diagnostics", "Refrigerant top-up", "Filter replacement", "Performance test", "Maintenance report"], subServices: subSets.hvac, providers: baseProviders("HVAC Tech"), reviews: baseReviews, faqs: baseFaqs("HVAC Tech") },
  { id: "cleaner", name: "Cleaning", emoji: "🧹", specialists: "930 Specialists", img: cleaner, tagline: "Deep & routine home cleaning.", description: "Deep cleans, move-in / move-out cleans, and recurring home cleaning. Vetted, insured cleaning crews.", priceRange: "$30 – $80", startingPrice: 1500, avgRating: 4.9, avgResponse: "Same day", totalSpecialists: 930, jobsDone: 4200, included: ["Full home cleaning", "Kitchen & bathroom deep clean", "Eco-friendly products", "Trash removal", "Satisfaction guarantee"], subServices: subSets.cleaner, providers: baseProviders("Cleaner"), reviews: baseReviews, faqs: baseFaqs("Cleaner") },
  { id: "mason", name: "Masonry", emoji: "🧱", specialists: "280 Specialists", img: mason, tagline: "Brickwork, plastering, tiling.", description: "Brickwork, plastering, tiling, and concrete repairs by experienced masons.", priceRange: "$55 – $150", startingPrice: 1500, avgRating: 4.7, avgResponse: "< 1 hour", totalSpecialists: 280, jobsDone: 1200, included: ["Site assessment", "Brick / block work", "Plastering and finishing", "Tile installation", "Cleanup"], subServices: subSets.mason, providers: baseProviders("Mason"), reviews: baseReviews, faqs: baseFaqs("Mason") },
  { id: "welder", name: "Welding", emoji: "🔥", specialists: "190 Specialists", img: welder, tagline: "Gates, grills, metalwork.", description: "Mobile welding for gates, grills, railings, and structural metalwork. MIG/TIG/Arc capable.", priceRange: "$65 – $160", startingPrice: 1800, avgRating: 4.8, avgResponse: "Today", totalSpecialists: 190, jobsDone: 980, included: ["On-site assessment", "Metal cutting and welding", "Surface treatment", "Paint / primer touch-up", "Quality check"], subServices: subSets.welder, providers: baseProviders("Welder"), reviews: baseReviews, faqs: baseFaqs("Welder") },
];

export function getService(id: string): ServiceCategory | undefined {
  return SERVICES.find((s) => s.id === id);
}
