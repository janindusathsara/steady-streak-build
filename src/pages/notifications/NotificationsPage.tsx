import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Check, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { HomeownerLayout } from "@/components/homeowner/HomeownerLayout";
import { toast } from "sonner";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  booking_id: string | null;
  read_at: string | null;
  created_at: string;
};

function useNotifications(userId: string | undefined) {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id,type,title,body,booking_id,read_at,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) toast.error(error.message);
      setItems((data as Notif[]) ?? []);
      setLoading(false);
    })();

    const channel = supabase
      .channel(`notif-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => {
          supabase
            .from("notifications")
            .select("id,type,title,body,booking_id,read_at,created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .then(({ data }) => setItems((data as Notif[]) ?? []));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllRead = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })));
    toast.success("All marked as read");
  };

  const markOneRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  return { items, loading, markAllRead, markOneRead };
}

export function NotificationsPage() {
  const { profile, loading: userLoading } = useCurrentUser();
  const role = profile?.role;

  if (userLoading || !profile) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (role === "admin") return <AdminNotifications userId={profile.id} />;
  if (role === "provider") return <ProviderNotifications userId={profile.id} username={profile.username} />;
  return <HomeownerNotifications userId={profile.id} username={profile.username} />;
}

/* ============ Admin (dark theme) ============ */
function AdminNotifications({ userId }: { userId: string }) {
  const { items, loading, markAllRead, markOneRead } = useNotifications(userId);
  const unread = items.filter((n) => !n.read_at).length;
  return (
    <AdminLayout active="dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-background">Notifications</h1>
          <p className="text-sm text-background/60">
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Mark all read
        </button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-background/60">Loading…</p>
        ) : items.length === 0 ? (
          <EmptyState dark />
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.read_at && markOneRead(n.id)}
              className={`flex w-full items-start gap-3 rounded-2xl border border-background/10 p-4 text-left transition-colors ${
                n.read_at ? "bg-background/[0.03]" : "bg-background/10 hover:bg-background/15"
              }`}
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-background">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-background/70">{n.body}</p>}
                <p className="mt-1 text-[11px] text-background/40">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
              {!n.read_at && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </button>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

/* ============ Provider (gold accent, light) ============ */
function ProviderNotifications({ userId, username }: { userId: string; username: string }) {
  const { items, loading, markAllRead, markOneRead } = useNotifications(userId);
  const unread = items.filter((n) => !n.read_at).length;
  return (
    <ProviderLayout active="dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread updates` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Mark all read
        </button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                n.read_at ? "border-border bg-card" : "border-amber-300/60 bg-amber-50/70"
              }`}
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                <div className="mt-1 flex items-center gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                  {n.booking_id && (
                    <Link
                      to="/$username/jobs-bookings"
                      params={{ username }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      View job →
                    </Link>
                  )}
                </div>
              </div>
              {!n.read_at && (
                <button
                  onClick={() => markOneRead(n.id)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Mark read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </ProviderLayout>
  );
}

/* ============ Homeowner (clean light) ============ */
function HomeownerNotifications({ userId, username: _username }: { userId: string; username: string }) {
  const { items, loading, markAllRead, markOneRead } = useNotifications(userId);
  const unread = items.filter((n) => !n.read_at).length;
  return (
    <HomeownerLayout active="dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread updates` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Mark all read
        </button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                n.read_at ? "border-border bg-card" : "border-primary/40 bg-primary/5"
              }`}
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                <div className="mt-1 flex items-center gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                  {n.booking_id && (
                    <Link
                      to="/$username/active-bookings"
                      params={{ username: _username }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      View booking →
                    </Link>
                  )}
                </div>
              </div>
              {!n.read_at && (
                <button
                  onClick={() => markOneRead(n.id)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Mark read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </HomeownerLayout>
  );
}

function EmptyState({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center ${
        dark ? "border-background/15 text-background/60" : "border-border text-muted-foreground"
      }`}
    >
      <Inbox className="mb-3 h-10 w-10 opacity-50" />
      <p className="text-sm font-semibold">No notifications yet</p>
      <p className="mt-1 text-xs">We'll let you know when something happens.</p>
    </div>
  );
}
