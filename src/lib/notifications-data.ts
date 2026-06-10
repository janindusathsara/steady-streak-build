import { supabase } from "@/integrations/supabase/client";
import { api, useNewApi } from "./api-client";

export type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  booking_id: string | null;
  read_at: string | null;
  created_at: string;
};

const COLS = "id,type,title,body,booking_id,read_at,created_at";

export async function listNotifications(userId: string): Promise<Notif[]> {
  if (useNewApi()) return api.get<Notif[]>("/api/v1/notifications");
  const { data, error } = await supabase
    .from("notifications")
    .select(COLS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Notif[]) ?? [];
}

export async function markAllNotificationsRead(userId: string) {
  if (useNewApi()) {
    await api.post("/api/v1/notifications/mark-read", {});
    return;
  }
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
  if (error) throw error;
}

export async function markNotificationRead(id: string) {
  if (useNewApi()) {
    await api.post("/api/v1/notifications/mark-read", { ids: [id] });
    return;
  }
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Subscribe to realtime notification changes. Returns an unsubscribe fn. */
export function subscribeNotifications(userId: string, onChange: () => void): () => void {
  if (useNewApi()) {
    // SSE stream from the backend; falls back silently if unavailable.
    try {
      const url = `${(import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL_PROD : import.meta.env.VITE_API_BASE_URL_DEV) ?? ""}/api/v1/notifications/stream`;
      const es = new EventSource(url, { withCredentials: false });
      es.onmessage = () => onChange();
      es.onerror = () => { /* keep alive; browser auto-reconnects */ };
      return () => es.close();
    } catch {
      return () => {};
    }
  }
  const channel = supabase
    .channel(`notif-${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      () => onChange(),
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
