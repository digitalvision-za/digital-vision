import type { MetadataRoute } from "next";
import { getPublicSiteData } from "@/lib/content/public";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalvision.co.za";
  const { projects } = await getPublicSiteData();
  const routes = ["", "/work", "/services", "/pricing", "/about", "/contact", "/privacy"];

  return [
    ...routes.map((path) => ({ url: new URL(path, baseUrl).toString(), lastModified: new Date() })),
    ...projects.map((project) => ({ url: new URL(`/work/${project.slug}`, baseUrl).toString(), lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date() })),
  ];
}