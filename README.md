# Signal Weaver

Premium Futuristic Portfolio Website — Design Brief for Shakik Zaman

Build a distinctive, premium, fully responsive personal portfolio website for Shakik Zaman, an ICE (Information & Communication Engineering) student. The site's identity should be built around a "signal & network" concept — tying directly into his field (Information & Communication Engineering) — instead of generic floating-particle/glassmorphism clichés.

Signature Design Element

Hero background: an animated canvas of connected nodes/lines that pulse like a live communication network (not random particles) — subtle, slow, professional, reacts gently to cursor movement.

This same node/line motif repeats faintly as a section divider and in the footer, tying the whole site together as one visual language.

Color Palette (fixed, do not change)

Primary: Electric Blue #3B82F6

Accent: Cyan #06B6D4

Background: Deep Black #0B0F19

Secondary: Dark Navy #111827

Highlight: Purple #7C3AED

Text: White + light gray secondary

Typography

Headings: Space Grotesk (bold, wide letter-spacing for section labels)

Body: Inter

Small "eyebrow" labels in uppercase, letter-spaced, cyan — used sparingly, only where it adds meaning (not decorative numbering)

Layout / Sections

Nav — fixed glass bar, logo mark "SZ" in a glowing hexagon, smooth scroll-spy links, scroll progress indicator line

Hero — left: name, animated role cycler (ICE Student / Web Developer / Frontend Developer / Database Enthusiast / Networking Learner), intro paragraph, Download CV + Contact Me buttons. Right: profile photo in glowing circular frame over the node-network canvas

About — two-column: bio + career objective + animated stat counters (3+ Projects, 5+ Skills, 3rd Year, Grad 2027)

Education — single-entry vertical timeline (BUP, B.Sc. ICE, Dept. of ICT, Current: 3rd Year, Expected Grad: 2027) with a glowing "current" marker

Skills — grouped cards (Programming, Web Development, Database, Networking — no UI/UX category), animated progress bars on scroll

Services — Web Development, Frontend Development, Database Design, Network Design (no UI/UX Design service), hover-lift glass cards

Projects — separate interactive module, not static content:

Its own nav tab/section

Grid of project cards (empty state message if none added yet)

"+ Add Project" button → modal form (title, description, tech stack, GitHub link, live demo link)

Delete button per card

No pre-filled example projects

Contact — glass cards with:

Email: shakikzaman066@gmail.com

Phone: +880 1700-525763

Location: Nirjhor, Dhaka Cantonment

LinkedIn: linkedin.com/in/shakik-zaman-92b5b2317

GitHub: github.com/Zaman-19

Simple contact form (Name, Email, Subject, Message)

Footer — faint node-network line art, Copyright © 2026 Shakik Zaman, quick links, social icons, back-to-top

Motion (deliberate, not scattered)

One orchestrated hero load-in sequence (name → subtitle → buttons → photo, staggered)

Scroll-reveal fade/slide on section entry

Hover-lift on cards, subtle 3D tilt on project cards only

Reduced-motion respected for accessibility

Tech: HTML5, CSS3, vanilla JS (Canvas for the network animation), Font Awesome, Google Fonts — fully responsive, dark-mode native, fast-loading, accessible.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zaaman.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/78b86ed3-9108-4b2a-8b59-269f0549c7d6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
