import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";

export const metadata: Metadata = {
  title: "About",
  description: "How Digital Visions approaches website design and modernisation for South African businesses.",
};

const process = [
  ["01", "Find the real brief", "We begin with the business, the people it serves, and the actions a website needs to make easier."],
  ["02", "Make it make sense", "We shape the structure, language, and interface around clarity before adding visual polish."],
  ["03", "Keep improving", "A launch is a starting point. Ongoing care creates room for useful changes after the website meets the real world."],
];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div><p className="eyebrow">About Digital Visions</p><h1 className="display">A clearer way to show up online.</h1></div>
        <p className="page-intro-copy">Digital Visions is an independent Cape Town web studio for South African businesses that want their digital presence to feel as considered as the work behind it.</p>
      </section>
      <section className="content-section content-section--paper">
        <div className="site-shell">
          <p className="eyebrow">How we work</p>
          <div className="process-list" style={{ marginTop: "32px" }}>
            {process.map(([number, title, description]) => (
              <article className="process-step" key={number}><span>{number}</span><h2>{title}</h2><p>{description}</p></article>
            ))}
          </div>
        </div>
      </section>
      <section className="page-cta-band">
        <div className="site-shell page-cta-band-inner">
          <div><p className="eyebrow eyebrow--light">A practical partnership</p><h2 className="display">Tell us what the current site is getting in the way of.</h2></div>
          <a className="button button--primary" href="/contact">Start a project <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </section>
    </PublicShell>
  );
}