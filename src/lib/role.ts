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

export function dashboardPathFor(role: Role): string {
  return `/dashboard/${role}`;
}
