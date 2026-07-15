import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicSiteData } from "@/lib/content/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Website design, modernisation, and ongoing support from Digital Vision.",
};

export default async function ServicesPage() {
  const { services } = await getPublicSiteData();

  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div>
          <p className="eyebrow">Services</p>
          <h1 className="display">Make the website pull its weight.</h1>
        </div>
        <p className="page-intro-copy">Digital Vision meets your business where it is, then builds a clearer path from first glance to next step.</p>
      </section>
      <section className="site-shell content-section content-section--paper">
        <div className="service-detail-list">
          {services.map((service, index) => (
            <article className="service-detail" key={service.id}>
              <span className="service-detail-index">{String(index + 1).padStart(2, "0")}</span>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="tag-list">{service.deliverables.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="page-cta-band">
        <div className="site-shell page-cta-band-inner">
          <div><p className="eyebrow eyebrow--light">The first conversation</p><h2 className="display">Start with what is no longer working.</h2></div>
          <a className="button button--primary" href="/contact">Tell us about it <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </section>
    </PublicShell>
  );
}