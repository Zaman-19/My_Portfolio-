import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/portfolio/Logo";

const title = "Reset Password — Shakik Zaman";
const description = "Set a new password for the owner account of Shakik Zaman's portfolio.";

export const Route = createFileRoute("/reset-password")({
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
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin" });
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
          to="/auth"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>
        <form onSubmit={submit} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="eyebrow">
                <span className="eyebrow-bar" />
                Recovery
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold">New password</h1>
            </div>
          </div>

          {!ready ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Open this page from the reset link in your email, then set a new password here.
            </p>
          ) : null}

          <label className="mt-6 block text-sm">
            New password
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={busy || !ready}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
          >
            <KeyRound size={16} /> Update password
          </button>
        </form>
      </div>
      <Toaster />
    </main>
  );
}
