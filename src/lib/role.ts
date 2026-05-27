export type Role = "homeowner" | "provider" | "admin";

const KEY = "fixitnow:role";

export function setRole(role: Role) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, role);
}

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEY) as Role | null) ?? null;
}

export function clearRole() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

/** Legacy role-based dashboard path. Kept for backward compatibility. */
export function dashboardPathFor(role: Role): string {
  return `/dashboard/${role}`;
}

/** New username-scoped dashboard path. */
export function userDashboardPath(username: string): string {
  return `/${username}/dashboard`;
}

/** New username-scoped profile path. */
export function userProfilePath(username: string): string {
  return `/${username}/profile`;
}
