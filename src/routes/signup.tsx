import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/components/pages/signup/SignupPage";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({
    role: s.role === "provider" ? "provider" : "homeowner",
  }),
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — FixItNow" },
      { name: "description", content: "Create a homeowner or service provider account on FixItNow." },
    ],
  }),
});
