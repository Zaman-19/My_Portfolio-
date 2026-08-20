import { useEffect, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal, SectionHeading } from "@/components/Reveal";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  issuer: string;
  date_label: string;
  link: string;
  sort_order: number;
};

export async function fetchAchievements(): Promise<Achievement[]> {
  const { data } = await supabase
    .from("achievements")
    .select("id, title, description, issuer, date_label, link, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as Achievement[];
}

export function Achievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="achievements" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Achievements"
        title="Milestones worth marking"
        subtitle="Certifications, competitions and recognitions along the way."
      />

      {loading ? (
        <div className="glass rounded-2xl px-6 py-14 text-center text-sm text-muted-foreground">
          Loading achievements…
        </div>
      ) : items.length === 0 ? (
        <Reveal>
          <div className="glass rounded-2xl px-6 py-16 text-center">
            <Award className="mx-auto text-muted-foreground" size={28} />
            <p className="mt-4 font-display font-bold">No achievements published yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New milestones will appear here soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((a, i) => (
            <Reveal key={a.id} delay={i * 80}>
              <article className="glass hover-lift h-full rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-primary-foreground"
                    style={{ background: "var(--gradient-aurora)" }}
                  >
                    <Award size={19} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold">{a.title}</h3>
                    {a.issuer || a.date_label ? (
                      <p className="mt-1 text-xs tracking-[0.14em] text-accent uppercase">
                        {[a.issuer, a.date_label].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
                {a.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                ) : null}
                {a.link ? (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent"
                  >
                    <ExternalLink size={15} /> View
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
