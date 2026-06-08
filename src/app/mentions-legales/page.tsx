import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = {
  title: "Mentions légales — LueurStudio",
  description:
    "Mentions légales de LueurStudio : éditeur du site, directeur de publication, hébergement et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <div className="page">
      <section style={{ paddingTop: "clamp(100px,12vh,160px)", paddingBottom: "clamp(60px,8vh,120px)" }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <span className="kicker">Légal</span>
          <h1 className="display" style={{ marginTop: 18, fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            Mentions <span className="serif-italic gold-text">légales</span>
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN).
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>1. Éditeur du site</h2>
              <div style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: 6 }}>
                <p><strong>LueurStudio</strong> — Photographe indépendant</p>
                <p>Activité exercée à titre individuel</p>
                <p>Localisation : Paris, Île-de-France</p>
                <p>
                  Contact :{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>
                  Instagram :{" "}
                  <a href="https://www.instagram.com/lueurstudio91/" target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                    @lueurstudio91
                  </a>
                </p>
              </div>
            </div>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>2. Directeur de la publication</h2>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                Le directeur de la publication est le responsable de LueurStudio, joignable à l&apos;adresse e-mail indiquée ci-dessus.
              </p>
            </div>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>3. Hébergement</h2>
              <div style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: 6 }}>
                <p>Le présent site est hébergé par :</p>
                <p>
                  <strong>Vercel Inc.</strong><br />
                  340 Pine Street, Suite 900, San Francisco, CA 94104 — États-Unis<br />
                  <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                    vercel.com
                  </a>
                </p>
                <p>
                  La base de données et le stockage de fichiers sont assurés par :{" "}
                  <strong>Supabase Inc.</strong> — données hébergées sur des serveurs situés en Europe (Frankfurt, Allemagne).
                </p>
              </div>
            </div>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>4. Propriété intellectuelle</h2>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                L&apos;ensemble des contenus présents sur ce site (photographies, textes, éléments graphiques, logo, charte
                visuelle) est la propriété exclusive de LueurStudio et est protégé par le droit d&apos;auteur (Code de la
                propriété intellectuelle). Toute reproduction, représentation, modification, publication ou adaptation,
                totale ou partielle, sans autorisation écrite préalable de LueurStudio est strictement interdite et
                constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la
                propriété intellectuelle.
              </p>
            </div>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>5. Responsabilité</h2>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                LueurStudio s&apos;efforce de fournir des informations fiables et à jour. Cependant, l&apos;éditeur ne peut garantir
                l&apos;exactitude, l&apos;exhaustivité ou l&apos;actualité des informations publiées et décline toute responsabilité
                quant aux erreurs ou omissions. Les liens hypertextes présents sur le site peuvent renvoyer vers des
                sites tiers dont LueurStudio ne contrôle pas le contenu.
              </p>
            </div>

            <div className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>6. Données personnelles & cookies</h2>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                Le traitement des données personnelles est décrit dans la{" "}
                <Link href="/politique-confidentialite" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                  politique de confidentialité
                </Link>
                . Ce site n&apos;utilise aucun cookie de tracking ni outil d&apos;analyse d&apos;audience.
              </p>
            </div>

          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link className="btn btn-outline" href="/">← Accueil</Link>
            <Link className="btn btn-ghost" href="/politique-confidentialite">Politique de confidentialité</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
