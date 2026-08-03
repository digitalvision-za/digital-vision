import type { MetadataRoute } from "next";
import { getPublicSiteData } from "@/lib/content/public";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const { projects } = await getPublicSiteData();
  const routes = ["", "/work", "/services", "/pricing", "/about", "/contact", "/privacy"];

  return [
    ...routes.map((path) => ({ url: new URL(path, baseUrl).toString(), lastModified: new Date() })),
    ...projects.map((project) => ({ url: new URL(`/work/${project.slug}`, baseUrl).toString(), lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date() })),
  ];
}