import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  pros_count: number;
};
export type SubService = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  base_price: number;
};
export type Provider = {
  id: string;
  headline: string;
  category_id: string | null;
  rating: number;
  jobs_done: number;
  years_experience: number;
  hourly_rate: number;
  city: string | null;
  distance_km: number | null;
  verified: boolean;
  top_rated: boolean;
  available: boolean;
  bio: string | null;
  profile?: { id: string; display_name: string | null; username: string; avatar_url: string | null } | null;
};
export type Booking = {
  id: string;
  ref_code: string;
  homeowner_id: string;
  provider_id: string;
  service_name: string;
  job_type: "on_the_spot" | "scheduled";
  scheduled_date: string | null;
  scheduled_time: string | null;
  address_line: string;
  district: string | null;
  postal_code: string | null;
  landmarks: string | null;
  problem_desc: string | null;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  hourly_rate: number;
  est_hours: number;
  platform_fee: number;
  total_amount: number;
  created_at: string;
};

export async function loadCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as Category[];
}

export async function loadSubServices(categoryId: string): Promise<SubService[]> {
  const { data, error } = await supabase
    .from("sub_services")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order");
  if (error) throw error;
  return data as SubService[];
}

export async function loadProvidersForCategory(categoryId: string): Promise<Provider[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*, profile:profiles(id, display_name, username, avatar_url)")
    .eq("category_id", categoryId)
    .eq("available", true)
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Provider[];
}

export async function loadAllProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*, profile:profiles(id, display_name, username, avatar_url)")
    .eq("available", true)
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Provider[];
}

export async function getSubService(id: string): Promise<SubService | null> {
  const { data } = await supabase.from("sub_services").select("*").eq("id", id).maybeSingle();
  return (data as SubService | null) ?? null;
}

export type CreateBookingInput = {
  homeowner_id: string;
  provider_id: string;
  sub_service_id: string | null;
  service_name: string;
  job_type: "on_the_spot" | "scheduled";
  scheduled_date: string | null;
  scheduled_time: string | null;
  address_line: string;
  district: string;
  postal_code: string;
  landmarks: string;
  problem_desc: string;
  hourly_rate: number;
  est_hours: number;
  platform_fee: number;
  total_amount: number;
};

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Booking;
}

export async function loadProviderBookings(providerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Booking[];
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function loadUnreadNotifications(userId: string) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function markNotificationsRead(userId: string) {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}
