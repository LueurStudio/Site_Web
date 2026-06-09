import Link from "next/link";
import { Reveal, IcoArrow, IcoArrowUpRight, Stars } from "./components/ui";
import BeforeAfter from "./components/BeforeAfter";
import CTABand from "./components/CTABand";
import { supabaseServer } from "@/lib/supabaseServer";

export const revalidate = 60;

const STATS = [
  { value: "20+", label: "Clients accompagnés" },
  { value: "98%", label: "Satisfaction" },
  { value: "48h", label: "Délai de livraison" },
  { value: "4", label: "Spécialités" },
];

const SERVICES = [
  { key: "Portrait", title: "Portrait", desc: "Portraits professionnels, artistiques et personnels. Lumière maîtrisée, direction précise, retouche naturelle.", badges: ["Studio mobile", "Lumière mixte", "Color grading"], image: "/images/portrait-2.webp", href: "/services/portrait" },
  { key: "Instagram", title: "Instagram / Réseaux", desc: "Contenus photo pour Instagram, créateurs et marques. Images modernes, impactantes, optimisées pour le feed et les stories.", badges: ["Feed & Story", "Format vertical", "Optimisé réseaux"], image: "/images/insta-1.webp", href: "/services/instagram-reseaux" },
  { key: "Événement", title: "Événement", desc: "Reportages vibrants pour mariages, conférences, festivals. Narration visuelle discrète et énergique.", badges: ["Planning", "Photojournalisme", "Livraison rapide"], image: "/images/extra-1.webp", href: "/services/evenement" },
  { key: "Animal", title: "Animal", desc: "Portraits d'animaux de compagnie et sauvages. Captures émotionnelles révélant leur personnalité unique.", badges: ["Studio / Extérieur", "Approche douce", "Retouche naturelle"], image: "/images/animal-1.webp", href: "/services/animal" },
];

const PROCESS = [
  { num: "01", title: "Brief & moodboard", desc: "Analyse de vos besoins, références visuelles, planning et devis détaillé." },
  { num: "02", title: "Prise de vue", desc: "Gestion de la lumière naturelle ou artificielle, direction modèle sur place." },
  { num: "03", title: "Retouche calibrée", desc: "Tri, retouche fine, harmonisation des tons, préparation impression & web." },
  { num: "04", title: "Livraison & suivi", desc: "Galerie privée, exports multi-formats, ajustements inclus, archivage 6 mois." },
];

const PRICING = [
  { id: "express", name: "Séance Express", price: "90€", unit: "à partir de", desc: "Idéal portrait pro & réseaux, rapide et efficace.", featured: false },
  { id: "signature", name: "Formule Signature", price: "180€", unit: "à partir de", desc: "L'expérience complète, direction artistique incluse.", featured: true },
  { id: "evenement", name: "Événement", price: "Sur devis", unit: "personnalisé", desc: "Présence sur l'événement, capture des moments clés.", featured: false },
];

const TESTIMONIALS = [
  { name: "Camille R.", role: "Direction artistique", rating: 5, quote: "Un regard rare. Les portraits dépassent tout ce que j'avais imaginé — naturels, justes, et d'une élégance folle." },
  { name: "Thomas L.", role: "Fondateur, studio créatif", rating: 5, quote: "Le feed a complètement changé de dimension. Des images qui convertissent, livrées vite et sans accroc." },
  { name: "Élise & Marc", role: "Mariés", rating: 5, quote: "Discret toute la journée, et pourtant il a tout capté. On revit chaque émotion à chaque photo." },
];

const PORTFOLIO_PREVIEW = [
  { title: "Portrait signature", category: "Portrait", cover: "/images/portrait-1.webp", slug: "portraits-signature" },
  { title: "Instagram / Réseaux", category: "Instagram / Réseaux", cover: "/images/insta-1.webp", slug: "instagram-reseaux" },
  { title: "Reportages vibrants", category: "Événement", cover: "/images/extra-1.webp", slug: "reportage-vibrant" },
  { title: "Portraits d'animaux", category: "Animal", cover: "/images/animal-1.webp", slug: "portraits-animaux" },
];

function Hero() {
  return (
    <section style={{ paddingTop: "clamp(120px, 17vh, 200px)", paddingBottom: "clamp(40px,6vh,80px)" }}>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal as="span" className="kicker">Photographe · Retouche · Paris</Reveal>
            <Reveal as="h1" className="display" delay={1} style={{ marginTop: 26 }}>
              Des images qui<br /><span className="serif-italic gold-text">révèlent</span> votre image.
            </Reveal>
            <Reveal className="lede" delay={2} style={{ marginTop: 30 }}>
              Photographie et retouche haut de gamme — portrait, événement, réseaux et animal. Une direction artistique soignée, du brief à la livraison.
            </Reveal>
            <Reveal className="flex" delay={3} style={{ gap: 12, marginTop: 38, flexWrap: "wrap" }}>
              <Link className="btn btn-gold" href="/reservation">Demander un devis <IcoArrow /></Link>
              <Link className="btn btn-outline" href="/portfolio">Voir le portfolio</Link>
            </Reveal>
            <Reveal className="hero-meta" delay={4}>
              {STATS.map((s) => (
                <div key={s.label} className="hero-stat">
                  <b className="display">{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal className="hero-media" delay={2}>
            <div className="frame ratio-34">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/portrait-1.webp" alt="Portrait signature en lumière naturelle" />
              <div className="corner" />
            </div>
            <div className="hero-media-cap">
              <span className="kicker no-rule">001 — Portrait signature</span>
              <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.1em" }}>Lumière naturelle · 2025</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} className="marquee-item">
            Portrait Événement Réseaux sociaux Animalier Retouche éditoriale Direction artistique
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="eyebrow-row" style={{ marginBottom: 18 }}>
          <div>
            <span className="kicker">Prestations</span>
            <h2 className="display" style={{ marginTop: 20, maxWidth: "16ch" }}>Des offres claires, pensées pour valoriser.</h2>
          </div>
          <Link className="btn btn-ghost" href="/pricing">Voir les tarifs <IcoArrow /></Link>
        </Reveal>
        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Link href={s.href} className="svc-row" style={{ color: "inherit" }}>
                <span className="svc-idx">{String(i + 1).padStart(2, "0")}</span>
                <div className="svc-main">
                  <h3 className="display svc-title">{s.title}</h3>
                  <p className="muted svc-desc">{s.desc}</p>
                </div>
                <div className="svc-badges">{s.badges.map((b) => <span key={b} className="pill">{b}</span>)}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="svc-thumb frame"><img src={s.image} alt={s.title} /></div>
                <span className="svc-arrow"><IcoArrowUpRight size={20} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type PortfolioItem = { title: string; category: string; cover: string; slug: string };

function PortfolioPreview({ items }: { items: PortfolioItem[] }) {
  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal className="eyebrow-row" style={{ marginBottom: 34 }}>
          <div>
            <span className="kicker">Sélection</span>
            <h2 className="display" style={{ marginTop: 20 }}>Travaux récents</h2>
          </div>
          <Link className="btn btn-outline" href="/portfolio">Tout le portfolio <IcoArrow /></Link>
        </Reveal>
        <div className="feat-grid">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className={"feat-item feat-" + i}>
              <Link className="frame" style={{ height: "100%" }} href={`/portfolio/${p.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} />
                <div className="corner" />
                <div className="img-cap">
                  <div>
                    <span className="pill" style={{ marginBottom: 10 }}>{p.category}</span>
                    <div className="display" style={{ fontSize: "1.5rem", color: "#fff" }}>{p.title}</div>
                  </div>
                  <IcoArrowUpRight size={18} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RetoucheSection() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="ba-grid">
          <Reveal>
            <span className="kicker">Retouche éditoriale</span>
            <h2 className="display" style={{ marginTop: 20 }}>L&apos;art du <span className="serif-italic gold-text">naturel</span>.</h2>
            <p className="lede" style={{ marginTop: 22 }}>Glissez pour comparer. Une peau travaillée sans lissage excessif, une colorimétrie calibrée pour l&apos;impression comme pour le web.</p>
            <ul className="ba-list">
              {["Travail de la peau naturel, sans lissage excessif", "Ajustement colorimétrique calibré impression & web", "Nettoyage de fond, suppression des éléments parasites", "Export optimisé : HD, web, profils ICC sur demande"].map((t) => (
                <li key={t}><span className="divider-dot">✦</span> {t}</li>
              ))}
            </ul>
            <div className="flex" style={{ gap: 12, marginTop: 30 }}>
              <Link className="btn btn-gold" href="/reservation">Confier une retouche <IcoArrow /></Link>
            </div>
          </Reveal>
          <Reveal delay={2}><BeforeAfter /></Reveal>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal>
          <span className="kicker">Process</span>
          <h2 className="display" style={{ marginTop: 20, maxWidth: "14ch" }}>Un processus simple, du brief à la livraison.</h2>
        </Reveal>
        <div className="proc-grid">
          {PROCESS.map((p, i) => (
            <Reveal key={p.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="proc-card">
              <span className="proc-num gold-text display">{p.num}</span>
              <h4 className="proc-title">{p.title}</h4>
              <p className="muted" style={{ fontSize: "0.95rem" }}>{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="eyebrow-row" style={{ marginBottom: 34 }}>
          <div>
            <span className="kicker">Tarifs</span>
            <h2 className="display" style={{ marginTop: 20 }}>Des formules transparentes</h2>
          </div>
          <Link className="btn btn-ghost" href="/pricing">Détail des formules <IcoArrow /></Link>
        </Reveal>
        <div className="price-mini">
          {PRICING.map((o, i) => (
            <Reveal key={o.id} delay={((i % 3) + 1) as 1 | 2 | 3} className={"price-mini-card" + (o.featured ? " feat" : "")}>
              {o.featured && <span className="price-badge">Populaire</span>}
              <div className="flex" style={{ justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <h4 className="display" style={{ fontSize: "1.7rem" }}>{o.name}</h4>
                <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{o.unit}</span>
              </div>
              <div className="price-big gold-text display">{o.price}</div>
              <p className="muted" style={{ fontSize: "0.95rem" }}>{o.desc}</p>
              <Link className="btn btn-outline" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} href="/pricing">En savoir plus</Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview() {
  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal className="eyebrow-row" style={{ marginBottom: 34 }}>
          <div>
            <span className="kicker">Témoignages</span>
            <h2 className="display" style={{ marginTop: 20 }}>Ce que disent les clients</h2>
          </div>
          <Link className="btn btn-ghost" href="/testimonials">Tous les avis <IcoArrow /></Link>
        </Reveal>
        <div className="tst-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={((i % 3) + 1) as 1 | 2 | 3} className="tst-card">
              <Stars n={t.rating} />
              <p className="tst-quote">« {t.quote} »</p>
              <div className="tst-meta">
                <b>{t.name}</b>
                <span className="muted">{t.role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  let portfolioItems: PortfolioItem[] = PORTFOLIO_PREVIEW;

  try {
    const { data: featuredRaw } = await supabaseServer
      .from('projects')
      .select('slug, title, category, image')
      .eq('homepage_featured', true)
      .eq('hidden', false);

    if (featuredRaw && featuredRaw.length > 0) {
      const byCategory: Record<string, { slug: string; title: string; image: string }> = {};
      for (const p of featuredRaw) byCategory[p.category] = p;

      portfolioItems = PORTFOLIO_PREVIEW.map((p) => ({
        ...p,
        cover: byCategory[p.category]?.image ?? p.cover,
        slug: byCategory[p.category]?.slug ?? p.slug,
        title: byCategory[p.category]?.title ?? p.title,
      }));
    }
  } catch {
    // Fallback aux images statiques en cas d'erreur
  }

  return (
    <div className="page">
      <Hero />
      <Marquee />
      <ServicesSection />
      <PortfolioPreview items={portfolioItems} />
      <RetoucheSection />
      <ProcessSection />
      <PricingTeaser />
      <TestimonialsPreview />
      <CTABand />
    </div>
  );
}
