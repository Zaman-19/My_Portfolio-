import { Clapperboard, Plane, Volleyball, Trophy } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

const HOBBIES = [
  { icon: Trophy, title: "Playing Cricket", note: "Weekend matches and street cricket." },
  { icon: Volleyball, title: "Playing Football", note: "Midfield runs whenever the pitch is free." },
  { icon: Clapperboard, title: "Watching Movies", note: "Sci-fi, thrillers and true stories." },
  { icon: Plane, title: "Traveling", note: "New places, new people, new signals." },
];

export function Hobbies() {
  return (
    <section id="hobbies" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Hobbies"
        title="Life outside the screen"
        subtitle="What keeps me energised when I'm away from the keyboard."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOBBIES.map((h, i) => (
          <Reveal key={h.title} delay={i * 90}>
            <div className="glass hover-lift h-full rounded-2xl p-6">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-aurora)" }}
              >
                <h.icon size={19} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
