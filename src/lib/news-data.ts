export const categories = ["All", "Platform Updates", "Maintenance Tips", "Provider Stories", "Industry News", "Gold Members"] as const;
export type Category = typeof categories[number];

export type Article = {
  id: number;
  category: Category;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  author?: string;
  featured?: boolean;
  gradient: string;
  content: string[];
};

export const articles: Article[] = [
  {
    id: 1, category: "Platform Updates", title: "FixItNow Launches Smart Home AI Integration — Predict Problems Before They Happen",
    excerpt: "Our new AI Predictive Maintenance system analyses your home's history and local climate data to alert you to potential failures weeks before they become costly emergencies. Available today for all Gold members.",
    date: "Nov 12, 2024", read: "5 min read", author: "Platform Team", featured: true, gradient: "from-violet-500 to-indigo-600",
    content: [
      "Today we're rolling out FixItNow AI — a predictive maintenance layer that quietly studies your home's service history, appliance ages, and local climate patterns to flag issues before they become emergencies.",
      "Gold members will start seeing personalised alerts in their dashboard this week. Think gentle nudges like 'your water heater is approaching its 8th year — schedule an inspection before winter' rather than scary red banners.",
      "Under the hood we combine three signals: your booking history on FixItNow, anonymous trends from homes in your district, and seasonal weather forecasts from local providers. No personal data ever leaves your account.",
      "We expect early adopters to avoid roughly 60% of preventable breakdowns in the first year. If you're not a Gold member yet, this is a good week to try the upgrade — the first month is on us.",
    ],
  },
  {
    id: 2, category: "Maintenance Tips", title: "5 Plumbing Checks Every Homeowner Should Do Before Winter",
    excerpt: "A quick walkthrough you can complete in under an hour that will save you from frozen pipes and expensive emergency call-outs.",
    date: "Nov 8, 2024", read: "3 min read", gradient: "from-emerald-600 to-teal-700",
    content: [
      "Winter is the toughest season for residential plumbing. A 30-minute walkthrough now can save you thousands later.",
      "1. Insulate exposed pipes in garages, basements, and exterior walls with foam sleeves. 2. Disconnect garden hoses and shut off outdoor spigots. 3. Test your sump pump by pouring a bucket of water into the pit.",
      "4. Locate and label your main shut-off valve so anyone in the house can stop a leak fast. 5. Flush your water heater to clear sediment and improve efficiency through the cold months.",
      "If any of these feel beyond DIY, book a plumber on FixItNow for a winter-ready inspection — most are completed in under an hour.",
    ],
  },
  {
    id: 3, category: "Provider Stories", title: "How Marcus Grew His Plumbing Business 3× in 6 Months",
    excerpt: "Marcus went from solo jobs to a five-person crew using nothing but consistency, great reviews, and the FixItNow scheduling tools.",
    date: "Nov 5, 2024", read: "4 min read", gradient: "from-blue-500 to-violet-600",
    content: [
      "Six months ago Marcus was a one-man plumbing operation taking calls between jobs. Today he runs a five-person crew with a full calendar two weeks out.",
      "His advice is refreshingly simple: respond within 10 minutes, show up on time, leave the space cleaner than you found it, and ask every happy customer for a review.",
      "He credits the FixItNow scheduling tools for letting him block off travel time automatically, which removed the awkward 'I'm running late' calls that used to lose him repeat business.",
      "If you're a provider thinking about scaling, Marcus's story is a useful blueprint — the basics, executed consistently, still win.",
    ],
  },
  {
    id: 4, category: "Gold Members", title: "Gold Membership Now Includes 2-Year Extended Warranty",
    excerpt: "Every job booked through Gold is now covered for 24 months instead of 12 — at no extra cost.",
    date: "Oct 28, 2024", read: "2 min read", gradient: "from-amber-500 to-orange-600",
    content: [
      "We've doubled the warranty period on every Gold-member booking from 12 to 24 months, effective immediately and applied retroactively to active bookings.",
      "If a covered issue reappears within two years, we'll send a provider back at no charge — no paperwork, no arguments.",
      "This is part of our ongoing push to make Gold the obvious choice for anyone who books home services more than twice a year.",
    ],
  },
  {
    id: 5, category: "Industry News", title: "Why Skilled Trades Are the Fastest-Growing Sector in 2024",
    excerpt: "A look at rising demand, wages, and what it means for homeowners.",
    date: "Oct 22, 2024", read: "6 min read", gradient: "from-red-500 to-rose-700",
    content: [
      "Skilled trades — plumbers, electricians, HVAC techs, carpenters — are now the fastest-growing employment category in the region, outpacing both tech and healthcare.",
      "The driver is demographic: a generation of tradespeople is retiring just as housing stock ages into peak-maintenance years. Apprenticeship enrolment is up 38% year-over-year.",
      "For homeowners, this means rates will keep climbing in the short term. Booking ahead and locking in trusted providers is the best hedge against price shocks.",
      "For anyone considering a career change, the trades have rarely looked more attractive: real wages, real demand, and real autonomy.",
    ],
  },
  {
    id: 6, category: "Maintenance Tips", title: "Your Complete HVAC Seasonal Checklist",
    excerpt: "Prepare your heating and cooling systems before extreme weather hits.",
    date: "Oct 18, 2024", read: "4 min read", gradient: "from-orange-500 to-amber-700",
    content: [
      "Your HVAC system works hardest at the edges of the seasons. A short checklist twice a year keeps it healthy.",
      "Spring: replace filters, clear outdoor condenser coils of debris, test the AC on a mild day before you actually need it.",
      "Fall: replace filters again, clean vents, schedule a furnace tune-up, and check that carbon monoxide detectors have fresh batteries.",
      "All year: change filters every 60–90 days and keep at least two feet of clearance around indoor and outdoor units.",
    ],
  },
  {
    id: 7, category: "Platform Updates", title: "Introducing Real-Time GPS Tracking for All Bookings",
    excerpt: "Know exactly when your provider will arrive with our new live map.",
    date: "Oct 14, 2024", read: "2 min read", gradient: "from-indigo-500 to-violet-700",
    content: [
      "You can now follow your provider's arrival on a live map, with an updated ETA every 60 seconds.",
      "This rolls out automatically to every booking, on both web and mobile. Providers see a one-tap 'On my way' control and can share status without juggling phone calls.",
      "Less waiting around, fewer 'are they here yet?' messages — exactly the kind of small polish that adds up.",
    ],
  },
  {
    id: 8, category: "Provider Stories", title: "From Apprentice to Top Rated: Elena Rodriguez's Journey",
    excerpt: "The HVAC specialist shares how FixItNow transformed her career.",
    date: "Oct 10, 2024", read: "5 min read", gradient: "from-cyan-600 to-blue-700",
    content: [
      "Three years ago Elena finished her HVAC apprenticeship and signed up to FixItNow with zero reviews. Today she's one of the top-rated specialists in her district.",
      "Her edge was honesty: she logged jobs that took longer than estimated and explained why, instead of padding invoices. Customers noticed and repeat bookings followed.",
      "She also leans on the platform's training library — short videos on new refrigerants and inverter systems — to stay ahead of the curve.",
      "Her advice to new providers: pick a niche, document your work, and treat every review like a job interview for the next ten customers.",
    ],
  },
  {
    id: 9, category: "Maintenance Tips", title: "10 Signs Your Electrical Wiring Needs Attention",
    excerpt: "Spot these warning signs early before they become fire hazards.",
    date: "Oct 6, 2024", read: "4 min read", gradient: "from-emerald-700 to-green-900",
    content: [
      "Electrical issues rarely appear out of nowhere — they leave clues. Catching them early is the difference between a cheap fix and a serious incident.",
      "Watch for: flickering lights, warm switch plates, burning smells, frequently tripped breakers, buzzing outlets, discoloured outlets, mild shocks, dimming on appliance start-up, two-prong outlets in older homes, and any visible scorch marks.",
      "If you spot two or more of these, stop using the affected circuit and book a licensed electrician immediately. Most diagnostic visits take under an hour.",
    ],
  },
  {
    id: 10, category: "Gold Members", title: "Priority Dispatch: Gold Members Get Help in 12 Minutes",
    excerpt: "How Gold members skip the queue and get a technician instantly.",
    date: "Oct 2, 2024", read: "3 min read", gradient: "from-pink-600 to-rose-800",
    content: [
      "Gold members now get matched with an available provider in an average of 12 minutes for urgent jobs — down from 38 minutes earlier this year.",
      "We did it by giving Gold requests first pick of nearby providers and by routing low-priority jobs around peak windows.",
      "If you've ever stared at a leaking pipe wondering how long help will take, this is the upgrade for you.",
    ],
  },
];

export function getArticleById(id: number): Article | undefined {
  return articles.find((a) => a.id === id);
}
