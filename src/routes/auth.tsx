import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/portfolio/Logo";

const title = "Owner Login — Shakik Zaman";
const description = "Private sign-in for the owner of Shakik Zaman's portfolio.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created", { description: "You can sign in now." });
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </Link>
        <form onSubmit={submit} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="eyebrow">
                <span className="eyebrow-bar" />
                Private
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold">Owner access</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This area is for the site owner only. Visitors can view and download the CV from the
            portfolio page.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
          >
            <Lock size={16} /> {mode === "signin" ? "Sign in" : "Create owner account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-accent"
          >
            {mode === "signin"
              ? "First time? Create the owner account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
      <Toaster />
    </main>
  );
}
