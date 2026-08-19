import { Code2, Cpu, Database, Globe, Network, Sigma } from "lucide-react";
import { Reveal, SectionHeading, useInView } from "@/components/Reveal";

const GROUPS = [
  {
    icon: Code2,
    title: "Programming",
    skills: [
      { name: "C", level: 80 },
      { name: "C++", level: 74 },
      { name: "Java", level: 70 },
      { name: "JavaScript", level: 76 },
    ],
  },
  {
    icon: Globe,
    title: "Web Development",
    skills: [
      { name: "HTML5 & CSS3", level: 90 },
      { name: "JavaScript (ES6+)", level: 76 },
      { name: "Responsive Design", level: 85 },
    ],
  },
  {
    icon: Database,
    title: "Database",
    skills: [
      { name: "SQL", level: 78 },
      { name: "MySQL", level: 72 },
      { name: "Data Modeling", level: 65 },
    ],
  },
  {
    icon: Network,
    title: "Networking",
    skills: [
      { name: "TCP/IP Fundamentals", level: 74 },
      { name: "Network Design", level: 66 },
      { name: "Cisco Packet Tracer", level: 70 },
    ],
  },
  {
    icon: Cpu,
    title: "Operating Systems",
    skills: [
      { name: "Linux Fundamentals", level: 72 },
      { name: "Shell & Command Line", level: 68 },
      { name: "Processes & Memory", level: 66 },
      { name: "Windows Administration", level: 74 },
    ],
  },
  {
    icon: Sigma,
    title: "MATLAB",
    skills: [
      { name: "MATLAB Programming", level: 72 },
      { name: "Signal Processing", level: 68 },
      { name: "Plotting & Simulation", level: 70 },
    ],
  },
];

function Bar({ name, level }: { name: string; level: number }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/90">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: visible ? `${level}%` : "0%",
            background: "var(--gradient-signal)",
          }}
        />
      </div>
    </div>
  );
}

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
              <div className="mt-6 space-y-4">
                {g.skills.map((s) => (
                  <Bar key={s.name} {...s} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
