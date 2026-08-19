import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { ExternalLink, Github, Plus, Trash2, FolderOpen } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  github: string;
  demo: string;
};

const STORAGE_KEY = "sz-projects";

function TiltCard({ p, onDelete }: { p: Project; onDelete: (id: string) => void }) {
  const [tilt, setTilt] = useState("");

  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`);
  };

  return (
    <article
      onMouseMove={move}
      onMouseLeave={() => setTilt("")}
      style={{ transform: tilt, transition: "transform 220ms ease-out" }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{p.title}</h3>
        <button
          onClick={() => onDelete(p.id)}
          aria-label={`Delete ${p.title}`}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 size={16} />
        </button>
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
    </article>
  );
}

const EMPTY = { title: "", description: "", tech: "", github: "", demo: "" };

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProjects(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Project[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("sz-projects-changed"));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    persist([...projects, { id: crypto.randomUUID(), ...form }]);
    setForm(EMPTY);
    setOpen(false);
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          subtitle="Add your work below — entries are saved in this browser."
        />
        <Reveal>
          <button
            onClick={() => setOpen(true)}
            className="mb-12 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
          >
            <Plus size={16} /> Add Project
          </button>
        </Reveal>
      </div>

      {projects.length === 0 ? (
        <Reveal>
          <div className="glass rounded-2xl px-6 py-16 text-center">
            <FolderOpen className="mx-auto text-muted-foreground" size={28} />
            <p className="mt-4 font-display font-bold">No projects added yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use “Add Project” to publish your first entry.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <TiltCard p={p} onDelete={(id) => persist(projects.filter((x) => x.id !== id))} />
            </Reveal>
          ))}
        </div>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="glass w-full max-w-lg rounded-2xl p-7"
            aria-label="Add project"
          >
            <h3 className="font-display text-xl font-bold">Add Project</h3>
            <div className="mt-5 space-y-4">
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
                  className={field}
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Live demo link
                <input
                  type="url"
                  className={field}
                  value={form.demo}
                  onChange={(e) => setForm({ ...form, demo: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-signal)" }}
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
