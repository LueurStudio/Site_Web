"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IcoArrow } from "./ui";

const NAV = [
  { id: "home", label: "Accueil", href: "/" },
  { id: "portfolio", label: "Portfolio", href: "/portfolio" },
  { id: "pricing", label: "Tarifs", href: "/pricing" },
  { id: "about", label: "À propos", href: "/a-propos" },
  { id: "blog", label: "Journal", href: "/blog" },
  { id: "testimonials", label: "Avis", href: "/testimonials" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label="LueurStudio — accueil">
          <span className="brand-tile">
            <Image src="/images/logo.svg" alt="LueurStudio" width={44} height={44} />
          </span>
          <span className="brand-name">
            <b>LueurStudio</b>
            <span>Photographie · Paris</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.id} href={n.href} className={isActive(n.href) ? "active" : ""}>{n.label}</Link>
          ))}
        </nav>

        <div className="header-cta">
          <Link className="btn btn-gold" href="/reservation">Réserver <IcoArrow /></Link>
          <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <div className="wrap" style={{ paddingBlock: 18, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((n) => (
              <Link key={n.id} href={n.href} style={{
                padding: "12px 4px", fontSize: "1.05rem",
                color: isActive(n.href) ? "var(--accent)" : "var(--fg-soft)",
                borderBottom: "1px solid var(--line)",
              }}>{n.label}</Link>
            ))}
            <Link className="btn btn-gold" style={{ marginTop: 14, justifyContent: "center" }} href="/reservation">
              Réserver un shooting
            </Link>
            <a href="https://www.instagram.com/lueurstudio91/" target="_blank" rel="noreferrer"
              style={{ padding: "12px 4px", color: "var(--muted)", fontFamily: "var(--ff-mono)", fontSize: 12 }}>
              @lueurstudio91
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
