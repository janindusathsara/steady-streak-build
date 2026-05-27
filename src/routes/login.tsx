import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Wrench, ChevronLeft, User as UserIcon, Shield } from "lucide-react";
import { toast } from "sonner";
import { setRole, dashboardPathFor, userDashboardPath, type Role } from "@/lib/role";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

async function navigateAfterLogin(navigate: ReturnType<typeof useNavigate>, fallbackRole: Role) {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data: sess } = await supabase.auth.getSession();
  if (sess.session) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", sess.session.user.id)
      .maybeSingle();
    if (prof?.username) {
      navigate({ to: userDashboardPath(prof.username) });
      return;
    }
  }
  navigate({ to: dashboardPathFor(fallbackRole) });
}

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<Exclude<Role, "admin">>("homeowner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      setRole(role);
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}${dashboardPathFor(role)}`,
      });
      if (result.error) toast.error("Google sign-in failed");
      else if (!result.redirected) await navigateAfterLogin(navigate, role);
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setRole(role);
      await navigateAfterLogin(navigate, role);
    } catch (err: any) {
      toast.error(err.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-foreground to-primary/40 px-5 py-10 text-background">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-background/80 hover:text-background">
        <ChevronLeft className="h-4 w-4" /> Back to Entry
      </Link>

      <div className="mx-auto mt-10 max-w-md">
        <div className="rounded-2xl bg-background p-7 text-foreground shadow-2xl">
          <div className="flex items-center justify-center gap-2">
            <Wrench className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">FixItNow</span>
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Log in to manage your home services and appointments.</p>

          {/* Role tabs */}
          <div className="mt-5 flex gap-1 rounded-full bg-muted p-1">
            {[
              { v: "homeowner" as const, label: "Homeowner", icon: UserIcon },
              { v: "provider" as const, label: "Service Pro", icon: Shield },
            ].map((r) => {
              const Icon = r.icon;
              const active = role === r.v;
              return (
                <button
                  key={r.v}
                  type="button"
                  onClick={() => setRoleState(r.v)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all ${active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-4 w-4" /> {r.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? "Please wait…" : "Continue with Google"}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or continue with email <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Please wait…" : `Sign In as ${role === "homeowner" ? "Homeowner" : "Service Pro"}`}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>

          <div className="mt-5 flex justify-center gap-4 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>·
            <a href="#" className="hover:text-foreground">Terms of Service</a>·
            <a href="#" className="hover:text-foreground">Help Center</a>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-background/70">🛡 Bank-grade 256-bit SSL encryption</p>
      </div>
    </div>
  );
}
