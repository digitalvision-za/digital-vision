import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicSiteData } from "@/lib/content/public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPublicSiteData();

  return (
    <PublicShell>
        <section className="hero site-shell">
          <div className="hero-copy">
            <p className="eyebrow">{data.settings.locationLabel}</p>
            <h1 className="display">{data.settings.tagline}</h1>
            <p className="hero-intro">
              {data.settings.intro}
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="/contact">
                Plan a project <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="button button--secondary" href="/services">Explore services</a>
            </div>
          </div>

          <div className="hero-art" aria-label="A sample Digital Vision web page layout" role="img">
            <div className="art-browser">
              <div className="browser-bar"><span /><span /><span /><b>digitalvision.co.za</b></div>
              <div className="browser-page">
                <div className="art-logo"><span /> VISUAL CLARITY</div>
                <div className="art-rule" />
                <p>Make the important thing</p>
                <strong>impossible to miss.</strong>
                <div className="art-grid"><i /><i /><i /></div>
              </div>
            </div>
            <p className="art-note"><span /> Designed around the next decision</p>
            <span className="art-arc" aria-hidden="true" />
          </div>
        </section>

        <section className="intent-band">
          <div className="site-shell intent-grid">
            <p className="display">For businesses ready to look as capable online as they are in the room.</p>
            <p>From an overdue first website to a thoughtful rebuild, we translate your real value into a digital presence people can understand and act on.</p>
          </div>
        </section>

        <section className="site-shell service-section">
          <div className="section-heading">
            <p className="eyebrow">What we do</p>
            <h2 className="display">A more useful kind of web partner.</h2>
          </div>
          <div className="service-grid">
            {data.services.slice(0, 3).map((service, index) => (
              <article className={index === 1 ? "service-card service-card--accent" : "service-card"} key={service.id}>
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-line" />
                <small>{service.deliverables.join(", ")}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="site-shell contact-inner">
            <div>
              <p className="eyebrow">A good place to start</p>
              <h2 className="display">What would a clearer website change for your business?</h2>
            </div>
            <a className="button button--primary" href="/contact">
              Tell us about it <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>
    </PublicShell>
  );
}
