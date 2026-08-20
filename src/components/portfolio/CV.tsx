import { useEffect, useState } from "react";
import { Download, Eye, FileText, Lock } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { getPublicCv } from "@/lib/site.functions";

type PublicCv = {
  name: string;
  size: number;
  type: string;
  updatedAt: string;
  url: string;
};

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CV() {
  const [cv, setCv] = useState<PublicCv | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicCv()
      .then((res) => setCv(res as PublicCv | null))
      .catch(() => setCv(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="cv" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="CV"
        title="Résumé"
        subtitle="View or download my latest CV — uploads are managed by me only."
      />

      <Reveal>
        <div className="glass rounded-2xl p-7">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading CV…</p>
          ) : cv ? (
            <div className="flex flex-wrap items-center gap-5">
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
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "var(--gradient-signal)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <Download size={16} /> Download CV
                </a>
                <a
                  href={cv.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
                >
                  <Eye size={16} /> View
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center">
              <Lock className="text-muted-foreground" size={26} />
              <p className="font-display font-bold">CV not published yet</p>
              <p className="text-sm text-muted-foreground">
                The CV will be available here for viewing and download soon.
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
