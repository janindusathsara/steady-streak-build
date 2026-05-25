import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/services/$serviceId")({
  component: () => <Outlet />,
});
