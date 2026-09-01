import { useCallback, useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { ExternalLink, Github, Plus, Trash2, FolderOpen, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Reveal, SectionHeading } from "@/components/Reveal";

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  github: string;
  demo: string;
  image_path: string;
  imageUrl?: string | undefined;
};

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("id, title, description, tech, github, demo, image_path, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Project[];
  const paths = rows.map((r) => r.image_path).filter(Boolean);
  if (paths.length === 0) return rows;

  const { data: signed } = await supabase.storage
    .from("project-images")
    .createSignedUrls(paths, 60 * 60 * 24);

  const map = new Map<string, string>();
  (signed ?? []).forEach((s) => {
    if (s.path && s.signedUrl) map.set(s.path, s.signedUrl);
  });
  return rows.map((r) => ({ ...r, imageUrl: map.get(r.image_path) }));
}

export async function countProjects(): Promise<number> {
  const { count } = await supabase.from("projects").select("id", { count: "exact", head: true });
  return count ?? 0;
}

function ProjectCard({
  p,
  canEdit,
  onDelete,
}: {
  p: Project;
  canEdit: boolean;
  onDelete: (p: Project) => void;
}) {
  const [tilt, setTilt] = useState("");

  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`);
  };

  return (
    <article
      onMouseMove={move}
      onMouseLeave={() => setTilt("")}
      style={{ transform: tilt, transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      className="glass h-full overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={`${p.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center"
            style={{ background: "var(--gradient-aurora)", opacity: 0.22 }}
          >
            <FolderOpen className="text-foreground/70" size={26} />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold">{p.title}</h3>
          {canEdit ? (
            <button
              onClick={() => onDelete(p)}
              aria-label={`Delete ${p.title}`}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
          ) : null}
        </div>
        {p.description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        ) : null}
        {p.tech ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tech
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-accent"
                >
                  {t}
                </span>
              ))}
          </div>
        ) : null}
        <div className="mt-5 flex gap-4 text-sm">
          {p.github ? (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent"
            >
              <Github size={15} /> Code
            </a>
          ) : null}
          {p.demo ? (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent"
            >
              <ExternalLink size={15} /> Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const EMPTY = { title: "", description: "", tech: "", github: "", demo: "" };

export function Projects() {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const rows = await fetchProjects();
    setProjects(rows);
    setLoading(false);
    window.dispatchEvent(new CustomEvent("sz-projects-changed", { detail: rows.length }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pickFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const reset = () => {
    setForm(EMPTY);
    pickFile(null);
    setOpen(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || saving) return;
    setSaving(true);
    try {
      let imagePath = "";
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `project-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("project-images")
          .upload(path, file, { contentType: file.type, upsert: true });
        if (upErr) throw new Error(upErr.message);
        imagePath = path;
      }

      const { error } = await supabase.from("projects").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        tech: form.tech.trim(),
        github: form.github.trim(),
        demo: form.demo.trim(),
        image_path: imagePath,
      });
      if (error) throw new Error(error.message);

      toast.success("Project published");
      reset();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the project");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Project) => {
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (p.image_path) await supabase.storage.from("project-images").remove([p.image_path]);
    toast.success("Project removed");
    await load();
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          subtitle="Live work with a preview picture, source code and a live link."
        />
        {isAdmin ? (
          <Reveal>
            <button
              onClick={() => setOpen(true)}
              className="mb-12 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
            >
              <Plus size={16} /> Add Project
            </button>
          </Reveal>
        ) : null}
      </div>

      {loading ? (
        <div className="glass rounded-2xl px-6 py-14 text-center text-sm text-muted-foreground">
          Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <Reveal>
          <div className="glass rounded-2xl px-6 py-16 text-center">
            <FolderOpen className="mx-auto text-muted-foreground" size={28} />
            <p className="mt-4 font-display font-bold">No projects published yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New work will show up here with a preview picture and links.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProjectCard p={p} canEdit={isAdmin} onDelete={remove} />
            </Reveal>
          ))}
        </div>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={reset}
          role="presentation"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="glass my-8 w-full max-w-lg rounded-2xl p-7"
            aria-label="Add project"
          >
            <h3 className="font-display text-xl font-bold">Add Project</h3>
            <div className="mt-5 space-y-4">
              <div className="text-sm">
                Project picture
                <label className="mt-1.5 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-input p-3 hover:border-accent">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Selected preview"
                      className="h-16 w-24 rounded-md object-cover"
                    />
                  ) : (
                    <span className="grid h-16 w-24 place-items-center rounded-md bg-muted/40 text-muted-foreground">
                      <ImagePlus size={18} />
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {file ? file.name : "Choose an image (shown at the top of the card)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <label className="block text-sm">
                Title
                <input
                  required
                  className={field}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Description
                <textarea
                  rows={3}
                  className={field}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Tech stack (comma separated)
                <input
                  className={field}
                  value={form.tech}
                  onChange={(e) => setForm({ ...form, tech: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                GitHub link
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  className={field}
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Live link
                <input
                  type="url"
                  placeholder="https://..."
                  className={field}
                  value={form.demo}
                  onChange={(e) => setForm({ ...form, demo: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                style={{ background: "var(--gradient-signal)" }}
              >
                {saving ? <Loader2 className="animate-spin" size={15} /> : null}
                {saving ? "Publishing…" : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
