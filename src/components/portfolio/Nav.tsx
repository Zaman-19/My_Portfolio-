import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "hobbies", label: "Hobbies" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      const offset = window.scrollY + 120;
      let current = "home";
      for (const link of LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= offset) current = link.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#home" className="group flex items-center gap-3" aria-label="Shakik Zaman home">
            <Logo />
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-[0.22em] uppercase">
                Shakik Zaman
              </span>
              <span className="mt-1 hidden text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:block">
                ICE · BUP
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    active === l.id
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="rounded-md p-2 text-muted-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open ? (
          <ul className="border-t border-border px-5 pb-4 md:hidden">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-sm ${
                    active === l.id ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className="h-px origin-left"
          style={{
            background: "var(--gradient-signal)",
            transform: `scaleX(${progress / 100})`,
          }}
        />
      </nav>
    </header>
  );
}
