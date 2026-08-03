import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-top">
        <div>
          <Brand />
          <p>Designed in Cape Town for businesses across South Africa.</p>
        </div>
        <Link className="footer-contact" href="/contact">
          Start a conversation <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <div className="site-shell footer-bottom">
        <p>&copy; {new Date().getFullYear()} Digital Visions</p>
        <div>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}