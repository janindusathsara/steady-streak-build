import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ShieldCheck, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { setRole, dashboardPathFor } from "@/lib/role";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setRole("admin");
      navigate({ to: dashboardPathFor("admin") });
    } catch (err: any) {
      toast.error(err.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foreground px-5 py-10 text-background">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-background">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mx-auto mt-12 max-w-md">
        <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-8 backdrop-blur">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">FixItNow Admin</span>
          </div>
          <h1 className="mt-5 text-center text-xl font-bold">Restricted Access</h1>
          <p className="mt-1 text-center text-sm text-background/60">Authorized personnel only.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-semibold">Admin Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@fixitnow.com"
                  className="w-full rounded-lg border border-background/20 bg-background/[0.06] pl-10 pr-3 py-2.5 text-sm text-background placeholder:text-background/40 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-background/20 bg-background/[0.06] pl-10 pr-3 py-2.5 text-sm text-background outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Please wait…" : "Sign In as Admin"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-background/50">🔒 All access attempts are logged and monitored.</p>
      </div>
    </div>
  );
}
