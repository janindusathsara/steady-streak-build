// Homeowner booking services — UI-shaped DTOs for active/past bookings.
import { http } from "./http";

export interface ActiveBookingDTO {
  id: string;
  ref: string;
  icon: string;
  iconBg: string;
  title: string;
  status: string;
  tone: "ok" | "warn" | "info" | "bad";
  cat: string;
  date: string;
  time: string;
  addr: string;
  provider: string;
  pInit: string;
  phase: string;
  eta: string;
  price: string;
  pay: string;
  actions: string[];
}

export interface PastBookingDTO {
  id: string;
  ref: string;
  icon: string;
  iconBg: string;
  title: string;
  status: string;
  statusTone: "ok" | "warn" | "bad";
  cat: string;
  date: string;
  time: string;
  addr: string;
  svcType?: string;
  provider?: string;
  pInit?: string;
  rating?: string;
  review?: string;
  note?: string;
  price: string;
  pay: string;
  actions: string[];
  highlight?: boolean;
  strike?: boolean;
}

export interface ActiveBookingsStats {
  active_now: number;
  en_route: number;
  in_progress: number;
  in_escrow: string;
}

export interface PastBookingsStats {
  total: number;
  completed: number;
  cancelled: number;
  total_spent: string;
}

export const bookingsService = {
  active: () =>
    http.get<{ stats: ActiveBookingsStats; items: ActiveBookingDTO[] }>("/bookings/active").then((r) => r.data),
  past: () =>
    http.get<{ stats: PastBookingsStats; items: PastBookingDTO[] }>("/bookings/past").then((r) => r.data),
  cancel: (id: string) => http.patch(`/bookings/${id}/status`, { status: "cancelled" }).then((r) => r.data),
  reschedule: (id: string, payload: { date: string; time: string }) =>
    http.patch(`/bookings/${id}/status`, { status: "rescheduled", ...payload }).then((r) => r.data),
  confirmDone: (id: string) => http.patch(`/bookings/${id}/status`, { status: "completed" }).then((r) => r.data),
};
