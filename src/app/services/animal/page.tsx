import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographe Animalier Paris — Portrait Animal de Compagnie",
  description:
    "Photographe animalier à Paris et Île-de-France : portraits de chiens, chats, chevaux et animaux de compagnie. Séances en studio ou extérieur, retouche naturelle, livraison 48h. LueurStudio.",
  keywords: [
    "photographe animalier Paris",
    "photo animal compagnie Paris",
    "portrait chien Paris",
    "portrait chat Paris",
    "photographe animaux Paris",
    "shooting animal Paris",
  ],
  openGraph: {
    title: "Photographe Animalier Paris — LueurStudio",
    description:
      "Portraits d'animaux de compagnie à Paris : chiens, chats, chevaux. En studio ou extérieur, retouche naturelle.",
    url: "https://www.lueurstudio-photographie.fr/services/animal",
  },
  alternates: { canonical: "/services/animal" },
};

export default function AnimalServicePage() {
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
              { "@type": "ListItem", position: 3, name: "Animal", item: "https://www.lueurstudio-photographie.fr/services/animal" },
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
            name: "Photographie Animalière Paris",
            description:
              "Service de portraits d'animaux de compagnie à Paris et Île-de-France. Séances en studio mobile ou en extérieur.",
            provider: { "@type": "Organization", name: "LueurStudio", url: "https://www.lueurstudio-photographie.fr" },
            areaServed: [
              { "@type": "City", name: "Paris" },
              { "@type": "AdministrativeArea", name: "Île-de-France" },
            ],
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14 space-y-16">
        <header className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="text-stone-600 hover:text-white transition">Accueil</Link>
            <span className="text-slate-500">›</span>
            <span className="text-stone-500">Animal</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Service — Animal</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Photographe animalier à Paris
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Votre animal de compagnie mérite des photos qui révèlent sa personnalité unique. Avec patience et une approche douce, je capture les moments qui vous feront sourire pour des années.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Réserver la séance
            </Link>
            <Link
              href="/portfolio?category=Animal"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir les portraits
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Approche douce & patiente",
              desc: "Je comprends le comportement animal. Pas de stress, pas de contrainte — les animaux sont fotografiés dans un état naturel et détendu.",
            },
            {
              title: "Studio mobile ou extérieur",
              desc: "Séance à domicile, dans un parc ou en studio selon ce qui convient le mieux à votre animal. Je m'adapte à son environnement.",
            },
            {
              title: "Retouche naturelle",
              desc: "Chaque portrait est retouché pour sublimer la beauté naturelle de votre animal. Couleur du pelage, regard, texture — tout est préservé.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 space-y-3">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-stone-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Pour tous les animaux</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "🐕", label: "Chiens", desc: "Toutes races, toutes tailles — de la séance en appartement au shooting en forêt." },
              { emoji: "🐈", label: "Chats", desc: "Portraits intimistes dans leur environnement naturel ou en studio mobile." },
              { emoji: "🐴", label: "Chevaux", desc: "En extérieur, en paddock ou en box. Une spécialité qui demande patience et expertise." },
              { emoji: "🐾", label: "Autres animaux", desc: "Lapins, cochons d'Inde, perroquets, reptiles — n'hésitez pas à me contacter." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-2 text-center">
                <div className="text-4xl">{item.emoji}</div>
                <p className="font-semibold text-[#1c1916]">{item.label}</p>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-10 space-y-4">
          <h2 className="text-2xl font-semibold">Tarifs portrait animalier</h2>
          <div className="rounded-2xl border border-stone-200/60 bg-stone-100 p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xl font-semibold">Séance Animaux</p>
                <p className="text-2xl font-semibold text-white">90 €</p>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  <li>• 1h de séance (domicile ou parc)</li>
                  <li>• 10 photos retouchées</li>
                  <li>• Livraison sous 48h</li>
                  <li>• Exports HD + web</li>
                </ul>
              </div>
              <div>
                <p className="text-xl font-semibold">Séance + Maître</p>
                <p className="text-2xl font-semibold text-white">150 €</p>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  <li>• 1h30 avec votre animal</li>
                  <li>• 20 photos retouchées</li>
                  <li>• Portraits séparés + ensemble</li>
                  <li>• Livraison sous 72h</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Offrez un souvenir inoubliable à votre animal</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Chaque animal est unique. Je prends le temps nécessaire pour créer une connexion et capturer sa vraie personnalité.
          </p>
          <Link
            href="/#contact"
            className="inline-block rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Réserver une séance
          </Link>
        </section>
      </main>
    </div>
  );
}
