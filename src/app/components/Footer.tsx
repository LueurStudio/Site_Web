import Link from "next/link";
import Image from "next/image";
import { IcoInstagram, IcoArrow } from "./ui";

const NAV = [
  { id: "home", label: "Accueil", href: "/" },
  { id: "portfolio", label: "Portfolio", href: "/portfolio" },
  { id: "pricing", label: "Tarifs", href: "/pricing" },
  { id: "about", label: "À propos", href: "/a-propos" },
  { id: "blog", label: "Journal", href: "/blog" },
  { id: "testimonials", label: "Avis", href: "/testimonials" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" aria-label="LueurStudio — accueil">
              <span className="brand-tile">
                <Image src="/images/logo.svg" alt="LueurStudio" width={44} height={44} />
              </span>
              <span className="brand-name">
                <b>LueurStudio</b>
                <span>Photographie · Paris</span>
              </span>
            </Link>
            <p className="lede" style={{ marginTop: 22, maxWidth: "34ch", fontSize: "1.02rem" }}>
              Photographie, retouche &amp; direction artistique haut de gamme. Basé à Paris, disponible partout.
            </p>
            <div className="flex" style={{ gap: 10, marginTop: 26 }}>
              <a className="btn btn-outline" href="https://www.instagram.com/lueurstudio91/" target="_blank" rel="noreferrer">
                <IcoInstagram /> Instagram
              </a>
              <Link className="btn btn-gold" href="/reservation">Bookez une date <IcoArrow /></Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            {NAV.map((n) => (
              <Link key={n.id} href={n.href}>{n.label}</Link>
            ))}
            <Link href="/reservation">Réservation</Link>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:lueurstudio.contact@gmail.com">lueurstudio.contact@gmail.com</a>
            <a href="https://www.instagram.com/lueurstudio91/" target="_blank" rel="noreferrer">@lueurstudio91</a>
            <span style={{ display: "block", color: "var(--muted)", padding: "6px 0" }}>Paris · Île-de-France</span>
            <div style={{ marginTop: 18 }}>
              <Link href="/mentions-legales" style={{ fontSize: 13 }}>Mentions légales</Link>
              <Link href="/politique-confidentialite" style={{ fontSize: 13 }}>Politique de confidentialité</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LueurStudio</span>
          <span>Photographie · Paris</span>
          <span>Paris · FR</span>
        </div>
      </div>
    </footer>
  );
}
