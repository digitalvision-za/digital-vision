import type { LegalPage, PricingItem, PublicSiteData, Service, SiteSettings } from "./types";

export const defaultSettings: SiteSettings = {
  companyName: "Digital Vision",
  tagline: "Websites with a clearer point of view.",
  contactEmail: null,
  phone: null,
  locationLabel: "Cape Town, serving South Africa",
  intro:
    "Digital Vision designs, rebuilds, and cares for considered websites that make a good first impression feel inevitable.",
  analyticsEnabled: false,
};

export const defaultServices: Service[] = [
  {
    id: "new-websites",
    title: "New websites",
    description:
      "A considered home for a business that is ready to be found, understood, and chosen.",
    deliverables: ["Strategy", "Design", "Build"],
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "website-rebuilds",
    title: "Website rebuilds",
    description:
      "Clearer structure, better mobile experiences, and a presence that has caught up with your work.",
    deliverables: ["Audit", "Redesign", "Migration"],
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "ongoing-care",
    title: "Ongoing care",
    description:
      "Practical support for the website after launch, so it stays useful as the business changes.",
    deliverables: ["Updates", "Improvements", "Support"],
    isVisible: true,
    sortOrder: 3,
  },
];

export const defaultPricing: PricingItem[] = [
  {
    id: "pricing-guidance",
    title: "Project investment",
    description:
      "Every scope begins with the right questions. Add an approved starting figure in the owner dashboard when you are ready to publish pricing guidance.",
    startingPrice: null,
    currency: "ZAR",
    qualifier: "Custom scope",
    isVisible: true,
    sortOrder: 1,
  },
];

export const defaultPrivacyPage: LegalPage = {
  slug: "privacy",
  title: "Privacy",
  content:
    "This page is a publishing placeholder. Before launch, add your reviewed privacy notice in the owner dashboard. It should explain contact-form data, any analytics, retention, and how people can contact Digital Vision about their information.",
  isPublished: false,
  updatedAt: null,
};

export const defaultPublicSiteData: PublicSiteData = {
  settings: defaultSettings,
  services: defaultServices,
  pricing: defaultPricing,
  projects: [],
};