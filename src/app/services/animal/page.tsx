import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck } from "../../components/ui";
import CTABand from "../../components/CTABand";

export const metadata: Metadata = {
  title: "Photographe Animalier Paris — LueurStudio",
  description: "Portraits d'animaux de compagnie et sauvages à Paris. Captures émotionnelles révélant leur personnalité unique. Studio mobile ou extérieur. Livraison 48h.",
  openGraph: {
    title: "Photographe Animalier Paris — LueurStudio",
    description: "Portraits d'animaux de compagnie et sauvages. Captures émotionnelles révélant leur personnalité unique.",
    url: "https://www.lueurstudio-photographie.fr/services/animal",
  },
  alternates: { canonical: "/services/animal" },
};

const FEATURES = [
  { title: "Approche douce", desc: "Patience et respect du rythme de l'animal. Pas de stress, des poses naturelles et des expressions authentiques." },
  { title: "Studio / Extérieur", desc: "Séances possibles en studio mobile chez vous, ou en extérieur dans un cadre qui correspond à votre animal." },
  { title: "Retouche naturelle", desc: "Rendu naturaliste du pelage, des yeux, de la fourrure. Chaque photo valorise l'animal tel qu'il est." },
];

const TARGETS = [
  { label: "Chiens & chats", desc: "La majorité des séances — en intérieur ou en parc, selon l'animal." },
  { label: "Chevaux & équidés", desc: "Séances sur site, en box ou en extérieur avec lumière naturelle." },
  { label: "NAC (nouveaux animaux)", desc: "Lapins, reptiles, oiseaux, rongeurs — contact pour étudier la faisabilité." },
  { label: "Animaux sauvages", desc: "Reportage animalier sur demande — faune locale ou en parc animalier." },
];

export default function AnimalServicePage() {
  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap">
          <div className="ab-hero">
            <div>
              <Reveal as="span" className="kicker">Animalier · Portrait</Reveal>
              <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
                Leur personnalité, <span className="serif-italic gold-text">révélée</span>.
              </Reveal>
              <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
                Portraits d&apos;animaux de compagnie et sauvages. Des captures émotionnelles qui révèlent leur personnalité unique, avec patience et douceur.
              </Reveal>
              <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 34, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" href="/reservation">Réserver une séance <IcoArrow /></Link>
                <Link className="btn btn-outline" href="/portfolio">Voir les portraits <IcoArrowUpRight size={15} /></Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="frame ratio-45" style={{ maxWidth: 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/animal-1.webp" alt="Portrait animalier Paris" />
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
            <h2 className="display" style={{ marginTop: 20, maxWidth: "18ch" }}>Une approche pensée pour eux</h2>
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
            <h2 className="display" style={{ marginTop: 20 }}>Tous les animaux</h2>
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
            <span className="kicker">Tarifs · Animalier</span>
            <h2 className="display" style={{ marginTop: 20 }}>Des formules simples</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 40 }}>
            {[
              { name: "Séance Animaux", price: "90€", features: ["1h de shooting", "10 photos retouchées", "Studio mobile ou extérieur", "Livraison 48h", "Exports HD + web"] },
              { name: "Portrait Signature", price: "150€", features: ["2h de shooting", "20 photos retouchées", "Lieu au choix", "Retouche approfondie", "Tirage offert au format A4", "Livraison 72h"], feat: true },
            ].map((o) => (
              <Reveal key={o.name} className={"pr-card" + (o.feat ? " feat" : "")}>
                {o.feat && <span className="price-badge">Recommandé</span>}
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
