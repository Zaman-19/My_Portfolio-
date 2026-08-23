import { Code2, Cpu, Database, Globe, Network, Sigma } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

const GROUPS = [
  {
    icon: Code2,
    title: "Programming",
    skills: [
      "C",
      "C++",
      "Java",
      "JavaScript",
    ],
  },
  {
    icon: Globe,
    title: "Web Development",
    skills: [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "Responsive Design",
    ],
  },
  {
    icon: Database,
    title: "Database",
    skills: [
      "SQL",
      "MySQL",
      "Data Modeling",
    ],
  },
  {
    icon: Network,
    title: "Networking",
    skills: [
      "TCP/IP Fundamentals",
      "Network Design",
      "Cisco Packet Tracer",
    ],
  },
  {
    icon: Cpu,
    title: "Operating Systems",
    skills: [
      "Linux Fundamentals",
      "Shell & Command Line",
      "Processes & Memory",
      "Windows Administration",
    ],
  },
  {
    icon: Sigma,
    title: "MATLAB",
    skills: [
      "MATLAB Programming",
      "Signal Processing",
      "Plotting & Simulation",
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        subtitle="Tools and fundamentals I use across coursework and personal builds."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 100}>
            <div className="glass hover-lift h-full rounded-2xl p-7">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-aurora)" }}
                >
                  <g.icon size={18} />
                </span>
                <h3 className="font-display text-lg font-bold">{g.title}</h3>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
