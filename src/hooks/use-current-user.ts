import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNewApi } from "@/lib/api-client";
import { authApi } from "@/lib/auth-api";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "homeowner" | "provider" | "admin";
};

export type CurrentUser = {
  loading: boolean;
  email: string | null;
  profile: Profile | null;
};

export function useCurrentUser(): CurrentUser {
  const [state, setState] = useState<CurrentUser>({ loading: true, email: null, profile: null });

  useEffect(() => {
    let cancelled = false;

    if (useNewApi()) {
      const apply = (s: Awaited<ReturnType<typeof authApi.getSession>>) => {
        if (cancelled) return;
        if (!s) {
          setState({ loading: false, email: null, profile: null });
          return;
        }
        setState({
          loading: false,
          email: s.user.email,
          profile: {
            id: s.user.id,
            username: s.user.username ?? "",
            display_name: s.user.display_name,
            avatar_url: s.user.avatar_url,
            role: s.user.role,
          },
        });
      };
      const { data: { subscription } } = authApi.onAuthStateChange((_e, s) => apply(s));
      authApi.getSession().then(apply);
      return () => { cancelled = true; subscription.unsubscribe(); };
    }

    async function loadProfile(userId: string, email: string | null) {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, role")
        .eq("id", userId)
        .maybeSingle();
      if (cancelled) return;
      setState({ loading: false, email, profile: (data as Profile | null) ?? null });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        setState({ loading: false, email: null, profile: null });
      } else {
        void loadProfile(session.user.id, session.user.email ?? null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        setState({ loading: false, email: null, profile: null });
      } else {
        void loadProfile(data.session.user.id, data.session.user.email ?? null);
      }
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  return state;
}
