import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Download, FileText, LogOut, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { useAdmin } from "@/hooks/useAdmin";
import { createCvUploadUrl, finalizeCv, getPublicCv, removeCv } from "@/lib/site.functions";
import { fetchAchievements, type Achievement } from "@/components/portfolio/Achievements";
import { formatSize } from "@/components/portfolio/CV";

const title = "Admin Panel — Shakik Zaman";
const description = "Private admin panel to manage CV and achievements.";

export const Route = createFileRoute("/admin")({
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
  component: AdminPage,
});

const MAX_BYTES = 8 * 1024 * 1024;
const EMPTY = { title: "", description: "", issuer: "", date_label: "", link: "" };
const field =
  "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-accent";

type PublicCv = { name: string; size: number; updatedAt: string; url: string };

function AdminPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading, signOut } = useAdmin();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</main>;
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <h1 className="font-display text-xl font-bold">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is not the site owner. Only the owner can manage the CV and achievements.
          </p>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/auth" }))}
            className="mt-6 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-accent"
          >
            Sign out
          </button>
        </div>
        <Toaster />
      </main>
    );
  }

  return <AdminDashboard email={session.user.email ?? ""} onSignOut={() => signOut().then(() => navigate({ to: "/auth" }))} />;
}

function AdminDashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [cv, setCv] = useState<PublicCv | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPublicCv().then((res) => setCv(res as PublicCv | null));
    fetchAchievements().then(setItems);
  }, []);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowedExtension = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowedTypes.includes(file.type) && !allowedExtension) {
      toast.error("Unsupported file", { description: "Choose a PDF, DOC, or DOCX file." });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File too large", { description: "Please upload a file under 8 MB." });
      e.target.value = "";
      return;
    }
    setBusy(true);
    setUploadError("");
    try {
      setUploadStatus("Checking your session…");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Your session expired. Please sign in once more, then upload.");
      }

      setUploadStatus("Preparing secure upload…");
      const { path, token } = await createCvUploadUrl({ data: { name: file.name } });
      setUploadStatus("Uploading CV…");
      const { error } = await supabase.storage.from("cv").uploadToSignedUrl(path, token, file, {
        contentType: file.type || "application/pdf",
      });
      if (error) throw new Error(error.message);
      setUploadStatus("Publishing CV…");
      const next = await finalizeCv({
        data: {
          path,
          name: file.name,
          type: file.type || "application/pdf",
          size: file.size,
        },
      });
      setCv(next as PublicCv);
      setUploadStatus("");
      toast.success("CV published", { description: "Visitors can now view and download it." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
      setUploadStatus("");
      toast.error("CV upload failed", { description: message });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };


  const onRemoveCv = async () => {
    setBusy(true);
    try {
      await removeCv();
      setCv(null);
      toast.success("CV removed");
    } catch {
      toast.error("Could not remove the CV");
    } finally {
      setBusy(false);
    }
  };

  const addAchievement = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("achievements").insert({
      ...form,
      sort_order: items.length,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save", { description: error.message });
      return;
    }
    setForm(EMPTY);
    setItems(await fetchAchievements());
    toast.success("Achievement added");
  };

  const deleteAchievement = async (id: string) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete", { description: error.message });
      return;
    }
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.success("Achievement removed");
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-bar" />
            Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold">Control panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-accent"
          >
            <ArrowLeft size={15} /> Portfolio
          </Link>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-destructive"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <section className="glass mt-10 rounded-2xl p-7">
        <h2 className="font-display text-xl font-bold">CV</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only you can upload. Everyone else can view and download.
        </p>
        {uploadStatus ? (
          <p className="mt-4 text-sm font-medium text-accent" role="status">{uploadStatus}</p>
        ) : null}
        {uploadError ? (
          <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {uploadError}
          </p>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          onChange={onFile}
          className="hidden"
          aria-label="Upload CV file"
        />
        {cv ? (
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-aurora)" }}
            >
              <FileText size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold">{cv.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatSize(cv.size)} · updated {new Date(cv.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${cv.url}&download=${encodeURIComponent(cv.name)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-accent"
              >
                <Download size={16} /> Download
              </a>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                style={{ background: "var(--gradient-signal)" }}
              >
                <Upload size={16} /> Replace
              </button>
              <button
                onClick={onRemoveCv}
                disabled={busy}
                aria-label="Remove CV"
                className="rounded-lg border border-border px-3 py-2.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="mt-6 flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center hover:border-accent/60"
          >
            <Upload className="text-muted-foreground" size={26} />
            <span className="font-display font-bold">{busy ? "Uploading…" : "Upload your CV"}</span>
            <span className="text-sm text-muted-foreground">PDF or Word file, up to 8 MB</span>
          </button>
        )}
      </section>

      <section className="glass mt-8 rounded-2xl p-7">
        <h2 className="font-display text-xl font-bold">Achievements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add milestones anytime — they show up on the portfolio instantly.
        </p>

        <form onSubmit={addAchievement} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            Title
            <input
              required
              className={field}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Issuer / Organisation
            <input
              className={field}
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Date
            <input
              className={field}
              placeholder="e.g. March 2026"
              value={form.date_label}
              onChange={(e) => setForm({ ...form, date_label: e.target.value })}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            Description
            <textarea
              rows={3}
              className={field}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            Link (optional)
            <input
              type="url"
              className={field}
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
            >
              <Plus size={16} /> {saving ? "Saving…" : "Add achievement"}
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No achievements yet.</p>
          ) : (
            items.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex min-w-0 gap-3">
                  <Award size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="font-display font-bold">{a.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {[a.issuer, a.date_label].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAchievement(a.id)}
                  aria-label={`Delete ${a.title}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      <Toaster />
    </main>
  );
}
