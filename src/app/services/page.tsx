import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicSiteData } from "@/lib/content/public";
import { formatStartingPrice } from "@/lib/format";
import { getServicePackageDetails } from "@/lib/service-packages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Website design, modernisation, and ongoing support from Digital Visions.",
};

export default async function ServicesPage() {
  const { pricing } = await getPublicSiteData();

  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div>
          <p className="eyebrow">Services</p>
          <h1 className="display">Make the website pull its weight.</h1>
        </div>
        <p className="page-intro-copy">Digital Visions meets your business where it is, then builds a clearer path from first glance to next step. Choose a focused starting point or bring us the more involved brief.</p>
      </section>
      <section className="site-shell content-section content-section--paper">
        <div className="service-package-list">
          {pricing.map((item, index) => {
            const details = getServicePackageDetails(item.id);

            return (
            <article className="service-package" key={item.id}>
              <span className="service-detail-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="eyebrow">{formatStartingPrice(item.startingPrice, item.currency, item.qualifier)}</p>
                <h2>{item.title}</h2>
                <p className="service-package-description">{item.description}</p>
              </div>
              <div className="service-package-scope">
                {details ? <>
                  <p className="service-package-fit"><strong>Best for:</strong> {details.bestFor}</p>
                  <p className="service-package-timing">Typical delivery: {details.timing}</p>
                  <ul className="service-package-inclusions">{details.includes.map((inclusion) => <li key={inclusion}>{inclusion}</li>)}</ul>
                </> : <p className="service-package-fit">We will confirm the right deliverables, timeline, and investment after a short scope conversation.</p>}
              </div>
              <a className="text-link service-package-link" href="/contact">Discuss this service <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
            );
          })}
        </div>
      </section>
      <section className="site-shell content-section service-add-ons">
        <div>
          <p className="eyebrow">Beyond the core build</p>
          <h2 className="display">Add what makes the work more useful.</h2>
        </div>
        <div>
          <p>Brand identity, SEO content, product entry, ongoing edits, and additional revision rounds can be included when they solve a real need. Domain registration, business email, paid software, stock photography, and third-party subscriptions are supplied at cost.</p>
          <p>Every fixed-scope project starts with a 50% booking payment. The remaining balance is split between design sign-off and launch.</p>
          <a className="text-link" href="/pricing">View investment guidance <ArrowUpRight size={17} aria-hidden="true" /></a>
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