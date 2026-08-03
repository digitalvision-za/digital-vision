import type { LegalPage, PricingItem, PublicSiteData, Service, SiteSettings } from "./types";

export const defaultSettings: SiteSettings = {
  companyName: "Digital Visions",
  tagline: "Websites with a clearer point of view.",
  contactEmail: null,
  phone: null,
  locationLabel: "Cape Town, serving South Africa",
  intro:
    "Digital Visions designs, rebuilds, and cares for considered websites that make a good first impression feel inevitable.",
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
    id: "launch-page",
    title: "Launch page",
    description:
      "A focused, high-conviction page for a new offer, campaign, or small business that needs a credible place to send people.",
    startingPrice: 7900,
    currency: "ZAR",
    qualifier: "From",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "business-website",
    title: "Business website",
    description:
      "A considered multi-page website for a growing service business ready to turn more visits into useful enquiries.",
    startingPrice: 16900,
    currency: "ZAR",
    qualifier: "From",
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "custom-website",
    title: "E-commerce and custom",
    description:
      "Stores, product catalogues, migrations, and larger digital work are scoped around the systems and content they actually need.",
    startingPrice: null,
    currency: "ZAR",
    qualifier: "Custom scope",
    isVisible: true,
    sortOrder: 3,
  },
];

export const defaultPrivacyPage: LegalPage = {
  slug: "privacy",
  title: "Privacy",
  content:
    "This page is a publishing placeholder. Before launch, add your reviewed privacy notice in the owner dashboard. It should explain contact-form data, any analytics, retention, and how people can contact Digital Visions about their information.",
  isPublished: false,
  updatedAt: null,
};

export const defaultPublicSiteData: PublicSiteData = {
  settings: defaultSettings,
  services: defaultServices,
  pricing: defaultPricing,
  projects: [],
};