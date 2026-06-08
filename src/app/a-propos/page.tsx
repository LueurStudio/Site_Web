import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck, IcoInstagram } from "@/app/components/ui";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/config/contact";

export const metadata: Metadata = {
  title: "À propos — LueurStudio | Photographe Paris",
  description:
    "Photographe professionnel basé près de Paris, spécialisé en portrait, événement, animal et retouche haut de gamme. Ma vision, mon processus.",
  openGraph: {
    title: "À propos — LueurStudio | Photographe Professionnel Paris",
    description:
      "Découvrez LueurStudio : photographe professionnel basé près de Paris, spécialisé en portrait, événement et retouche haut de gamme.",
    url: "https://www.lueurstudio-photographie.fr/a-propos",
  },
  alternates: { canonical: "/a-propos" },
};

const TOOLS = [
  { label: "Adobe Lightroom", desc: "Étalonnage et traitement de masse. Cohérence colorimétrique sur l'ensemble d'un shooting." },
  { label: "Adobe Photoshop", desc: "Retouche de peau avancée, fréquences séparées, nettoyage de fond." },
  { label: "Studio mobile", desc: "Flash de studio, reflecteurs et modificateurs de lumière en toutes conditions." },
  { label: "Post-production", desc: "Exports multi-formats, profils ICC, optimisation web et impression grand format." },
];

const PROCESS = [
  { num: "01", title: "Écoute & brief", desc: "On commence toujours par un échange pour comprendre vos besoins et votre univers." },
  { num: "02", title: "Direction artistique", desc: "Moodboard, conseils de tenue, choix du lieu — tout est préparé avant le shooting." },
  { num: "03", title: "Shooting & direction", desc: "Sur place, je vous guide pour obtenir des résultats naturels et maîtrisés." },
  { num: "04", title: "Retouche & livraison", desc: "Chaque photo est traitée individuellement. Livraison sous 48–72h." },
];

const VALUES = [
  "Lumière naturelle ou artificielle — jamais arbitraire",
  "Direction modèle douce et précise",
  "Retouche naturelle, jamais artificielle",
  "Archivage 6 mois inclus",
];

export default function AProposPage() {
  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "LueurStudio",
            jobTitle: "Photographe Professionnel",
            description: "Photographe professionnel basé près de Paris, spécialisé en portrait, événement, photographie animalière et création de contenus pour réseaux sociaux.",
            url: "https://www.lueurstudio-photographie.fr",
            sameAs: [SOCIAL_LINKS.instagram],
            email: CONTACT_EMAIL,
          }),
        }}
      />

      <section className="page-head">
        <div className="wrap">
          <div className="ab-hero">
            <div>
              <Reveal as="span" className="kicker">À propos</Reveal>
              <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
                Derrière l&apos;objectif, une <span className="serif-italic gold-text">vision</span>.
              </Reveal>
              <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
                Photographe professionnel basé près de Paris. Portrait, événement, animal, réseaux — chaque projet traité avec la même exigence artistique.
              </Reveal>
              <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 34, flexWrap: "wrap" }}>
                <a className="btn btn-gold" href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                  <IcoInstagram size={16} /> Suivre sur Instagram
                </a>
                <Link className="btn btn-outline" href="/reservation">
                  Travailler ensemble <IcoArrow />
                </Link>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="frame ratio-45" style={{ maxWidth: 400 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/portrait-3.webp" alt="LueurStudio — photographe Paris" />
                <div className="corner" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div style={{ display: "grid", gap: "clamp(24px,3vw,48px)", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
            <Reveal>
              <div className="surface-card" style={{ padding: "clamp(28px,3.5vw,48px)", height: "100%" }}>
                <span className="kicker">Ma vision</span>
                <h2 className="display" style={{ marginTop: 20, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>La photographie comme langage</h2>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  <p className="muted" style={{ lineHeight: 1.75 }}>
                    Pour moi, une photo n&apos;est réussie que si elle provoque quelque chose&nbsp;: une émotion, un souvenir, un désir. Pas une démonstration technique — une connexion humaine.
                  </p>
                  <p className="muted" style={{ lineHeight: 1.75 }}>
                    C&apos;est cette conviction qui guide chaque shooting&nbsp;: prendre le temps de comprendre qui vous êtes, ce que vous voulez transmettre, et créer des images qui vous ressemblent vraiment.
                  </p>
                </div>
                <ul className="pr-feats" style={{ marginTop: 28 }}>
                  {VALUES.map((v) => <li key={v}><IcoCheck />{v}</li>)}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="surface-card" style={{ padding: "clamp(28px,3.5vw,48px)", height: "100%" }}>
                <span className="kicker">Mon approche</span>
                <h2 className="display" style={{ marginTop: 20, fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>Un processus transparent</h2>
                <div className="proc-grid" style={{ marginTop: 28, gridTemplateColumns: "1fr", gap: 16 }}>
                  {PROCESS.map((step) => (
                    <div key={step.num} className="proc-card" style={{ padding: "18px 20px" }}>
                      <span className="proc-num gold-text display" style={{ fontSize: "1rem" }}>{step.num}</span>
                      <h4 className="proc-title" style={{ fontSize: "1rem" }}>{step.title}</h4>
                      <p className="muted" style={{ fontSize: "0.9rem" }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal>
            <span className="kicker">Outils & compétences</span>
            <h2 className="display" style={{ marginTop: 20, maxWidth: "18ch" }}>Ce que j&apos;utilise pour livrer l&apos;excellence</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 40 }}>
            {TOOLS.map((t, i) => (
              <Reveal key={t.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="surface-card" style={{ padding: "clamp(20px,2.5vw,32px)", height: "100%" }}>
                  <h4 className="display" style={{ fontSize: "1.3rem" }}>{t.label}</h4>
                  <p className="muted" style={{ marginTop: 12, fontSize: "0.9rem", lineHeight: 1.7 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <hr className="rule" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(30px,5vw,80px)", alignItems: "center", paddingTop: 56 }}>
            <Reveal>
              <span className="kicker">Travaillons ensemble</span>
              <h2 className="display" style={{ marginTop: 20, maxWidth: "16ch", fontSize: "clamp(2rem,4vw,3.4rem)" }}>
                Un projet ? Parlons-en.
              </h2>
              <p className="lede" style={{ marginTop: 22 }}>
                Que vous ayez un projet précis ou une simple envie, je suis là pour vous accompagner. Premier échange toujours gratuit.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <div className="flex" style={{ flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
                <Link className="btn btn-gold" href="/reservation" style={{ width: "100%", justifyContent: "center" }}>
                  Réserver une séance <IcoArrow />
                </Link>
                <Link className="btn btn-outline" href="/portfolio" style={{ width: "100%", justifyContent: "center" }}>
                  Voir le portfolio <IcoArrowUpRight size={16} />
                </Link>
                <a className="btn btn-ghost" href={`mailto:${CONTACT_EMAIL}`} style={{ width: "100%", justifyContent: "center" }}>
                  {CONTACT_EMAIL}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
