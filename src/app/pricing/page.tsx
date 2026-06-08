import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, IcoArrow, IcoCheck } from "../components/ui";
import { pricingOffers, FAQ } from "./pricing-data";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "Tarifs — LueurStudio | Photographe Paris",
  description: "Formules de photographie claires et transparentes : séance express, formule signature ou événement sur devis. Portrait, réseaux sociaux, mariage.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap">
          <Reveal as="span" className="kicker">Tarifs · 2025</Reveal>
          <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "16ch" }}>
            Des formules transparentes,<br />sans surprise.
          </Reveal>
          <Reveal className="lede" delay={2} style={{ marginTop: 24, maxWidth: "60ch" }}>
            Trois offres adaptées à vos besoins — du portrait express au reportage complet. Devis gratuit sous 24h.
          </Reveal>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(60px,8vh,100px)" }}>
        <div className="wrap">
          <div className="pr-grid">
            {pricingOffers.map((offer, i) => (
              <Reveal key={offer.id} delay={((i % 3) + 1) as 1 | 2 | 3} className={"pr-card" + (offer.featured ? " feat" : "")}>
                {offer.featured && <span className="price-badge">Populaire</span>}
                <div style={{ marginBottom: 6 }}>
                  <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{offer.unit}</span>
                </div>
                <h2 className="display pr-name">{offer.name}</h2>
                <div className="price-big gold-text display">{offer.price}</div>
                <p className="muted pr-desc">{offer.desc}</p>
                <ul className="pr-feats">
                  {offer.features.map((f) => (
                    <li key={f}><IcoCheck />{f}</li>
                  ))}
                </ul>
                <Link
                  className={"btn " + (offer.featured ? "btn-gold" : "btn-outline")}
                  href="/reservation"
                  style={{ marginTop: "auto", width: "100%", justifyContent: "center" }}
                >
                  {offer.price === "Sur devis" ? "Demander un devis" : "Réserver"} <IcoArrow />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal>
            <span className="kicker">FAQ</span>
            <h2 className="display" style={{ marginTop: 20, maxWidth: "20ch" }}>Questions fréquentes</h2>
          </Reveal>
          <div className="faq-list" style={{ marginTop: 48 }}>
            {FAQ.map((item, i) => (
              <Reveal key={i} className="faq-item">
                <h3 className="faq-q">{item.q}</h3>
                <p className="faq-a muted">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
