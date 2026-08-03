import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const image = project.images[0];

  return (
    <article className="project-card">
      <Link className="project-image" href={`/work/${project.slug}`}>
        {image ? (
          <Image alt={image.alt} fill sizes="(max-width: 760px) 100vw, 50vw" src={image.url} />
        ) : (
          <div className="project-image-placeholder" aria-hidden="true">
            <span>{project.title.slice(0, 1).toUpperCase()}</span>
          </div>
        )}
      </Link>
      <div className="project-card-meta">
        <div>
          <p>{project.services.join(" / ") || "Digital Visions project"}</p>
          <h2><Link href={`/work/${project.slug}`}>{project.title}</Link></h2>
        </div>
        <Link aria-label={`Read ${project.title} case study`} className="icon-link" href={`/work/${project.slug}`}>
          <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <p className="project-summary">{project.summary}</p>
    </article>
  );
}