import { http } from "./http";

export interface SystemService {
  name: string;
  status: "Operational" | "Degraded" | "Down";
  uptime: string;
  latency: string;
}
export interface SystemEvent {
  id: string;
  title: string;
  when: string;
  severity: "info" | "warn" | "high";
}
export interface SystemHealth {
  status: "Operational" | "Degraded" | "Down";
  cpu: { value: string; sub: string };
  memory: { value: string; sub: string };
  db: { value: string; sub: string };
  throughput: { value: string; sub: string };
  services: SystemService[];
  events: SystemEvent[];
  jobs: Array<[string, string]>;
}

export const systemService = {
  health: () => http.get<SystemHealth>("/system-health").then((r) => r.data),
};
