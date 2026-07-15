"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";

const navigation = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-shell site-header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              className={pathname === item.href ? "nav-link nav-link--active" : "nav-link"}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/contact">
          Start a project <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className="menu-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      <div className={isOpen ? "mobile-nav mobile-nav--open" : "mobile-nav"} id="mobile-navigation">
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          ))}
          <Link className="button button--primary" href="/contact" onClick={() => setIsOpen(false)}>
            Start a project <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}