const defaultSiteUrl = "https://digitalvisions.co.za";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(defaultSiteUrl);
  }

  try {
    const siteUrl = new URL(configuredUrl);

    return siteUrl.protocol === "https:" || siteUrl.protocol === "http:"
      ? siteUrl
      : new URL(defaultSiteUrl);
  } catch {
    return new URL(defaultSiteUrl);
  }
}