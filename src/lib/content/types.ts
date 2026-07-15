export type PublishState = "draft" | "published";

export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  isVisible: boolean;
  sortOrder: number;
};

export type PricingItem = {
  id: string;
  title: string;
  description: string;
  startingPrice: number | null;
  currency: string;
  qualifier: string;
  isVisible: boolean;
  sortOrder: number;
};

export type ProjectImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  projectUrl: string | null;
  services: string[];
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  testimonialRole: string | null;
  status: PublishState;
  isFeatured: boolean;
  publishedAt: string | null;
  images: ProjectImage[];
};

export type SiteSettings = {
  companyName: string;
  tagline: string;
  contactEmail: string | null;
  phone: string | null;
  locationLabel: string;
  intro: string;
  analyticsEnabled: boolean;
};

export type LegalPage = {
  slug: "privacy" | "terms";
  title: string;
  content: string;
  isPublished: boolean;
  updatedAt: string | null;
};

export type PublicSiteData = {
  settings: SiteSettings;
  services: Service[];
  pricing: PricingItem[];
  projects: Project[];
};

export type ContactSubmission = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
};