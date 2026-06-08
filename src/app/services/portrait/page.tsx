import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck } from "../../components/ui";
import CTABand from "../../components/CTABand";

export const metadata: Metadata = {
  title: "Photographe Portrait Paris — LueurStudio",
  description: "Shooting portrait professionnel à Paris : portraits LinkedIn, artistiques, personnels. Direction artistique, retouche naturelle, livraison 48h.",
  openGraph: {
    title: "Shooting Portrait Professionnel Paris — LueurStudio",
    description: "Portraits professionnels à Paris : LinkedIn, artistiques, personnels. Direction artistique, retouche naturelle, livraison 48h.",
    url: "https://www.lueurstudio-photographie.fr/services/portrait",
  },
  alternates: { canonical: "/services/portrait" },
};

const FEATURES = [
  { title: "Direction artistique", desc: "Moodboard personnalisé, conseil sur les tenues et le lieu, coaching pose sur place pour des résultats naturels." },
  { title: "Retouche naturelle", desc: "Travail de peau respectueux, calibration colorimétrique précise. Sublimer sans dénaturer." },
  { title: "Livraison rapide", desc: "Sélection des meilleures images sous 48h. Retouche finale sous 72h. Exports HD et web inclus." },
];

const TARGETS = [
  { label: "Entrepreneurs & dirigeants", desc: "Photo de profil LinkedIn, site web, presse professionnelle." },
  { label: "Artistes & créateurs", desc: "Dossier artistique, book, présence en ligne." },
  { label: "Personnes privées", desc: "Portrait personnel, souvenir, cadeau original." },
  { label: "Équipes & entreprises", desc: "Portraits cohérents pour toute une équipe, en studio ou sur site." },
];

export default function PortraitServicePage() {
  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Shooting Portrait Professionnel Paris",
            description: "Service de photographie portrait professionnel à Paris.",
            provider: { "@type": "Organization", name: "LueurStudio", url: "https://www.lueurstudio-photographie.fr" },
            areaServed: { "@type": "City", name: "Paris" },
          }),
        }}
      />

      <section className="page-head">
        <div className="wrap">
          <div className="ab-hero">
            <div>
              <Reveal as="span" className="kicker">Portrait · Paris</Reveal>
              <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
                Des portraits qui <span className="serif-italic gold-text">révèlent</span>.
              </Reveal>
              <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
                LinkedIn, book artistique ou usage personnel — des images soignées qui font la différence, avec une direction artistique de bout en bout.
              </Reveal>
              <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 34, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" href="/reservation">Réserver mon portrait <IcoArrow /></Link>
                <Link className="btn btn-outline" href="/portfolio">Voir les portraits <IcoArrowUpRight size={15} /></Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="frame ratio-45" style={{ maxWidth: 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/portrait-2.webp" alt="Portrait professionnel Paris" />
                <div className="corner" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal>
            <span className="kicker">Points forts</span>
            <h2 className="display" style={{ marginTop: 20, maxWidth: "18ch" }}>Tout ce qui fait la différence</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 40 }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3} className="surface-card" style={{ padding: "clamp(24px,3vw,38px)" }}>
                <h3 className="display" style={{ fontSize: "1.6rem" }}>{f.title}</h3>
                <p className="muted" style={{ marginTop: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal>
            <span className="kicker">Pour qui ?</span>
            <h2 className="display" style={{ marginTop: 20 }}>Un portrait pour chaque projet</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14, marginTop: 40 }}>
            {TARGETS.map((t, i) => (
              <Reveal key={t.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="surface-card" style={{ padding: "clamp(20px,2.5vw,30px)" }}>
                <h4 className="display" style={{ fontSize: "1.25rem" }}>{t.label}</h4>
                <p className="muted" style={{ marginTop: 10, fontSize: "0.93rem", lineHeight: 1.65 }}>{t.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal>
            <span className="kicker">Tarifs · Portrait</span>
            <h2 className="display" style={{ marginTop: 20 }}>Des formules claires</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 40 }}>
            {[
              { name: "Séance Express", price: "90€", features: ["45 minutes", "10 photos retouchées", "Livraison 48h", "Galerie privée", "Exports HD + web"] },
              { name: "Formule Signature", price: "180€", features: ["1h30", "25 photos retouchées", "Moodboard personnalisé", "Direction artistique", "Livraison 72h", "Exports HD + web"], feat: true },
            ].map((o) => (
              <Reveal key={o.name} className={"pr-card" + (o.feat ? " feat" : "")}>
                {o.feat && <span className="price-badge">Populaire</span>}
                <h3 className="display pr-name">{o.name}</h3>
                <div className="price-big gold-text display">{o.price}</div>
                <ul className="pr-feats">
                  {o.features.map((f) => <li key={f}><IcoCheck />{f}</li>)}
                </ul>
                <Link className={"btn " + (o.feat ? "btn-gold" : "btn-outline")} href="/reservation" style={{ marginTop: "auto", justifyContent: "center", width: "100%" }}>
                  Réserver <IcoArrow />
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 28 }}>
            <Link className="btn btn-ghost" href="/pricing">Voir toutes les formules <IcoArrow /></Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
