import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicSiteData } from "@/lib/content/public";
import { formatStartingPrice } from "@/lib/format";

const packageDetails = {
  "launch-page": {
    timing: "7-10 business days",
    includes: ["One tailored page", "Mobile-first design and build", "Enquiry form and WhatsApp link", "Basic on-page SEO", "One revision round"],
  },
  "business-website": {
    timing: "3-4 weeks",
    includes: ["Up to 6 core pages", "Custom design system", "Enquiry forms and key integrations", "Basic SEO and analytics setup", "Two revision rounds"],
  },
  "custom-website": {
    timing: "Scoped with you",
    includes: ["E-commerce and product catalogues", "Content migration or product entry", "Payment and third-party integrations", "A delivery plan for the real scope", "A tailored investment proposal"],
  },
} as const;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Starting-point pricing guidance for Digital Visions website projects.",
};

export default async function PricingPage() {
  const { pricing } = await getPublicSiteData();

  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div><p className="eyebrow">Investment</p><h1 className="display">Clarity from the first conversation.</h1></div>
        <p className="page-intro-copy">Two clear starting points for businesses that need a site to do useful work, plus a custom route for e-commerce and more involved builds. Every project begins with a quick scope check before work starts.</p>
      </section>
      <section className="site-shell content-section">
        <div className="pricing-grid">
          {pricing.map((item) => {
            const details = packageDetails[item.id as keyof typeof packageDetails];

            return (
            <article className="pricing-card" key={item.id}>
              <p className="eyebrow">{item.qualifier}</p>
              <h2>{item.title}</h2>
              <p className="pricing-amount">{formatStartingPrice(item.startingPrice, item.currency, item.qualifier)}</p>
              <p>{item.description}</p>
              {details && <><p className="pricing-timing">Typical delivery: {details.timing}</p><ul className="pricing-inclusions">{details.includes.map((inclusion) => <li key={inclusion}>{inclusion}</li>)}</ul></>}
              <a className="text-link" href="/contact">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          );
          })}
        </div>
      </section>
      <section className="content-section content-section--paper">
        <div className="site-shell pricing-notes">
          <div><p className="eyebrow">How it works</p><h2>Clear terms. No fuzzy handover.</h2></div>
          <div className="pricing-terms">
            <article><h3>Payment</h3><p>50% reserves your production slot. The remaining balance is split between design sign-off and launch, so momentum stays shared.</p></article>
            <article><h3>What is not included</h3><p>Domain registration, business email, paid software, stock photography, and third-party subscriptions are supplied at cost. VAT is added where applicable.</p></article>
            <article><h3>Need more?</h3><p>Brand identity, SEO content, product entry, ongoing edits, and more than the included revision rounds can be added to a tailored scope.</p></article>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}