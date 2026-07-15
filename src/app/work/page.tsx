import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { ProjectCard } from "@/components/project-card";
import { getPublicSiteData } from "@/lib/content/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "Published Digital Vision website projects and case studies.",
};

export default async function WorkPage() {
  const { projects } = await getPublicSiteData();

  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div>
          <p className="eyebrow">Selected work</p>
          <h1 className="display">Proof belongs in the work, not the pitch.</h1>
        </div>
        <p className="page-intro-copy">
          Each case study is published by Digital Vision with permission and context. Explore the projects below as they are added to the studio archive.
        </p>
      </section>
      <section className="site-shell">
        {projects.length ? (
          <div className="work-grid">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="empty-work">
            <div className="empty-work-mark" aria-hidden="true">
              <svg viewBox="0 0 180 180"><rect x="20" y="90" width="35" height="55" fill="currentColor" /><rect x="72" y="55" width="35" height="90" fill="currentColor" opacity=".72" /><rect x="124" y="20" width="35" height="125" fill="currentColor" opacity=".4" /></svg>
            </div>
            <div className="empty-work-copy">
              <p className="eyebrow">Archive in progress</p>
              <h2>New case studies are being prepared with care.</h2>
              <p>Digital Vision only shares work that has been approved for publication. In the meantime, tell us what a more useful website needs to do for your business.</p>
              <a className="text-link" href="/contact">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        )}
      </section>
    </PublicShell>
  );
}