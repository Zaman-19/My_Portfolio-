import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Education } from "@/components/portfolio/Education";
import { Skills } from "@/components/portfolio/Skills";
import { Services } from "@/components/portfolio/Services";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";
import { Footer, SignalDivider } from "@/components/portfolio/Footer";

const title = "Shakik Zaman — ICE Student & Web Developer";
const description =
  "Portfolio of Shakik Zaman, Information & Communication Engineering student at BUP — web development, frontend, database design and network design.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <SignalDivider />
      <Education />
      <Skills />
      <SignalDivider />
      <Services />
      <Projects />
      <SignalDivider />
      <Contact />
      <Footer />
      <Toaster />
    </main>
  );
}
