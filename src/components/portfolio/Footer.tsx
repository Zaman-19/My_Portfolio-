import { ArrowUp, Github, Linkedin, Mail, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NetworkCanvas } from "@/components/NetworkCanvas";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <NetworkCanvas faint interactive={false} density={0.00006} />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.24em] uppercase">
            Shakik Zaman
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Copyright © 2026 Shakik Zaman. All rights reserved.
          </p>
        </div>

        <ul className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="hover:text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Zaman-19"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-accent"
          >
            <Github size={16} />
          </a>
          <a
            href="https://linkedin.com/in/shakik-zaman-92b5b2317"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-accent"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:shakikzaman066@gmail.com"
            aria-label="Email"
            className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-accent"
          >
            <Mail size={16} />
          </a>
          <Link
            to="/admin"
            aria-label="Owner admin panel"
            className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-accent"
          >
            <Shield size={16} />
          </Link>
          <a
            href="#home"
            aria-label="Back to top"
            className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-signal)" }}
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function SignalDivider() {
  return (
    <div className="mx-auto h-16 max-w-6xl px-5 opacity-50">
      <NetworkCanvas faint interactive={false} density={0.00012} />
    </div>
  );
}
