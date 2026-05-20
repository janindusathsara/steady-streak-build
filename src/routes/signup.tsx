import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/pages/signup/SignupPage";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): { role?: "homeowner" | "provider" } => ({
    role: s.role === "provider" ? "provider" : s.role === "homeowner" ? "homeowner" : undefined,
  }),
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — FixItNow" },
      { name: "description", content: "Create a homeowner or service provider account on FixItNow." },
    ],
  }),
});
