export type ProviderRequestStatus = "Pending" | "Approved" | "Rejected";

export interface ProviderRequest {
  id: string;
  initials: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  category: string;
  categoryIcon: string;
  subSpeciality: string;
  district: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  applied: string;
  appliedAt: string;
  status: ProviderRequestStatus;
  score: number;
  scoreLabel: string;
  documents: Array<{ icon: string; name: string }>;
  adminNotes: string;
  checks: Array<{ label: string; value: string; ok: boolean }>;
  similar: Array<{ i: string; name: string; meta: string; rating: string }>;
}

export const PROVIDER_REQUESTS: ProviderRequest[] = [
  {
    id: "1", initials: "KP", name: "Kamal Perera", fullName: "Kamal Roshan Perera",
    email: "kamal.p@gmail.com", phone: "+94 77 345 6789", nic: "199012345678",
    category: "Plumbing", categoryIcon: "🔧", subSpeciality: "Faucets, Pipes, Drainage",
    district: "Colombo", experience: "7 Years", hourlyRate: "Rs. 2,800 / hr",
    availability: "Mon–Sat, 8 AM – 6 PM", applied: "2h ago", appliedAt: "28 May 2026, 10:14 AM",
    status: "Pending", score: 87, scoreLabel: "Strong Application",
    documents: [
      { icon: "📄", name: "NIC_Front.pdf" }, { icon: "📄", name: "NIC_Back.pdf" },
      { icon: "📄", name: "Certificate.pdf" }, { icon: "🖼️", name: "Photo.jpg" },
    ],
    adminNotes: "All documents verified. NIC matches. Certificate from NAITA. Recommended for approval.",
    checks: [
      { label: "Documents Complete", value: "✓ 4/4", ok: true },
      { label: "NIC Verified", value: "✓ Passed", ok: true },
      { label: "Certification", value: "✓ NAITA", ok: true },
      { label: "Experience", value: "✓ 7 Years", ok: true },
      { label: "Police Clearance", value: "⚠ Pending", ok: false },
    ],
    similar: [
      { i: "MS", name: "Marcus Sterling", meta: "Plumbing · Colombo ·", rating: "4.9" },
      { i: "AK", name: "Ashan Kumara", meta: "Plumbing · Colombo ·", rating: "4.7" },
    ],
  },
  {
    id: "2", initials: "SR", name: "Saman Ranasinghe", fullName: "Saman Ranasinghe",
    email: "saman.r@gmail.com", phone: "+94 71 222 3344", nic: "198512345678",
    category: "Electrical", categoryIcon: "⚡", subSpeciality: "Wiring, Panels",
    district: "Kandy", experience: "5 Years", hourlyRate: "Rs. 2,500 / hr",
    availability: "Mon–Fri, 9 AM – 5 PM", applied: "5h ago", appliedAt: "28 May 2026, 07:00 AM",
    status: "Pending", score: 82, scoreLabel: "Good Application",
    documents: [{ icon: "📄", name: "NIC.pdf" }, { icon: "📄", name: "Cert.pdf" }],
    adminNotes: "Documents in order.",
    checks: [
      { label: "Documents Complete", value: "✓ 3/4", ok: true },
      { label: "NIC Verified", value: "✓ Passed", ok: true },
      { label: "Certification", value: "✓ NAITA", ok: true },
      { label: "Experience", value: "✓ 5 Years", ok: true },
      { label: "Police Clearance", value: "⚠ Pending", ok: false },
    ],
    similar: [{ i: "ER", name: "Elena Rodriguez", meta: "Electrical · Colombo ·", rating: "4.8" }],
  },
  {
    id: "3", initials: "NF", name: "Nisha Fernando", fullName: "Nisha Fernando",
    email: "nisha.f@yahoo.com", phone: "+94 76 555 9988", nic: "199512345678",
    category: "HVAC", categoryIcon: "❄️", subSpeciality: "AC Installation",
    district: "Gampaha", experience: "4 Years", hourlyRate: "Rs. 3,000 / hr",
    availability: "Daily, 8 AM – 8 PM", applied: "1d ago", appliedAt: "27 May 2026",
    status: "Pending", score: 78, scoreLabel: "Average Application",
    documents: [{ icon: "📄", name: "NIC.pdf" }],
    adminNotes: "Needs additional certification proof.",
    checks: [
      { label: "Documents Complete", value: "⚠ 2/4", ok: false },
      { label: "NIC Verified", value: "✓ Passed", ok: true },
      { label: "Certification", value: "⚠ Pending", ok: false },
      { label: "Experience", value: "✓ 4 Years", ok: true },
      { label: "Police Clearance", value: "⚠ Pending", ok: false },
    ],
    similar: [{ i: "JW", name: "James Wilson", meta: "HVAC · Gampaha ·", rating: "4.6" }],
  },
  {
    id: "4", initials: "TB", name: "Thilanka Bandara", fullName: "Thilanka Bandara",
    email: "thilanka.b@gmail.com", phone: "+94 70 999 8877", nic: "198812345678",
    category: "Painting", categoryIcon: "🎨", subSpeciality: "Interior/Exterior",
    district: "Matara", experience: "6 Years", hourlyRate: "Rs. 2,200 / hr",
    availability: "Mon–Sat", applied: "2d ago", appliedAt: "26 May 2026",
    status: "Pending", score: 80, scoreLabel: "Good Application",
    documents: [{ icon: "📄", name: "NIC.pdf" }, { icon: "📄", name: "Cert.pdf" }],
    adminNotes: "Strong portfolio.",
    checks: [
      { label: "Documents Complete", value: "✓ 4/4", ok: true },
      { label: "NIC Verified", value: "✓ Passed", ok: true },
      { label: "Certification", value: "✓ NAITA", ok: true },
      { label: "Experience", value: "✓ 6 Years", ok: true },
      { label: "Police Clearance", value: "✓ Clear", ok: true },
    ],
    similar: [{ i: "RP", name: "Rajan Perera", meta: "Painting · Kandy ·", rating: "4.9" }],
  },
  {
    id: "5", initials: "MS", name: "Marcus Sterling", fullName: "Marcus Sterling",
    email: "marcus.s@gmail.com", phone: "+94 77 111 2222", nic: "198012345678",
    category: "Plumbing", categoryIcon: "🔧", subSpeciality: "Pipes",
    district: "Colombo", experience: "10 Years", hourlyRate: "Rs. 3,500 / hr",
    availability: "Daily", applied: "7d ago", appliedAt: "21 May 2026",
    status: "Approved", score: 95, scoreLabel: "Excellent Application",
    documents: [{ icon: "📄", name: "NIC.pdf" }],
    adminNotes: "Approved.",
    checks: [
      { label: "Documents Complete", value: "✓ 4/4", ok: true },
      { label: "NIC Verified", value: "✓ Passed", ok: true },
      { label: "Certification", value: "✓ NAITA", ok: true },
      { label: "Experience", value: "✓ 10 Years", ok: true },
      { label: "Police Clearance", value: "✓ Clear", ok: true },
    ], similar: [],
  },
  {
    id: "6", initials: "HL", name: "Hasitha Liyanage", fullName: "Hasitha Liyanage",
    email: "hasitha.l@gmail.com", phone: "+94 71 444 5555", nic: "199212345678",
    category: "Construction", categoryIcon: "🏗️", subSpeciality: "Masonry",
    district: "Kurunegala", experience: "2 Years", hourlyRate: "Rs. 2,000 / hr",
    availability: "Mon–Fri", applied: "10d ago", appliedAt: "18 May 2026",
    status: "Rejected", score: 45, scoreLabel: "Weak Application",
    documents: [], adminNotes: "Insufficient documentation.",
    checks: [
      { label: "Documents Complete", value: "✗ 1/4", ok: false },
      { label: "NIC Verified", value: "✗ Failed", ok: false },
      { label: "Certification", value: "✗ None", ok: false },
      { label: "Experience", value: "⚠ 2 Years", ok: false },
      { label: "Police Clearance", value: "⚠ Pending", ok: false },
    ], similar: [],
  },
];

export function findProviderRequest(id: string) {
  return PROVIDER_REQUESTS.find((p) => p.id === id);
}
