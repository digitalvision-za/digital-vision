import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { getPublicLegalPage } from "@/lib/content/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Digital Visions privacy information.",
};

export default async function PrivacyPage() {
  const page = await getPublicLegalPage("privacy");

  return (
    <PublicShell>
      <article className="site-shell legal-content">
        <p className="eyebrow">Legal</p>
        <h1 className="display">{page?.title ?? "Privacy"}</h1>
        {page?.content.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {page?.updatedAt && <p className="legal-updated">Last updated {new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date(page.updatedAt))}</p>}
      </article>
    </PublicShell>
  );
}