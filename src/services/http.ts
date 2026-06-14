// Axios instance for the external backend.
// Shares token storage with src/lib/api-client.ts so login/refresh stays unified.
import axios, { AxiosError, AxiosInstance } from "axios";
import { apiBaseUrl, tokens } from "@/lib/api-client";

export const http: AxiosInstance = axios.create({
  baseURL: apiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const t = tokens.access;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  if (refreshing) return refreshing;
  const refresh = tokens.refresh;
  if (!refresh) return null;
  refreshing = (async () => {
    try {
      const res = await axios.post(`${apiBaseUrl()}/api/v1/auth/refresh`, {
        refresh_token: refresh,
      });
      const access = res.data?.access_token as string | undefined;
      if (!access) return null;
      tokens.set(access, res.data?.refresh_token ?? refresh);
      return access;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const access = await refreshAccess();
      if (access) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${access}`;
        return http.request(original);
      }
      tokens.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default http;
