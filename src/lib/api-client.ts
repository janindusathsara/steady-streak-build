// Thin HTTP client for the external backend (JWT bearer, localStorage).
// Feature-flagged via VITE_USE_NEW_API so Supabase keeps working until each
// endpoint is migrated and verified.

const ACCESS_KEY = "fixitnow:access_token";
const REFRESH_KEY = "fixitnow:refresh_token";

function isProd(): boolean {
  if (typeof window === "undefined") return false;
  return import.meta.env.PROD === true;
}

export function apiBaseUrl(): string {
  const dev = import.meta.env.VITE_API_BASE_URL_DEV as string | undefined;
  const prod = import.meta.env.VITE_API_BASE_URL_PROD as string | undefined;
  const url = (isProd() ? prod : dev) ?? dev ?? prod ?? "";
  return url.replace(/\/+$/, "");
}

export function useNewApi(): boolean {
  return String(import.meta.env.VITE_USE_NEW_API ?? "").toLowerCase() === "true";
}

export const tokens = {
  get access(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string | null, refresh: string | null) {
    if (typeof window === "undefined") return;
    if (access) localStorage.setItem(ACCESS_KEY, access);
    else localStorage.removeItem(ACCESS_KEY);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    else localStorage.removeItem(REFRESH_KEY);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = RequestInit & { auth?: boolean; json?: unknown };

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refresh = tokens.refresh;
  if (!refresh) return false;
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const res = await fetch(`${apiBaseUrl()}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { access_token?: string; refresh_token?: string };
      if (!data.access_token) return false;
      tokens.set(data.access_token, data.refresh_token ?? refresh);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export async function apiFetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${apiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(opts.headers ?? {});
  if (opts.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (opts.auth !== false && tokens.access) {
    headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  const init: RequestInit = {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  };

  let res = await fetch(url, init);

  if (res.status === 401 && opts.auth !== false && tokens.refresh) {
    const ok = await tryRefresh();
    if (ok) {
      headers.set("Authorization", `Bearer ${tokens.access}`);
      res = await fetch(url, { ...init, headers });
    } else {
      tokens.clear();
    }
  }

  if (!res.ok) {
    let message = res.statusText;
    let code: string | undefined;
    try {
      const body = await res.json();
      message = body?.error?.message ?? body?.message ?? message;
      code = body?.error?.code;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: RequestOptions) => apiFetch<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, json?: unknown, opts?: RequestOptions) =>
    apiFetch<T>(path, { ...opts, method: "POST", json }),
  patch: <T = unknown>(path: string, json?: unknown, opts?: RequestOptions) =>
    apiFetch<T>(path, { ...opts, method: "PATCH", json }),
  put: <T = unknown>(path: string, json?: unknown, opts?: RequestOptions) =>
    apiFetch<T>(path, { ...opts, method: "PUT", json }),
  delete: <T = unknown>(path: string, opts?: RequestOptions) => apiFetch<T>(path, { ...opts, method: "DELETE" }),
};
