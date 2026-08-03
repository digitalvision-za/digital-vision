"use server";

import { headers } from "next/headers";
import { z } from "zod";
import type { ContactSubmission } from "@/lib/content/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type InquiryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fields?: Partial<Record<keyof ContactSubmission, string[]>>;
};

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please add your name.").max(120),
  businessName: z.string().trim().max(160),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  phone: z.string().trim().max(60),
  projectType: z.string().trim().max(100),
  budget: z.string().trim().max(100),
  message: z.string().trim().min(10, "Please share a little more about the project.").max(5000),
});

const initialRateWindow = 60 * 60 * 1000;
const requestLimits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ipAddress: string) {
  const now = Date.now();
  const current = requestLimits.get(ipAddress);

  if (!current || current.resetAt <= now) {
    requestLimits.set(ipAddress, { count: 1, resetAt: now + initialRateWindow });
    return false;
  }

  if (current.count >= 5) {
    return true;
  }

  current.count += 1;
  return false;
}

export async function submitInquiry(
  _previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const website = String(formData.get("website") ?? "").trim();

  if (website) {
    return { status: "success", message: "Thanks. Your message has been received." };
  }

  const requestHeaders = await headers();
  const ipAddress = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ipAddress)) {
    return {
      status: "error",
      message: "Please wait a little before sending another inquiry.",
    };
  }

  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    businessName: formData.get("businessName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    projectType: formData.get("projectType"),
    budget: formData.get("budget"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted details.",
      fields: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createServiceRoleClient();

  if (!supabase) {
    return {
      status: "error",
      message: "The secure inquiry inbox has not been configured yet. Please try again after setup is complete.",
    };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    business_name: parsed.data.businessName || null,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    project_type: parsed.data.projectType || null,
    budget: parsed.data.budget || null,
    message: parsed.data.message,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not save your inquiry. Please try again shortly.",
    };
  }

  return {
    status: "success",
    message: "Thanks. Your inquiry is safely in the Digital Visions inbox.",
  };
}