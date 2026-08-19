import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/Reveal";

const CV_KEY = "sz-cv";
const MAX_BYTES = 4 * 1024 * 1024;

type StoredCV = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  updatedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CV() {
  const [cv, setCv] = useState<StoredCV | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CV_KEY);
      if (raw) setCv(JSON.parse(raw) as StoredCV);
    } catch {
      /* ignore */
    }
  }, []);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("File too large", { description: "Please upload a file under 4 MB." });
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const next: StoredCV = {
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: String(reader.result),
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(CV_KEY, JSON.stringify(next));
        setCv(next);
        toast.success("CV uploaded", { description: "Visitors can now download it." });
      } catch {
        toast.error("Could not save CV", { description: "Try a smaller file." });
      }
      setBusy(false);
    };
    reader.onerror = () => {
      toast.error("Upload failed");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const remove = () => {
    localStorage.removeItem(CV_KEY);
    setCv(null);
    toast.success("CV removed");
  };

  return (
    <section id="cv" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="CV"
        title="Résumé"
        subtitle="Upload your CV once — anyone visiting can download it from here."
      />

      <Reveal>
        <div className="glass rounded-2xl p-7">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            onChange={onFile}
            className="hidden"
            aria-label="Upload CV file"
          />

          {cv ? (
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
                  {formatSize(cv.size)} · updated{" "}
                  {new Date(cv.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={cv.dataUrl}
                  download={cv.name}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "var(--gradient-signal)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <Download size={16} /> Download CV
                </a>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
                >
                  <Upload size={16} /> Replace
                </button>
                <button
                  onClick={remove}
                  aria-label="Remove CV"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="hover-lift flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center transition-colors hover:border-accent/60"
            >
              <Upload className="text-muted-foreground" size={26} />
              <span className="font-display font-bold">
                {busy ? "Uploading…" : "Upload your CV"}
              </span>
              <span className="text-sm text-muted-foreground">
                PDF or Word file, up to 4 MB — stored in this browser
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
