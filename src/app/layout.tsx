import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "./site.css";
import "./pages.css";
import "./admin.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Digital Visions | Websites with a clearer point of view",
    template: "%s | Digital Visions",
  },
  description:
    "Digital Visions designs, rebuilds, and supports considered websites for South African businesses.",
  openGraph: {
    title: "Digital Visions",
    description:
      "Websites with a clearer point of view. Designed in Cape Town, for businesses across South Africa.",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === "true" && <Analytics />}
      </body>
    </html>
  );
}
