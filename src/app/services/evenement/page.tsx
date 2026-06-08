import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographe Événement Paris — Mariage, Conférence, Festival",
  description:
    "Photographe événementiel à Paris : mariages, conférences, festivals, soirées d'entreprise. Reportage discret et dynamique, galerie privée, livraison rapide. LueurStudio.",
  keywords: [
    "photographe événement Paris",
    "photographe mariage Paris",
    "photographe soirée entreprise Paris",
    "reportage photo Paris",
    "photographe conférence Paris",
    "photographe festival Paris",
  ],
  openGraph: {
    title: "Photographe Événementiel Paris — LueurStudio",
    description:
      "Reportages événementiels à Paris : mariages, conférences, festivals. Galerie privée et livraison rapide.",
    url: "https://www.lueurstudio-photographie.fr/services/evenement",
  },
  alternates: { canonical: "/services/evenement" },
};

export default function EvenementServicePage() {
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
              { "@type": "ListItem", position: 3, name: "Événement", item: "https://www.lueurstudio-photographie.fr/services/evenement" },
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
            name: "Photographie Événementielle Paris",
            description:
              "Service de reportage photo événementiel à Paris : mariages, conférences, festivals, soirées.",
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
            <span className="text-stone-500">Événement</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Service — Événement</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Photographe événementiel à Paris
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Des reportages vibrants qui capturent l&apos;énergie et les émotions de vos événements. Mariage, conférence, festival, soirée d&apos;entreprise — chaque instant mérite d&apos;être immortalisé.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Demander un devis
            </Link>
            <Link
              href="/portfolio?category=Événement"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir les reportages
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Approche documentaire",
              desc: "Je reste discret pour capturer les vraies émotions : rires spontanés, larmes de joie, regards complices. Pas de mise en scène forcée.",
            },
            {
              title: "Couverture complète",
              desc: "De la préparation aux dernières photos de la soirée. Chaque moment clé est couvert, chaque détail mémorable est capturé.",
            },
            {
              title: "Galerie privée",
              desc: "Livraison d'une galerie en ligne sécurisée, facilement partageable avec vos proches ou collaborateurs. Exports optimisés pour le web et l'impression.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 space-y-3">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-stone-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Types d&apos;événements couverts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Mariage", desc: "Cérémonie laïque ou religieuse, vin d'honneur, soirée. Approche mêlant reportage et portraits dirigés." },
              { label: "Conférence & séminaire", desc: "Keynotes, tables rondes, networking. Couverture discrète et professionnelle." },
              { label: "Festival & concert", desc: "Ambiance, énergie, backstage. Photos dynamiques qui retranscrivent l'atmosphère." },
              { label: "Soirée d'entreprise", desc: "Team building, anniversaire, lancement. Photos pour vos réseaux et votre communication interne." },
              { label: "Cérémonie privée", desc: "Anniversaire, baptême, bar-mitsva, communion. Souvenirs authentiques pour toute la famille." },
              { label: "Lancement de produit", desc: "Événement commercial, présentation presse. Images pour vos relations presse et réseaux." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-2">
                <p className="font-semibold text-[#1c1916]">{item.label}</p>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-10 space-y-4">
          <h2 className="text-2xl font-semibold sm:text-3xl">Tarifs événement</h2>
          <p className="text-stone-600">
            Le tarif d&apos;un reportage événementiel dépend de la durée, du type d&apos;événement et des prestations souhaitées (assistant, matériel spécifique, album...).
          </p>
          <div className="rounded-2xl border border-stone-200/60 bg-stone-100 p-6 space-y-4">
            <p className="text-lg font-semibold">Tarif sur devis — à partir de 250 €</p>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm text-stone-600">
              <li>• Couverture multi-angles</li>
              <li>• Colorimétrie cohérente</li>
              <li>• Galerie privée en ligne</li>
              <li>• Sélection social media</li>
              <li>• Exports HD + web</li>
              <li>• Livraison sous 5 jours ouvrés</li>
            </ul>
          </div>
          <Link
            href="/#contact"
            className="inline-block rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Demander un devis gratuit
          </Link>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Un événement à photographier à Paris ?</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Partagez-moi la date, le lieu et le type d&apos;événement. Je vous réponds sous 24h avec une proposition détaillée.
          </p>
          <Link
            href="/#contact"
            className="inline-block rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Nous contacter
          </Link>
        </section>
      </main>
    </div>
  );
}
