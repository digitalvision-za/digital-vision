import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="site-shell page-intro">
        <div><p className="eyebrow">404</p><h1 className="display">That page is not part of the picture.</h1></div>
        <div className="page-intro-copy"><p>The route may have moved, or it was never published.</p><Link className="text-link" href="/">Return home <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
    </PublicShell>
  );
}