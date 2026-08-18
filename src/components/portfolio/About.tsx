import { useEffect, useState } from "react";
import { Reveal, SectionHeading, useInView } from "@/components/Reveal";

const STATS = [
  { value: 3, suffix: "+", label: "Projects" },
  { value: 5, suffix: "+", label: "Skills" },
  { value: 3, suffix: "rd", label: "Year" },
  { value: 2027, suffix: "", label: "Graduation", static: true },
];

function Counter({
  value,
  suffix,
  isStatic,
}: {
  value: number;
  suffix: string;
  isStatic?: boolean;
}) {
  const { ref, visible } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(isStatic ? value : 0);

  useEffect(() => {
    if (!visible || isStatic) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, isStatic]);

  return (
    <span ref={ref} className="font-display text-3xl font-bold text-gradient">
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="About"
        title="Engineering signal out of noise"
        subtitle="A short introduction to who I am and what I'm working toward."
      />
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="glass rounded-2xl p-7">
            <h3 className="font-display text-lg font-bold">Bio</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I'm Shakik Zaman, an Information &amp; Communication Engineering student at
              Bangladesh University of Professionals. My interests sit at the intersection of
              web development and communication systems — I enjoy turning ideas into
              interfaces, designing databases that stay clean as they grow, and understanding
              how data actually travels across a network.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass rounded-2xl p-7">
            <h3 className="font-display text-lg font-bold">Career Objective</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To grow into a well-rounded software engineer who can build products end to end
              — from responsive frontends and reliable data layers to the network
              infrastructure beneath them — while contributing to teams that value
              craftsmanship and continuous learning.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="glass hover-lift rounded-xl p-6 text-center">
              <Counter value={s.value} suffix={s.suffix} isStatic={"static" in s} />
              <p className="mt-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
