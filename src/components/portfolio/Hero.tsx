import { useEffect, useState } from "react";
import { FolderGit2, Mail } from "lucide-react";
import { NetworkCanvas } from "@/components/NetworkCanvas";
import photo from "@/assets/shakik-2.jpg.asset.json";

const ROLES = [
  "ICE Student",
  "Web Developer",
  "Frontend Developer",
  "Database Enthusiast",
  "Networking Learner",
];

function RoleCycler() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[index % ROLES.length]!;
    const done = text === full;
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (done) setDeleting(true);
          else setText(full.slice(0, text.length + 1));
        } else if (text === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % ROLES.length);
        } else {
          setText(full.slice(0, text.length - 1));
        }
      },
      deleting ? 40 : done ? 1600 : 70,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  const longest = ROLES.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-block align-top">
      {/* invisible sizer keeps the line width/height stable so nothing shifts */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span className="text-gradient absolute inset-0 whitespace-nowrap">{text}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 -z-10">
        <NetworkCanvas />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 35%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <div>
          <p className="hero-in eyebrow" style={{ animationDelay: "80ms" }}>
            Information &amp; Communication Engineering
          </p>
          <h1
            className="hero-in mt-4 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            Shakik Zaman
          </h1>
          <p
            className="hero-in mt-4 font-display text-xl font-medium sm:text-2xl"
            style={{ animationDelay: "360ms" }}
          >
            <RoleCycler />
          </p>
          <p
            className="hero-in mt-6 max-w-lg text-muted-foreground"
            style={{ animationDelay: "500ms" }}
          >
            I am a third-year ICE student at Bangladesh University of Professionals,
            passionate about building where software meets communication. Exploring web
            development, databases, and networking while turning ideas into clean, practical
            digital experiences.
          </p>
          <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "640ms" }}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
            >
              <Mail size={16} /> Contact Me
            </a>
            <a
              href="#projects"
              className="glass inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors hover:border-accent/50 hover:text-accent"
            >
              <FolderGit2 size={16} /> View Projects
            </a>
          </div>
        </div>

        <div className="hero-in flex justify-center" style={{ animationDelay: "800ms" }}>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full opacity-60 blur-2xl"
              style={{ background: "var(--gradient-aurora)" }}
            />
            <div
              className="pulse-node relative h-64 w-64 overflow-hidden rounded-full border sm:h-80 sm:w-80"
              style={{ borderColor: "color-mix(in oklab, var(--accent) 60%, transparent)" }}
            >
              <img
                src={photo.url}
                alt="Portrait of Shakik Zaman"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
