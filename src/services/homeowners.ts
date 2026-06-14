import { http } from "./http";

export interface Homeowner {
  id: string;
  initials: string;
  name: string;
  email: string;
  location: string;
  bookings: number;
  spent: string;
  member_since: string;
  status: "Active" | "New" | "Flagged";
}

export interface HomeownerStats {
  total: number;
  active: number;
  joined_this_week: number;
  flagged: number;
}

export const homeownersService = {
  list: () => http.get<Homeowner[]>("/homeowners").then((r) => r.data),
  stats: () => http.get<HomeownerStats>("/homeowners/stats").then((r) => r.data),
  suspend: (id: string) => http.post(`/homeowners/${id}/suspend`).then((r) => r.data),
};
