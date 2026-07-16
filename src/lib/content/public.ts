import "server-only";

import { cache } from "react";
import { defaultPrivacyPage, defaultPublicSiteData } from "./defaults";
import type { LegalPage, PricingItem, Project, ProjectImage, PublicSiteData, Service, SiteSettings } from "./types";
import { createPublicClient } from "@/lib/supabase/public";

function mapService(row: Record<string, unknown>): Service {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    deliverables: Array.isArray(row.deliverables) ? row.deliverables.map(String) : [],
    isVisible: Boolean(row.is_visible),
    sortOrder: Number(row.sort_order),
  };
}

function mapPricing(row: Record<string, unknown>): PricingItem {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    startingPrice: typeof row.starting_price === "number" ? row.starting_price : null,
    currency: String(row.currency ?? "ZAR"),
    qualifier: String(row.qualifier ?? "Custom scope"),
    isVisible: Boolean(row.is_visible),
    sortOrder: Number(row.sort_order),
  };
}

function mapProject(row: Record<string, unknown>, images: ProjectImage[]): Project {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    summary: String(row.summary),
    challenge: typeof row.challenge === "string" ? row.challenge : null,
    approach: typeof row.approach === "string" ? row.approach : null,
    outcome: typeof row.outcome === "string" ? row.outcome : null,
    projectUrl: typeof row.project_url === "string" ? row.project_url : null,
    services: Array.isArray(row.services) ? row.services.map(String) : [],
    testimonialQuote: typeof row.testimonial_quote === "string" ? row.testimonial_quote : null,
    testimonialAuthor: typeof row.testimonial_author === "string" ? row.testimonial_author : null,
    testimonialRole: typeof row.testimonial_role === "string" ? row.testimonial_role : null,
    status: row.status === "published" ? "published" : "draft",
    isFeatured: Boolean(row.is_featured),
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    images,
  };
}

export const getPublicSiteData = cache(async (): Promise<PublicSiteData> => {
  const supabase = createPublicClient();

  if (!supabase) {
    return defaultPublicSiteData;
  }

  const [settingsResult, servicesResult, pricingResult, projectsResult] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("services").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("pricing_items").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("projects").select("*, project_images(*)").eq("status", "published").order("display_order"),
  ]);

  if (servicesResult.error || pricingResult.error || projectsResult.error) {
    return defaultPublicSiteData;
  }

  const settingsRow = settingsResult.data as Record<string, unknown> | null;
  const settings: SiteSettings = settingsRow
    ? {
        companyName: String(settingsRow.company_name ?? defaultPublicSiteData.settings.companyName),
        tagline: String(settingsRow.tagline ?? defaultPublicSiteData.settings.tagline),
        contactEmail: typeof settingsRow.contact_email === "string" ? settingsRow.contact_email : null,
        phone: typeof settingsRow.phone === "string" ? settingsRow.phone : null,
        locationLabel: String(settingsRow.location_label ?? defaultPublicSiteData.settings.locationLabel),
        intro: String(settingsRow.intro ?? defaultPublicSiteData.settings.intro),
        analyticsEnabled: Boolean(settingsRow.analytics_enabled),
      }
    : defaultPublicSiteData.settings;

  const projects = await Promise.all((projectsResult.data ?? []).map(async (row) => {
    const projectRow = row as Record<string, unknown>;
    const imageRows = Array.isArray(projectRow.project_images) ? projectRow.project_images : [];
    const images = await Promise.all(imageRows.map(async (image) => {
      const imageRow = image as Record<string, unknown>;
      const path = String(imageRow.storage_path ?? "");
      const { data: signedImage } = await supabase.storage
        .from("project-media")
        .createSignedUrl(path, 60 * 60);

      return {
        id: String(imageRow.id),
        url: signedImage?.signedUrl ?? "",
        alt: String(imageRow.alt ?? "Project image"),
        sortOrder: Number(imageRow.sort_order ?? 0),
      };
    }));

    return mapProject(projectRow, images.filter((image) => image.url).sort((left, right) => left.sortOrder - right.sortOrder));
  }));

  const pricing = (pricingResult.data ?? []).map((row) => mapPricing(row as Record<string, unknown>));

  return {
    settings,
    services: (servicesResult.data ?? []).map((row) => mapService(row as Record<string, unknown>)),
    pricing: pricing.length ? pricing : defaultPublicSiteData.pricing,
    projects,
  };
});

export const getPublicProject = cache(async (slug: string) => {
  const data = await getPublicSiteData();
  return data.projects.find((project) => project.slug === slug) ?? null;
});

export const getPublicLegalPage = cache(async (slug: "privacy" | "terms"): Promise<LegalPage | null> => {
  const supabase = createPublicClient();

  if (!supabase) {
    return slug === "privacy" ? defaultPrivacyPage : null;
  }

  const { data, error } = await supabase
    .from("legal_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return slug === "privacy" ? defaultPrivacyPage : null;
  }

  return {
    slug,
    title: String(data.title),
    content: String(data.content),
    isPublished: Boolean(data.is_published),
    updatedAt: typeof data.updated_at === "string" ? data.updated_at : null,
  };
});