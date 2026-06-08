import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographe Portrait Paris — Shooting Portrait Professionnel",
  description:
    "Shooting portrait professionnel à Paris : portraits LinkedIn, artistiques, personnels. Direction artistique, retouche naturelle, livraison 48h. LueurStudio, photographe portrait Paris.",
  keywords: [
    "photographe portrait Paris",
    "shooting portrait Paris",
    "portrait professionnel Paris",
    "portrait LinkedIn Paris",
    "portrait artistique Paris",
    "photographe portrait Île-de-France",
  ],
  openGraph: {
    title: "Shooting Portrait Professionnel Paris — LueurStudio",
    description:
      "Portraits professionnels à Paris : LinkedIn, artistiques, personnels. Direction artistique, retouche naturelle, livraison 48h.",
    url: "https://www.lueurstudio-photographie.fr/services/portrait",
  },
  alternates: { canonical: "/services/portrait" },
};

export default function PortraitServicePage() {
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
              { "@type": "ListItem", position: 3, name: "Portrait", item: "https://www.lueurstudio-photographie.fr/services/portrait" },
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
            name: "Shooting Portrait Professionnel Paris",
            description:
              "Service de photographie portrait professionnel à Paris. Portraits LinkedIn, artistiques, personnels avec direction artistique et retouche haut de gamme.",
            provider: { "@type": "Organization", name: "LueurStudio", url: "https://www.lueurstudio-photographie.fr" },
            areaServed: { "@type": "City", name: "Paris" },
            offers: [
              {
                "@type": "Offer",
                name: "Séance Express Portrait",
                price: "90",
                priceCurrency: "EUR",
                description: "45 min, 10 portraits retouchés, livraison 48h",
              },
              {
                "@type": "Offer",
                name: "Formule Signature Portrait",
                price: "180",
                priceCurrency: "EUR",
                description: "1h30, 25 portraits retouchés, moodboard dédié",
              },
            ],
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14 space-y-16">
        <header className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="text-stone-600 hover:text-white transition">Accueil</Link>
            <span className="text-slate-500">›</span>
            <span className="text-stone-500">Portrait</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Service — Portrait</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Shooting portrait professionnel à Paris
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Des portraits qui révèlent votre personnalité. Pour votre LinkedIn, votre book artistique ou votre communication — des images soignées qui font la différence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Réserver mon portrait
            </Link>
            <Link
              href="/portfolio?category=Portrait"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir les portraits
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: "🎨",
              title: "Direction artistique",
              desc: "Moodboard personnalisé, conseil sur les tenues et le lieu, coaching pose sur place pour des résultats naturels.",
            },
            {
              icon: "✨",
              title: "Retouche naturelle",
              desc: "Travail de peau respectueux, calibration colorimétrique précise. Sublimer sans dénaturer.",
            },
            {
              icon: "⚡",
              title: "Livraison rapide",
              desc: "Sélection des meilleures images sous 48h. Retouche finale sous 72h. Exports HD et web inclus.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 space-y-3">
              <div className="text-3xl">{item.icon}</div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-stone-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Pour qui ?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Entrepreneurs & dirigeants", desc: "Photo de profil LinkedIn, site web, presse professionnelle." },
              { label: "Artistes & créateurs", desc: "Dossier artistique, book, présence en ligne." },
              { label: "Personnes privées", desc: "Portrait personnel, souvenir, cadeau original." },
              { label: "Équipes & entreprises", desc: "Portraits cohérents pour toute une équipe, en studio ou sur site." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-2">
                <p className="font-semibold text-[#1c1916]">{item.label}</p>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Tarifs portrait</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Séance Express",
                price: "90 €",
                duration: "45 min",
                photos: "10 photos retouchées",
                delivery: "Livraison sous 48h",
              },
              {
                name: "Formule Signature",
                price: "180 €",
                duration: "1h30",
                photos: "25 photos retouchées",
                delivery: "Moodboard + livraison sous 72h",
              },
            ].map((offer) => (
              <div key={offer.name} className="rounded-2xl border border-stone-200/60 bg-stone-100 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold">{offer.name}</p>
                  <p className="text-2xl font-semibold text-[#1c1916]">{offer.price}</p>
                </div>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• {offer.duration}</li>
                  <li>• {offer.photos}</li>
                  <li>• {offer.delivery}</li>
                  <li>• Retouche incluse</li>
                  <li>• Exports HD + web</li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold sm:text-3xl">Envie d&apos;un portrait qui te ressemble ?</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Contacte-moi pour un brief gratuit. Je te propose un concept personnalisé et un devis en moins de 24h.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Prendre contact
            </Link>
            <Link
              href="/blog/choisir-photographe-portrait-paris"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Guide : choisir son photographe
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
