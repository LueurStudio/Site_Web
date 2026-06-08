import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographe Instagram Paris — Shooting Contenu Réseaux Sociaux",
  description:
    "Création de contenus photo professionnels pour Instagram, TikTok et réseaux sociaux à Paris. Shooting lifestyle, stratégie visuelle, formats optimisés. LueurStudio.",
  keywords: [
    "photographe Instagram Paris",
    "shooting contenu réseaux sociaux Paris",
    "créateur contenu photo Paris",
    "shooting lifestyle Paris",
    "photographe content creator Paris",
    "photo Instagram professionnelle Paris",
  ],
  openGraph: {
    title: "Photographe Instagram & Réseaux Sociaux Paris — LueurStudio",
    description:
      "Contenus photo professionnels pour Instagram et réseaux sociaux à Paris. Shooting lifestyle, formats optimisés, livraison rapide.",
    url: "https://www.lueurstudio-photographie.fr/services/instagram-reseaux",
  },
  alternates: { canonical: "/services/instagram-reseaux" },
};

export default function InstagramServicePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.lueurstudio-photographie.fr" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.lueurstudio-photographie.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Instagram / Réseaux", item: "https://www.lueurstudio-photographie.fr/services/instagram-reseaux" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Shooting Photo Instagram & Réseaux Sociaux Paris",
            description:
              "Création de contenus photo professionnels pour Instagram et réseaux sociaux à Paris.",
            provider: { "@type": "Organization", name: "LueurStudio", url: "https://www.lueurstudio-photographie.fr" },
            areaServed: { "@type": "City", name: "Paris" },
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14 space-y-16">
        <header className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="text-stone-600 hover:text-white transition">Accueil</Link>
            <span className="text-slate-500">›</span>
            <span className="text-stone-500">Instagram / Réseaux</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Service — Réseaux sociaux</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Shooting photo Instagram & réseaux sociaux à Paris
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Des contenus visuels professionnels qui boostent votre présence en ligne. Pour les créateurs, entrepreneurs et marques qui veulent se démarquer sur Instagram, TikTok et LinkedIn.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Créer mon contenu
            </Link>
            <Link
              href="/portfolio?category=Instagram+%2F+Réseaux"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir les exemples
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Stratégie visuelle",
              desc: "Avant de shooter, on définit ensemble votre direction artistique, votre palette de couleurs et vos formats. Un feed cohérent qui renforce votre personal brand.",
            },
            {
              title: "Formats multi-plateformes",
              desc: "Feed carré et portrait pour Instagram, vertical pour TikTok et Stories, paysage pour YouTube. Tous vos contenus en un seul shooting.",
            },
            {
              title: "Volume optimisé",
              desc: "Un shooting bien planifié produit 30 à 60 contenus prêts à publier. De quoi couvrir 1 à 2 mois de publications régulières.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 space-y-3">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-stone-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Pour qui ?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Créateurs de contenu", desc: "Influenceurs, YouTubers, blogueurs. Des visuels qui reflètent votre univers et séduisent les marques partenaires." },
              { label: "Entrepreneurs & coachs", desc: "Personal branding fort, confiance en ligne. Des photos qui vendent votre expertise avant même que vous parliez." },
              { label: "Marques & e-commerce", desc: "Visuels produit et lifestyle pour vos campagnes. Cohérence visuelle sur tous vos canaux de communication." },
              { label: "Artistes & musiciens", desc: "Press kit, affiches, contenus promo. Une identité visuelle forte pour votre communication artistique." },
              { label: "Restaurants & hôtels", desc: "Mise en valeur de vos plats, espaces et ambiances. Des photos qui donnent envie avant même l'arrivée." },
              { label: "Professionnels de santé", desc: "Thérapeutes, médecins, coachs santé. Des portraits rassurants qui inspirent confiance." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-2">
                <p className="font-semibold text-[#1c1916]">{item.label}</p>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold">Ce qui est inclus dans chaque shooting</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Brief artistique + moodboard préparatoire",
              "Conseil sur les tenues et le lieu",
              "Formats feed (carré + portrait) et stories",
              "Retouche éditoriale cohérente",
              "Exports optimisés par plateforme",
              "Catalogue de contenus prêts à publier",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-stone-100 px-4 py-3">
                <span className="text-stone-600 font-bold">✓</span>
                <span className="text-sm text-stone-600">{item}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200/60 bg-stone-100 p-6">
            <p className="text-xl font-semibold">À partir de 120 €</p>
            <p className="text-stone-500 text-sm mt-1">Tarif sur mesure selon le nombre de formats et le volume souhaité.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Prêt à transformer ta présence en ligne ?</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Dis-moi tes objectifs, ta plateforme principale et ton univers visuel. Je crée le brief parfait en moins de 24h.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Lancer mon shooting
            </Link>
            <Link
              href="/blog/shooting-instagram-paris"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Lire notre guide Instagram
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
