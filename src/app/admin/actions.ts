"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminContext } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginState = { message: string; status: "idle" | "error" };

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Enter your password."),
});

const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  summary: z.string().trim().min(10).max(1000),
  challenge: z.string().trim().max(5000),
  approach: z.string().trim().max(5000),
  outcome: z.string().trim().max(5000),
  projectUrl: z.string().trim().url().or(z.literal("")),
  services: z.string().trim().max(1000),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(10000),
  testimonialQuote: z.string().trim().max(2000),
  testimonialAuthor: z.string().trim().max(160),
  testimonialRole: z.string().trim().max(160),
});

const serviceSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  deliverables: z.string().trim().max(1000),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.boolean(),
});

const pricingSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  startingPrice: z.union([z.coerce.number().min(0), z.literal("")]),
  currency: z.string().trim().length(3),
  qualifier: z.string().trim().min(2).max(80),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.boolean(),
});

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function splitList(input: string) {
  return input.split(",").map((item) => item.trim()).filter(Boolean);
}

function refreshPublicRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/services");
  revalidatePath("/pricing");
  revalidatePath("/privacy");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/work/${slug}`);
  }
}

export async function loginAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your login details." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { status: "error", message: "Supabase is not configured. Add the environment variables first." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: "We could not sign you in with those details." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function createProjectAction(formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const parsed = projectSchema.safeParse({
    title: value(formData, "title"), slug: value(formData, "slug"), summary: value(formData, "summary"), challenge: value(formData, "challenge"), approach: value(formData, "approach"), outcome: value(formData, "outcome"), projectUrl: value(formData, "projectUrl"), services: value(formData, "services"), status: value(formData, "status"), isFeatured: checked(formData, "isFeatured"), displayOrder: value(formData, "displayOrder"), testimonialQuote: value(formData, "testimonialQuote"), testimonialAuthor: value(formData, "testimonialAuthor"), testimonialRole: value(formData, "testimonialRole"),
  });

  if (!parsed.success) {
    throw new Error("Project details are incomplete or invalid.");
  }

  const { data, error } = await supabase.from("projects").insert({
    title: parsed.data.title, slug: parsed.data.slug, summary: parsed.data.summary, challenge: parsed.data.challenge || null, approach: parsed.data.approach || null, outcome: parsed.data.outcome || null, project_url: parsed.data.projectUrl || null, services: splitList(parsed.data.services), status: parsed.data.status, is_featured: parsed.data.isFeatured, display_order: parsed.data.displayOrder, testimonial_quote: parsed.data.testimonialQuote || null, testimonial_author: parsed.data.testimonialAuthor || null, testimonial_role: parsed.data.testimonialRole || null, published_at: parsed.data.status === "published" ? new Date().toISOString() : null, updated_by: userId,
  }).select("id, slug").single();

  if (error || !data) {
    throw new Error("We could not create that project. Check that the slug is unique.");
  }

  refreshPublicRoutes(data.slug);
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const parsed = projectSchema.safeParse({
    title: value(formData, "title"), slug: value(formData, "slug"), summary: value(formData, "summary"), challenge: value(formData, "challenge"), approach: value(formData, "approach"), outcome: value(formData, "outcome"), projectUrl: value(formData, "projectUrl"), services: value(formData, "services"), status: value(formData, "status"), isFeatured: checked(formData, "isFeatured"), displayOrder: value(formData, "displayOrder"), testimonialQuote: value(formData, "testimonialQuote"), testimonialAuthor: value(formData, "testimonialAuthor"), testimonialRole: value(formData, "testimonialRole"),
  });

  if (!parsed.success) {
    throw new Error("Project details are incomplete or invalid.");
  }

  const { error } = await supabase.from("projects").update({
    title: parsed.data.title, slug: parsed.data.slug, summary: parsed.data.summary, challenge: parsed.data.challenge || null, approach: parsed.data.approach || null, outcome: parsed.data.outcome || null, project_url: parsed.data.projectUrl || null, services: splitList(parsed.data.services), status: parsed.data.status, is_featured: parsed.data.isFeatured, display_order: parsed.data.displayOrder, testimonial_quote: parsed.data.testimonialQuote || null, testimonial_author: parsed.data.testimonialAuthor || null, testimonial_role: parsed.data.testimonialRole || null, published_at: parsed.data.status === "published" ? new Date().toISOString() : null, updated_by: userId,
  }).eq("id", projectId);

  if (error) {
    throw new Error("We could not update that project.");
  }

  refreshPublicRoutes(parsed.data.slug);
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteProjectAction(projectId: string, formData: FormData) {
  const confirmation = value(formData, "confirmation");
  if (confirmation !== "DELETE") {
    throw new Error("Type DELETE to remove a project.");
  }

  const { supabase } = await getAdminContext();
  const { data: images } = await supabase.from("project_images").select("storage_path").eq("project_id", projectId);
  if (images?.length) {
    await supabase.storage.from("project-media").remove(images.map((image) => image.storage_path));
  }
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error("We could not delete that project.");
  refreshPublicRoutes();
  redirect("/admin/projects");
}

export async function uploadProjectImageAction(projectId: string, formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const file = formData.get("image");
  const alt = value(formData, "alt").trim();
  const sortOrder = Number(value(formData, "sortOrder") || 0);
  const acceptedTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

  if (!(file instanceof File) || !acceptedTypes.has(file.type) || file.size === 0 || file.size > 10 * 1024 * 1024 || alt.length < 2 || alt.length > 240) {
    throw new Error("Upload a JPG, PNG, or WebP under 10 MB with useful alternative text.");
  }

  const extension = acceptedTypes.get(file.type);
  const storagePath = `projects/${projectId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("project-media").upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error("We could not upload that image.");

  const { error: imageError } = await supabase.from("project_images").insert({ project_id: projectId, storage_path: storagePath, alt, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0, updated_by: userId });
  if (imageError) {
    await supabase.storage.from("project-media").remove([storagePath]);
    throw new Error("We could not save that image.");
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/work");
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteProjectImageAction(imageId: string, projectId: string) {
  const { supabase } = await getAdminContext();
  const { data: image } = await supabase.from("project_images").select("storage_path").eq("id", imageId).maybeSingle();
  if (!image) throw new Error("Image not found.");
  const { error } = await supabase.from("project_images").delete().eq("id", imageId);
  if (error) throw new Error("We could not remove that image.");
  await supabase.storage.from("project-media").remove([image.storage_path]);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/work");
  redirect(`/admin/projects/${projectId}`);
}

export async function saveServiceAction(serviceId: string | null, formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const parsed = serviceSchema.safeParse({ title: value(formData, "title"), description: value(formData, "description"), deliverables: value(formData, "deliverables"), sortOrder: value(formData, "sortOrder"), isVisible: checked(formData, "isVisible") });
  if (!parsed.success) throw new Error("Check the service details.");
  const record = { title: parsed.data.title, description: parsed.data.description, deliverables: splitList(parsed.data.deliverables), sort_order: parsed.data.sortOrder, is_visible: parsed.data.isVisible, updated_by: userId };
  const result = serviceId ? await supabase.from("services").update(record).eq("id", serviceId) : await supabase.from("services").insert(record);
  if (result.error) throw new Error("We could not save that service.");
  refreshPublicRoutes();
  redirect("/admin/services");
}

export async function deleteServiceAction(serviceId: string) {
  const { supabase } = await getAdminContext();
  const { error } = await supabase.from("services").delete().eq("id", serviceId);
  if (error) throw new Error("We could not delete that service.");
  refreshPublicRoutes();
  redirect("/admin/services");
}

export async function savePricingAction(pricingId: string | null, formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const parsed = pricingSchema.safeParse({ title: value(formData, "title"), description: value(formData, "description"), startingPrice: value(formData, "startingPrice"), currency: value(formData, "currency").toUpperCase(), qualifier: value(formData, "qualifier"), sortOrder: value(formData, "sortOrder"), isVisible: checked(formData, "isVisible") });
  if (!parsed.success) throw new Error("Check the pricing details.");
  const record = { title: parsed.data.title, description: parsed.data.description, starting_price: parsed.data.startingPrice === "" ? null : parsed.data.startingPrice, currency: parsed.data.currency, qualifier: parsed.data.qualifier, sort_order: parsed.data.sortOrder, is_visible: parsed.data.isVisible, updated_by: userId };
  const result = pricingId ? await supabase.from("pricing_items").update(record).eq("id", pricingId) : await supabase.from("pricing_items").insert(record);
  if (result.error) throw new Error("We could not save that pricing item.");
  refreshPublicRoutes();
  redirect("/admin/pricing");
}

export async function deletePricingAction(pricingId: string) {
  const { supabase } = await getAdminContext();
  const { error } = await supabase.from("pricing_items").delete().eq("id", pricingId);
  if (error) throw new Error("We could not delete that pricing item.");
  refreshPublicRoutes();
  redirect("/admin/pricing");
}

export async function saveSettingsAction(formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const parsed = z.object({ companyName: z.string().trim().min(2).max(120), tagline: z.string().trim().min(5).max(180), intro: z.string().trim().min(10).max(1000), locationLabel: z.string().trim().min(2).max(160), contactEmail: z.string().trim().email().or(z.literal("")), phone: z.string().trim().max(60), analyticsEnabled: z.boolean() }).safeParse({ companyName: value(formData, "companyName"), tagline: value(formData, "tagline"), intro: value(formData, "intro"), locationLabel: value(formData, "locationLabel"), contactEmail: value(formData, "contactEmail"), phone: value(formData, "phone"), analyticsEnabled: checked(formData, "analyticsEnabled") });
  if (!parsed.success) throw new Error("Check the global settings.");
  const { error } = await supabase.from("site_settings").update({ company_name: parsed.data.companyName, tagline: parsed.data.tagline, intro: parsed.data.intro, location_label: parsed.data.locationLabel, contact_email: parsed.data.contactEmail || null, phone: parsed.data.phone || null, analytics_enabled: parsed.data.analyticsEnabled, updated_by: userId }).eq("id", true);
  if (error) throw new Error("We could not save the settings.");
  refreshPublicRoutes();
  redirect("/admin/settings");
}

export async function savePrivacyAction(formData: FormData) {
  const { supabase, userId } = await getAdminContext();
  const title = value(formData, "privacyTitle").trim();
  const content = value(formData, "privacyContent").trim();
  if (title.length < 2 || content.length < 80) throw new Error("Add a reviewed privacy title and detailed content before saving.");
  const { error } = await supabase.from("legal_pages").upsert({ slug: "privacy", title, content, is_published: checked(formData, "privacyPublished"), updated_by: userId });
  if (error) throw new Error("We could not save the privacy page.");
  refreshPublicRoutes();
  redirect("/admin/settings");
}

export async function updateInquiryAction(inquiryId: string, formData: FormData) {
  const { supabase } = await getAdminContext();
  const parsed = z.object({ status: z.enum(["new", "read", "archived"]), notes: z.string().trim().max(5000) }).safeParse({ status: value(formData, "status"), notes: value(formData, "notes") });
  if (!parsed.success) throw new Error("Check the inquiry status.");
  const { error } = await supabase.from("contact_submissions").update({ status: parsed.data.status, notes: parsed.data.notes || null }).eq("id", inquiryId);
  if (error) throw new Error("We could not update that inquiry.");
  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}