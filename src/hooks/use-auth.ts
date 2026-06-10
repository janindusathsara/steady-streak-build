import { useState, useEffect, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { useNewApi } from "@/lib/api-client";
import { authApi, type AuthSession } from "@/lib/auth-api";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

function toUser(s: AuthSession | null): User | null {
  if (!s) return null;
  return {
    id: s.user.id,
    email: s.user.email ?? undefined,
    user_metadata: {
      username: s.user.username,
      display_name: s.user.display_name,
      avatar_url: s.user.avatar_url,
      role: s.user.role,
    },
    app_metadata: { role: s.user.role },
    aud: "authenticated",
    created_at: "",
  } as unknown as User;
}

function toSession(s: AuthSession | null): Session | null {
  if (!s) return null;
  return {
    access_token: s.access_token,
    refresh_token: s.refresh_token,
    token_type: "bearer",
    expires_in: 3600,
    user: toUser(s) as User,
  } as unknown as Session;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useNewApi()) {
      const { data: { subscription } } = authApi.onAuthStateChange((_e, s) => {
        setSession(toSession(s));
        setUser(toUser(s));
        setIsLoading(false);
      });
      authApi.getSession().then((s) => {
        setSession(toSession(s));
        setUser(toUser(s));
        setIsLoading(false);
      });
      return () => subscription.unsubscribe();
    }

    let unsub: (() => void) | undefined;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        setIsLoading(false);
      });
      unsub = () => subscription.unsubscribe();
      supabase.auth.getSession().then(({ data: { session: sess } }) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        setIsLoading(false);
      });
    });
    return () => { unsub?.(); };
  }, []);

  const signOut = useCallback(async () => {
    if (useNewApi()) {
      await authApi.signOut();
      return;
    }
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
  }, []);

  return { user, session, isLoading, signOut };
}
