import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/Reveal";

const DETAILS = [
  { icon: Mail, label: "Email", value: "shakikzaman066@gmail.com", href: "mailto:shakikzaman066@gmail.com" },
  { icon: Phone, label: "Phone", value: "+880 1700-525763", href: "tel:+8801700525763" },
  { icon: MapPin, label: "Location", value: "Nirjhor, Dhaka Cantonment", href: undefined },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/shakik-zaman-92b5b2317",
    href: "https://linkedin.com/in/shakik-zaman-92b5b2317",
  },
  { icon: Github, label: "GitHub", value: "github.com/Zaman-19", href: "https://github.com/Zaman-19" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! Your message is ready to send.", {
      description: "I'll get back to you at " + form.email,
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const field =
    "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let's open a channel"
        subtitle="Reach out for collaborations, internships or just to talk tech."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {DETAILS.map((d, i) => {
            const inner = (
              <div className="glass hover-lift h-full rounded-xl p-5">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-aurora)" }}
                >
                  <d.icon size={16} />
                </span>
                <p className="eyebrow mt-4">{d.label}</p>
                <p className="mt-1 text-sm break-words text-muted-foreground">{d.value}</p>
              </div>
            );
            return (
              <Reveal key={d.label} delay={i * 70}>
                {d.href ? (
                  <a href={d.href} target="_blank" rel="noreferrer" className="block h-full">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <form onSubmit={submit} className="glass rounded-2xl p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Name
                <input
                  required
                  className={field}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Email
                <input
                  required
                  type="email"
                  className={field}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>
            <label className="mt-4 block text-sm">
              Subject
              <input
                required
                className={field}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>
            <label className="mt-4 block text-sm">
              Message
              <textarea
                required
                rows={5}
                className={field}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-signal)", boxShadow: "var(--shadow-glow)" }}
            >
              Send Message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
