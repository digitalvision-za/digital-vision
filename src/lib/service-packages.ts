export const servicePackageDetails = {
  "launch-page": {
    bestFor: "A new offer, campaign, or small business that needs a credible place to send people.",
    timing: "7-10 business days",
    includes: ["One tailored page", "Mobile-first design and build", "Enquiry form and WhatsApp link", "Basic on-page SEO", "One revision round"],
  },
  "business-website": {
    bestFor: "A growing service business ready for a considered online home and clearer enquiries.",
    timing: "3-4 weeks",
    includes: ["Up to 6 core pages", "Custom design system", "Enquiry forms and key integrations", "Basic SEO and analytics setup", "Two revision rounds"],
  },
  "website-rebuild": {
    bestFor: "A business with usable content but a dated site, unclear structure, or weak mobile experience.",
    timing: "2-3 weeks",
    includes: ["Up to 5 refreshed core pages", "Homepage and navigation rethink", "Mobile-first redesign", "Content migration from the current site", "Basic SEO tidy-up and one revision round"],
  },
  "custom-website": {
    bestFor: "E-commerce, product catalogues, migrations, and work with a more involved technical or content scope.",
    timing: "Scoped with you",
    includes: ["E-commerce and product catalogues", "Content migration or product entry", "Payment and third-party integrations", "A delivery plan for the real scope", "A tailored investment proposal"],
  },
} as const;

export function getServicePackageDetails(packageId: string) {
  return servicePackageDetails[packageId as keyof typeof servicePackageDetails];
}