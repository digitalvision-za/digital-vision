import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicSiteData } from "@/lib/content/public";
import { formatStartingPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Starting-point pricing guidance for Digital Vision website projects.",
};

export default async function PricingPage() {
  const { pricing } = await getPublicSiteData();

  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div><p className="eyebrow">Pricing guidance</p><h1 className="display">Good scope makes for good work.</h1></div>
        <p className="page-intro-copy">A useful website is shaped around the business it needs to serve. These starting points are maintained by Digital Vision and remain a conversation, not a checkout.</p>
      </section>
      <section className="site-shell content-section">
        <div className="pricing-grid">
          {pricing.map((item) => (
            <article className="pricing-card" key={item.id}>
              <p className="eyebrow">{item.qualifier}</p>
              <h2>{item.title}</h2>
              <p className="pricing-amount">{formatStartingPrice(item.startingPrice, item.currency, item.qualifier)}</p>
              <p>{item.description}</p>
              <a className="text-link" href="/contact">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}