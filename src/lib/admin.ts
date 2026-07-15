import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminContext = {
  userId: string;
  email: string;
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>;
};

export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin/login?configuration=required");
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "owner") {
    redirect("/admin/login?authorization=required");
  }

  return { userId: user.id, email: user.email ?? "Owner", supabase };
});

export const getOptionalOwner = cache(async () => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role === "owner" ? user : null;
});

export async function getAdminDashboardData() {
  const { supabase } = await getAdminContext();
  const [projects, services, pricing, inquiries, settings, legalPage] = await Promise.all([
    supabase.from("projects").select("id, title, slug, status, is_featured, updated_at").order("updated_at", { ascending: false }),
    supabase.from("services").select("id, title, description, deliverables, is_visible, sort_order").order("sort_order"),
    supabase.from("pricing_items").select("id, title, description, starting_price, currency, qualifier, is_visible, sort_order").order("sort_order"),
    supabase.from("contact_submissions").select("id, name, business_name, email, project_type, budget, message, status, created_at, notes").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("legal_pages").select("*").eq("slug", "privacy").maybeSingle(),
  ]);

  return {
    projects: projects.data ?? [],
    services: services.data ?? [],
    pricing: pricing.data ?? [],
    inquiries: inquiries.data ?? [],
    settings: settings.data,
    privacyPage: legalPage.data,
  };
}

export async function getAdminProject(projectId: string) {
  const { supabase } = await getAdminContext();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", projectId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    project_images: [...(data.project_images ?? [])].sort((left, right) => left.sort_order - right.sort_order),
  };
}