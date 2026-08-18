import { GraduationCap } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading eyebrow="Education" title="Academic track" />
      <Reveal>
        <div className="relative pl-10">
          <div
            className="absolute top-2 bottom-2 left-[13px] w-px"
            style={{ background: "var(--gradient-signal)" }}
          />
          <span
            className="pulse-node absolute top-2 left-0 grid h-7 w-7 place-items-center rounded-full text-primary-foreground"
            style={{ background: "var(--gradient-aurora)" }}
          >
            <GraduationCap size={14} />
          </span>
          <div className="glass hover-lift rounded-2xl p-7">
            <p className="eyebrow">Current · 3rd Year</p>
            <h3 className="mt-2 text-xl font-bold">
              B.Sc. in Information &amp; Communication Engineering
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Bangladesh University of Professionals (BUP) — Department of Information and
              Communication Technology
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                Dept. of ICT
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                Expected Graduation: 2027
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
