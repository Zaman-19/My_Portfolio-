import { Database, Layout, Network, Globe } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

const SERVICES = [
  {
    icon: Globe,
    title: "Web Development",
    text: "Responsive, standards-based websites built with semantic HTML, modern CSS and vanilla JavaScript.",
  },
  {
    icon: Layout,
    title: "Frontend Development",
    text: "Component-driven interfaces with careful attention to layout, motion, performance and accessibility.",
  },
  {
    icon: Database,
    title: "Database Design",
    text: "Normalized schemas, clean relationships and efficient SQL queries for applications that need to scale.",
  },
  {
    icon: Network,
    title: "Network Design",
    text: "Topology planning, IP addressing and simulation of small-to-medium network layouts.",
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading eyebrow="Services" title="How I can help" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <div className="glass hover-lift h-full rounded-2xl p-6">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-aurora)" }}
              >
                <s.icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-base font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
