import Link from "next/link";
import type { Metadata } from "next";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/config/contact";

export const metadata: Metadata = {
  title: "À propos — Photographe Professionnel Paris",
  description:
    "Découvrez LueurStudio : un photographe professionnel basé près de Paris, passionné par le portrait, l'événement et la retouche photo haut de gamme. Mon parcours, ma vision artistique.",
  keywords: [
    "à propos photographe Paris",
    "photographe professionnel Paris",
    "LueurStudio photographe",
    "vision artistique photographe",
    "photographe portrait Paris",
  ],
  openGraph: {
    title: "À propos — LueurStudio | Photographe Professionnel Paris",
    description:
      "Découvrez LueurStudio : photographe professionnel basé près de Paris, spécialisé en portrait, événement et retouche haut de gamme.",
    url: "https://www.lueurstudio-photographie.fr/a-propos",
  },
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
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
              { "@type": "ListItem", position: 2, name: "À propos", item: "https://www.lueurstudio-photographie.fr/a-propos" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "LueurStudio",
            jobTitle: "Photographe Professionnel",
            description:
              "Photographe professionnel basé près de Paris, spécialisé en portrait, événement, photographie animalière et création de contenus pour réseaux sociaux.",
            url: "https://www.lueurstudio-photographie.fr",
            sameAs: [SOCIAL_LINKS.instagram],
            email: CONTACT_EMAIL,
            worksFor: {
              "@type": "Organization",
              name: "LueurStudio",
              url: "https://www.lueurstudio-photographie.fr",
            },
            knowsAbout: [
              "Photographie de portrait",
              "Photographie événementielle",
              "Photographie animalière",
              "Retouche photo",
              "Direction artistique",
              "Adobe Photoshop",
              "Adobe Lightroom",
            ],
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14 space-y-16">
        <header className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40 lg:grid lg:grid-cols-[1fr,auto] lg:items-center lg:gap-12">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-stone-400">À propos</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Derrière l&apos;objectif, une vision.
            </h1>
            <p className="max-w-xl text-lg text-stone-600">
              Photographe professionnel basé près de Paris, je crée des images qui racontent des histoires vraies. Portrait, événement, animal ou contenu digital — chaque projet est traité avec la même exigence artistique.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300/60 px-5 py-2.5 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                Suivre sur Instagram
              </a>
              <Link
                href="/#contact"
                className="rounded-full bg-[#1c1916] px-5 py-2.5 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
              >
                Travailler ensemble
              </Link>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {[
                { value: "20+", label: "Clients satisfaits" },
                { value: "98%", label: "Satisfaction" },
                { value: "48h", label: "Délai livraison" },
                { value: "4", label: "Spécialités" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-stone-200/60 bg-stone-50 px-5 py-4 text-center"
                >
                  <p className="text-2xl font-semibold text-[#1c1916]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-stone-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5 rounded-3xl border border-stone-200/60 bg-stone-50 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Ma vision</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">La photographie comme langage</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Pour moi, une photo n&apos;est réussie que si elle provoque quelque chose : une émotion, un souvenir, un désir. Pas une démonstration technique — une connexion humaine.
              </p>
              <p>
                C&apos;est cette conviction qui guide chaque shooting : prendre le temps de comprendre qui vous êtes, ce que vous voulez transmettre, et créer des images qui vous ressemblent vraiment.
              </p>
              <p>
                La technique — la lumière, la composition, la retouche — n&apos;est qu&apos;un outil au service de cette vision.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-stone-200/60 bg-stone-50 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Mon approche</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">Un processus transparent</h2>
            <div className="space-y-3">
              {[
                { num: "01", title: "Écoute & brief", desc: "On commence toujours par un échange pour comprendre vos besoins et votre univers." },
                { num: "02", title: "Direction artistique", desc: "Moodboard, conseils de tenue, choix du lieu — tout est préparé avant le shooting." },
                { num: "03", title: "Shooting & direction", desc: "Sur place, je vous guide pour obtenir des résultats naturels et maîtrisés." },
                { num: "04", title: "Retouche & livraison", desc: "Chaque photo est traitée individuellement. Livraison sous 48-72h." },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4 rounded-xl border border-stone-200/60 bg-white/80 p-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-400 ring-1 ring-stone-200">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c1916]">{step.title}</p>
                    <p className="text-sm text-stone-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-stone-50 p-8 md:p-10 space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Outils & compétences</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Ce que j&apos;utilise</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Adobe Lightroom", desc: "Étalonnage et traitement de masse. Cohérence colorimétrique sur l'ensemble d'un shooting." },
              { label: "Adobe Photoshop", desc: "Retouche de peau avancée, fréquences séparées, nettoyage de fond, compositions." },
              { label: "Studio mobile", desc: "Flash de studio, reflecteurs et modificateurs de lumière pour des portraits en toutes conditions." },
              { label: "Post-production", desc: "Exports multi-formats, profils ICC, optimisation web et impression grand format." },
            ].map((tool) => (
              <div key={tool.label} className="rounded-xl border border-stone-200/60 bg-stone-50 p-4 space-y-2">
                <p className="font-semibold text-[#1c1916]">{tool.label}</p>
                <p className="text-sm text-stone-500">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/60 bg-white/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold sm:text-3xl">Travaillons ensemble</h2>
          <p className="mx-auto max-w-lg text-stone-600">
            Que vous ayez un projet précis ou une simple envie, je suis là pour vous accompagner. Premier échange toujours gratuit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Me contacter
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Voir le portfolio
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
