import { http } from "./http";

export interface SecurityCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  desc: string;
}
export interface SecurityIncident {
  id: string;
  title: string;
  ip: string;
  when: string;
  severity: "low" | "med" | "high";
}
export interface SecurityOverview {
  score: number;
  warnings: number;
  critical: number;
  active_sessions: number;
  checks: SecurityCheck[];
  incidents: SecurityIncident[];
  last_scan: string;
}

export const securityService = {
  overview: () => http.get<SecurityOverview>("/security/events").then((r) => r.data),
  runScan: () => http.post<SecurityOverview>("/security/scan").then((r) => r.data),
};
