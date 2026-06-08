import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck } from "../../components/ui";
import CTABand from "../../components/CTABand";

export const metadata: Metadata = {
  title: "Photographe Instagram & Réseaux Sociaux Paris — LueurStudio",
  description: "Contenus photo professionnels pour Instagram, créateurs et marques à Paris. Images modernes, impactantes, optimisées feed et stories. Livraison 48h.",
  openGraph: {
    title: "Shooting Instagram & Réseaux Sociaux Paris — LueurStudio",
    description: "Contenus photo pour Instagram, créateurs et marques. Images modernes, impactantes, optimisées feed et stories.",
    url: "https://www.lueurstudio-photographie.fr/services/instagram-reseaux",
  },
  alternates: { canonical: "/services/instagram-reseaux" },
};

const FEATURES = [
  { title: "Feed & Stories", desc: "Formats verticaux, carrés, paysages — tous les formats livrés en une seule séance pour alimenter plusieurs semaines de contenu." },
  { title: "Direction éditoriale", desc: "Cohérence visuelle sur l'ensemble du feed, palette de couleurs, direction lumière adaptée à votre univers de marque." },
  { title: "Optimisé digital", desc: "Export web optimisé, couleurs calibrées écran, fichiers JPEG compressés sans perte de qualité visible." },
];

const TARGETS = [
  { label: "Créateurs & influenceurs", desc: "Contenus réguliers pour maintenir une présence qualitative sur les réseaux." },
  { label: "Marques & boutiques", desc: "Photos produits, lifestyle, campagnes visuelles pour le digital." },
  { label: "Professionnels bien-être", desc: "Portraits de marque et visuels pour cabinet ou studio." },
  { label: "Restaurateurs & chefs", desc: "Photos culinaires et ambiance pour vos réseaux et menus." },
];

export default function InstagramServicePage() {
  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap">
          <div className="ab-hero">
            <div>
              <Reveal as="span" className="kicker">Instagram · Réseaux</Reveal>
              <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
                Un feed qui <span className="serif-italic gold-text">convertit</span>.
              </Reveal>
              <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
                Contenus photo modernes et impactants pour Instagram, creators et marques. Une session, des semaines de contenu.
              </Reveal>
              <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 34, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" href="/reservation">Réserver une séance réseaux <IcoArrow /></Link>
                <Link className="btn btn-outline" href="/portfolio">Voir le portfolio <IcoArrowUpRight size={15} /></Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="frame ratio-45" style={{ maxWidth: 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/insta-1.webp" alt="Photographie Instagram Paris" />
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
            <h2 className="display" style={{ marginTop: 20, maxWidth: "18ch" }}>Conçu pour le digital</h2>
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
            <h2 className="display" style={{ marginTop: 20 }}>Votre présence digitale mérite mieux</h2>
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
            <span className="kicker">Tarifs · Réseaux</span>
            <h2 className="display" style={{ marginTop: 20 }}>Des formules adaptées</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 40 }}>
            {[
              { name: "Pack Contenu", price: "90€", features: ["45 minutes", "10 visuels retouchés", "Formats feed + story", "Livraison 48h", "Exports optimisés web"] },
              { name: "Pack Signature", price: "180€", features: ["1h30", "25 visuels retouchés", "Moodboard éditorial", "Tous formats livrés", "Planning éditorial offert", "Livraison 72h"], feat: true },
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
