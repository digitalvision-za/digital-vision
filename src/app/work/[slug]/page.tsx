import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getPublicProject } from "@/lib/content/public";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProject(slug);

  if (!project) {
    notFound();
  }

  const heroImage = project.images[0];

  return (
    <PublicShell>
      <section className="site-shell case-hero">
        <p className="eyebrow">Case study</p>
        <h1 className="display">{project.title}</h1>
        <p className="case-hero-summary">{project.summary}</p>
        {project.services.length > 0 && (
          <div className="tag-list" style={{ marginTop: "27px" }}>
            {project.services.map((service) => <span className="tag" key={service}>{service}</span>)}
          </div>
        )}
      </section>
      <div className="site-shell case-media">
        {heroImage ? (
          <Image alt={heroImage.alt} fill priority sizes="100vw" src={heroImage.url} />
        ) : (
          <div className="project-image-placeholder" aria-hidden="true"><span>{project.title.slice(0, 1).toUpperCase()}</span></div>
        )}
      </div>
      <section className="site-shell case-detail-grid">
        <aside>Project notes</aside>
        <div className="case-detail-copy">
          {project.challenge && <div><h2>The brief</h2><p>{project.challenge}</p></div>}
          {project.approach && <div><h2>The approach</h2><p>{project.approach}</p></div>}
          {project.outcome && <div><h2>The outcome</h2><p>{project.outcome}</p></div>}
          {project.projectUrl && <a className="text-link" href={project.projectUrl} rel="noreferrer" target="_blank">Visit the project <ArrowUpRight size={17} aria-hidden="true" /></a>}
        </div>
      </section>
      {project.testimonialQuote && (
        <section className="case-testimonial">
          <div className="site-shell">
            <blockquote>&ldquo;{project.testimonialQuote}&rdquo;</blockquote>
            {(project.testimonialAuthor || project.testimonialRole) && <cite>{[project.testimonialAuthor, project.testimonialRole].filter(Boolean).join(", ")}</cite>}
          </div>
        </section>
      )}
    </PublicShell>
  );
}