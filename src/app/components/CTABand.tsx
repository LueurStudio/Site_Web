import Link from "next/link";
import { Reveal, IcoArrow } from "./ui";

export default function CTABand() {
  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal
          className="grid"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface)",
            padding: "clamp(40px,6vw,80px)",
            textAlign: "center",
            placeItems: "center",
            gap: 22,
          }}
        >
          <span className="kicker no-rule">Premier échange offert</span>
          <h2 className="display" style={{ maxWidth: "16ch" }}>
            Créons quelque chose <span className="serif-italic gold-text">d&apos;unique</span> ensemble.
          </h2>
          <p className="lede" style={{ textAlign: "center", margin: "0 auto" }}>
            Partagez votre projet, vos envies, vos dates. Réponse sous 24–48h avec une proposition sur mesure.
          </p>
          <div className="flex" style={{ gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Link className="btn btn-gold" href="/reservation">Demander un devis <IcoArrow /></Link>
            <Link className="btn btn-outline" href="/portfolio">Voir le portfolio</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
