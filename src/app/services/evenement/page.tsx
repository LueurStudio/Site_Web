import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck } from "../../components/ui";
import CTABand from "../../components/CTABand";

export const metadata: Metadata = {
  title: "Photographe Événement Paris — LueurStudio",
  description: "Reportage photo pour mariages, conférences, festivals et événements d'entreprise à Paris. Narration visuelle discrète et énergique. Livraison rapide.",
  openGraph: {
    title: "Photographe Événementiel Paris — LueurStudio",
    description: "Reportages vibrants pour mariages, conférences, festivals. Narration visuelle discrète et énergique.",
    url: "https://www.lueurstudio-photographie.fr/services/evenement",
  },
  alternates: { canonical: "/services/evenement" },
};

const FEATURES = [
  { title: "Photojournalisme", desc: "Approche discrète et réactive — chaque moment spontané capturé, sans interruption, sans mise en scène." },
  { title: "Coordination", desc: "Brief en amont, planning détaillé, repérage du lieu si besoin. Zéro surprise le jour J." },
  { title: "Livraison soignée", desc: "Tri, sélection et retouche de toutes les images livrées. Galerie partageable sous 5 jours." },
];

const TARGETS = [
  { label: "Mariages & unions", desc: "Reportage complet de la cérémonie au dîner, souvenirs impérissables." },
  { label: "Événements corporate", desc: "Conférences, inaugurations, séminaires, teambuildings." },
  { label: "Festivals & concerts", desc: "Capturer l'énergie, la foule, les moments forts scène et coulisses." },
  { label: "Événements privés", desc: "Anniversaires, baptêmes, réunions de famille mémorables." },
];

export default function EvenementServicePage() {
  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap">
          <div className="ab-hero">
            <div>
              <Reveal as="span" className="kicker">Événement · Reportage</Reveal>
              <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
                Chaque moment <span className="serif-italic gold-text">vivant</span>.
              </Reveal>
              <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
                Reportages vibrants pour mariages, conférences, festivals. Narration visuelle discrète et énergique qui capture l&apos;essentiel.
              </Reveal>
              <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 34, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" href="/reservation">Demander un devis <IcoArrow /></Link>
                <Link className="btn btn-outline" href="/portfolio">Voir les reportages <IcoArrowUpRight size={15} /></Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="frame ratio-45" style={{ maxWidth: 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/extra-1.webp" alt="Photographie événementielle Paris" />
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
            <h2 className="display" style={{ marginTop: 20, maxWidth: "18ch" }}>Présent, discret, précis</h2>
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
            <h2 className="display" style={{ marginTop: 20 }}>Tous types d&apos;événements</h2>
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
            <span className="kicker">Tarifs · Événement</span>
            <h2 className="display" style={{ marginTop: 20 }}>Sur mesure</h2>
          </Reveal>
          <Reveal delay={1} className="surface-card" style={{ padding: "clamp(32px,4vw,52px)", marginTop: 40, display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <div className="price-big gold-text display">Sur devis</div>
              <p className="muted" style={{ marginTop: 12, maxWidth: "60ch", lineHeight: 1.7 }}>
                Chaque événement est unique. Le tarif dépend de la durée, du lieu et des besoins spécifiques. Je vous envoie un devis détaillé sous 24h.
              </p>
            </div>
            <ul className="pr-feats" style={{ maxWidth: "50ch" }}>
              {["Présence sur l'événement", "Reportage complet", "Sélection + retouche soignée", "Galerie privée partageable", "Exports impression & web", "Option second photographe disponible"].map((f) => (
                <li key={f}><IcoCheck />{f}</li>
              ))}
            </ul>
            <Link className="btn btn-gold" href="/reservation" style={{ alignSelf: "flex-start" }}>
              Demander un devis <IcoArrow />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
