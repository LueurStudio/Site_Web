import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographe Paris — Shooting Photo Professionnel Île-de-France",
  description:
    "Photographe professionnel à Paris et en Île-de-France. Portraits, événements, animaux, contenus Instagram. Déplacement dans tout Paris et sa banlieue. Devis gratuit sous 24h.",
  keywords: [
    "photographe Paris",
    "photographe professionnel Paris",
    "photographe Île-de-France",
    "shooting photo Paris",
    "photographe portrait Paris",
    "photographe mariage Paris",
    "photographe événement Paris",
    "photographe banlieue parisienne",
  ],
  openGraph: {
    title: "Photographe Professionnel Paris & Île-de-France — LueurStudio",
    description:
      "Photographe professionnel à Paris : portraits, événements, animaux, Instagram. Déplacement dans toute l'Île-de-France.",
    url: "https://www.lueurstudio-photographie.fr/photographe-paris",
  },
  alternates: { canonical: "/photographe-paris" },
};

const ZONES = [
  { city: "Paris 1er–8ème", note: "Centre historique, Marais, Saint-Germain" },
  { city: "Paris 9ème–20ème", note: "Montmartre, République, Nation, Belleville" },
  { city: "Hauts-de-Seine (92)", note: "Neuilly, Boulogne, La Défense, Versailles" },
  { city: "Seine-Saint-Denis (93)", note: "Saint-Denis, Pantin, Montreuil" },
  { city: "Val-de-Marne (94)", note: "Vincennes, Créteil, Ivry, Charenton" },
  { city: "Seine-et-Marne (77)", note: "Fontainebleau, Meaux, Melun" },
  { city: "Yvelines (78)", note: "Versailles, Saint-Germain-en-Laye, Mantes" },
  { city: "Essonne (91)", note: "Évry, Massy, Corbeil, Étampes" },
];

export default function PhotographeParis() {
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
              { "@type": "ListItem", position: 2, name: "Photographe Paris", item: "https://www.lueurstudio-photographie.fr/photographe-paris" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.lueurstudio-photographie.fr",
            name: "LueurStudio",
            description:
              "Photographe professionnel à Paris et en Île-de-France. Portraits, événements, animaux, contenus Instagram.",
            url: "https://www.lueurstudio-photographie.fr",
            image: "https://www.lueurstudio-photographie.fr/images/logo.svg",
            priceRange: "€€",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Paris",
              addressRegion: "Île-de-France",
              postalCode: "75000",
              addressCountry: "FR",
            },
            areaServed: [
              { "@type": "City", name: "Paris" },
              { "@type": "AdministrativeArea", name: "Hauts-de-Seine" },
              { "@type": "AdministrativeArea", name: "Seine-Saint-Denis" },
              { "@type": "AdministrativeArea", name: "Val-de-Marne" },
              { "@type": "AdministrativeArea", name: "Seine-et-Marne" },
              { "@type": "AdministrativeArea", name: "Yvelines" },
              { "@type": "AdministrativeArea", name: "Essonne" },
            ],
            knowsAbout: [
              "Photographie de portrait",
              "Photographie événementielle",
              "Photographie animalière",
              "Contenus réseaux sociaux",
              "Retouche photo",
            ],
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14 space-y-16">
        <header className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40 space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Paris & Île-de-France</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Photographe professionnel à Paris
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Basé en Île-de-France, je me déplace dans tout Paris et ses environs pour vos shootings photo. Portrait, événement, animal ou contenu Instagram — partout où vous êtes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Réserver un shooting
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir le portfolio
            </Link>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/services/portrait", label: "Portrait", desc: "Portraits professionnels et artistiques à Paris et Île-de-France." },
            { href: "/services/evenement", label: "Événement", desc: "Mariages, conférences, festivals — reportages dans toute la région." },
            { href: "/services/animal", label: "Animal", desc: "Portraits d'animaux à domicile, en parc ou en forêt." },
            { href: "/services/instagram-reseaux", label: "Instagram", desc: "Contenus photo pour réseaux sociaux à Paris et banlieue." },
          ].map((service) => (
            <Link
              key={service.label}
              href={service.href}
              className="group rounded-2xl border border-stone-200/60 bg-white/80 p-5 space-y-2 transition hover:border-stone-300 hover:-translate-y-1"
            >
              <p className="text-lg font-semibold text-[#1c1916] group-hover:text-stone-500 transition">{service.label}</p>
              <p className="text-sm text-stone-500">{service.desc}</p>
              <p className="text-xs text-stone-600">Voir le service →</p>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Zone d&apos;intervention</h2>
          <p className="text-stone-600">
            Je me déplace dans tout Paris (1er au 20ème arrondissement) et dans les départements d&apos;Île-de-France. Les déplacements en petite couronne sont inclus. Au-delà, un forfait kilométrique s&apos;applique.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ZONES.map((zone) => (
              <div key={zone.city} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-1">
                <p className="font-semibold text-[#1c1916] text-sm">{zone.city}</p>
                <p className="text-xs text-stone-400">{zone.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Les plus beaux endroits à Paris pour un shooting</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quartier: "Le Marais",
                desc: "Fresques murales, architecture médiévale et haussmannienne. Idéal pour portraits urbains.",
              },
              {
                quartier: "Montmartre",
                desc: "Escaliers, terrasses, ateliers d'artistes. Ambiance bohème et lumière dorée en fin de journée.",
              },
              {
                quartier: "Canal Saint-Martin",
                desc: "Péniches, ponts métalliques, façades colorées. Ambiance urban cool très prisée.",
              },
              {
                quartier: "La Défense",
                desc: "Architecture futuriste, grandes perspectives, parvis géométriques. Pour un style moderne.",
              },
              {
                quartier: "Bois de Vincennes",
                desc: "Forêt dense, lacs, espaces naturels près de Paris. Parfait pour animaux et portraits naturels.",
              },
              {
                quartier: "Palais Royal",
                desc: "Les colonnes de Buren, les galeries, les jardins — un classique de la photo parisienne.",
              },
            ].map((loc) => (
              <div key={loc.quartier} className="rounded-xl border border-stone-200/60 bg-stone-50 p-5 space-y-2">
                <p className="font-semibold text-[#1c1916]">{loc.quartier}</p>
                <p className="text-sm text-stone-500">{loc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            { value: "Paris & Île-de-France", label: "Zone d'intervention" },
            { value: "48h", label: "Délai de livraison moyen" },
            { value: "Devis gratuit", label: "Réponse sous 24h" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 text-center space-y-1">
              <p className="text-2xl font-semibold text-[#1c1916]">{stat.value}</p>
              <p className="text-sm uppercase tracking-wide text-stone-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold sm:text-3xl">Photographe à Paris — Disponible pour votre projet</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Partagez-moi votre projet, vos dates et votre lieu. Je vous réponds sous 24h avec une proposition sur mesure.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Demander un devis
            </Link>
            <Link
              href="/a-propos"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              En savoir plus
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
