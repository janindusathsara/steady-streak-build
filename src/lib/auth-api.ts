// Thin auth layer over the external backend. Mirrors the subset of
// supabase.auth.* the app uses (signIn/signUp/signOut/getSession/onAuthStateChange)
// so call sites can switch with minimal changes once VITE_USE_NEW_API=true.

import { api, tokens, ApiError } from "./api-client";

export type AuthUser = {
  id: string;
  email: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: "homeowner" | "provider" | "admin";
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

type AuthEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED";
type Listener = (event: AuthEvent, session: AuthSession | null) => void;

const listeners = new Set<Listener>();
let currentSession: AuthSession | null = null;

function emit(event: AuthEvent, session: AuthSession | null) {
  currentSession = session;
  listeners.forEach((l) => {
    try {
      l(event, session);
    } catch {
      /* ignore */
    }
  });
}

export const authApi = {
  async signUp(input: { email: string; password: string; username?: string; role?: "homeowner" | "provider" }) {
    const data = await api.post<AuthSession>("/api/v1/auth/signup", input, { auth: false });
    tokens.set(data.access_token, data.refresh_token);
    emit("SIGNED_IN", data);
    return data;
  },

  async signInWithPassword(input: { email: string; password: string }) {
    const data = await api.post<AuthSession>("/api/v1/auth/login", input, { auth: false });
    tokens.set(data.access_token, data.refresh_token);
    emit("SIGNED_IN", data);
    return data;
  },

  async signOut() {
    try {
      if (tokens.access) await api.post("/api/v1/auth/logout").catch(() => null);
    } finally {
      tokens.clear();
      emit("SIGNED_OUT", null);
    }
  },

  async getSession(): Promise<AuthSession | null> {
    if (!tokens.access) return null;
    if (currentSession) return currentSession;
    try {
      const user = await api.get<AuthUser>("/api/v1/auth/session");
      currentSession = { access_token: tokens.access!, refresh_token: tokens.refresh ?? "", user };
      return currentSession;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        tokens.clear();
        return null;
      }
      throw err;
    }
  },

  async getUser(): Promise<AuthUser | null> {
    const s = await this.getSession();
    return s?.user ?? null;
  },

  async resetPasswordForEmail(email: string) {
    await api.post("/api/v1/auth/password/forgot", { email }, { auth: false });
  },

  async updatePassword(password: string) {
    await api.post("/api/v1/auth/password/reset", { password });
  },

  signInWithOAuthRedirect(provider: "google", redirectTo?: string) {
    const url = new URL(`${import.meta.env.VITE_API_BASE_URL_DEV ?? ""}/api/v1/auth/oauth/${provider}`);
    if (redirectTo) url.searchParams.set("redirect_to", redirectTo);
    window.location.href = url.toString();
  },

  onAuthStateChange(listener: Listener) {
    listeners.add(listener);
    return {
      data: {
        subscription: {
          unsubscribe: () => listeners.delete(listener),
        },
      },
    };
  },
};
