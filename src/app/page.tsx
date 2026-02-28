import Link from "next/link";
import Script from "next/script";
import { supabaseServer } from "@/lib/supabaseServer";
import { toWebPUrl, toWebPUrls } from "@/lib/imageUrl";
import { pricingOffers } from "./pricing/pricing-data";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/config/contact";
import type { Metadata } from "next";
import ReservationForm from "./components/ReservationForm";
import { faqItems } from "./faq/faq-data";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Photographe professionnel à Paris. Services de shooting photo et retouche pour portraits, événements, animaux et contenus Instagram. Livraison rapide, qualité professionnelle.",
  keywords: [
    "photographe professionnel Paris",
    "shooting photo Paris",
    "retouche photo professionnelle",
    "photographe portrait Paris",
    "photographe événement Paris",
    "photographe mariage Paris",
    "photographe animal Paris",
    "photographe Instagram",
    "direction artistique photo",
    "retouche Photoshop Paris",
  ],
  openGraph: {
    title: "LueurStudio — Photographe Professionnel & Retouche Photo | Paris",
    description:
      "Photographe professionnel à Paris. Services de shooting photo et retouche pour portraits, événements, animaux et contenus Instagram.",
    url: "https://lueurstudio",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const { data: projectsData } = await supabaseServer
    .from("projects")
    .select("*");

  const projects = (projectsData || [])
    .filter((project: any) => project.hidden !== true)
    .map((project: any) => ({
      ...project,
      details: project.details ?? [],
      image: toWebPUrl(project.image ?? ''),
      photos: toWebPUrls(project.photos ?? []),
    }));

  const { data: testimonialsData } = await supabaseServer
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const testimonials = (testimonialsData || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    quote: t.quote,
    project: t.project,
    rating: t.rating,
    date: t.date,
    image: t.image,
    approved: t.approved ?? false,
    createdAt: t.created_at,
  }));
  // Afficher un projet de chaque catégorie sur la page d'accueil
  const featuredProjects = [
    projects.find((p) => p.category === "Portrait"),
    projects.find((p) => p.category === "Instagram / Réseaux"),
    projects.find((p) => p.category === "Événement"),
    projects.find((p) => p.category === "Animal"),
    
  ].filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <Script
        id="ld-json-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "LueurStudio",
            description:
              "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram",
            url: "https://lueurstudio",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://lueurstudio/portfolio?category={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Script
        id="ld-json-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LueurStudio",
            url: "https://lueurstudio",
            logo: "https://lueurstudio/images/logo.svg",
            contactPoint: {
              "@type": "ContactPoint",
              email: CONTACT_EMAIL,
              contactType: "customer service",
              areaServed: "FR",
              availableLanguage: "French",
            },
            sameAs: [
              // Ajoutez vos liens réseaux sociaux ici
              "https://www.instagram.com/lueurstudio91/",
              // "https://www.facebook.com/lueurstudio",
            ],
          }),
        }}
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 sm:px-10 md:px-14">
        <section className="grid gap-8 py-8 sm:py-10 md:py-12 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 sm:px-4 sm:py-2 text-xs sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-stone-600 ring-1 ring-stone-200">
              <span className="hidden sm:inline">Portrait . Instagram / Réseaux . Événement . Animal </span>
              <span className="sm:hidden">Portrait . Événement . Animal</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Des prestations photo premium pour valoriser ton image.
            </h1>
            <p className="max-w-xl text-lg sm:text-lg text-stone-600">
              Photographie et retouche haut de gamme au service de ton image.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="#contact"
                className="rounded-full bg-[#1c1916] px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
              >
                Demander un devis
              </a>
              <a
                href="/portfolio"
                className="rounded-full border border-stone-300 px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
              >
                Voir des exemples
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-stone-600 transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-transparent to-stone-50" />
            <div className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-sm sm:text-sm text-stone-500">Retouche éditoriale</p>
                  <p className="text-2xl sm:text-2xl font-semibold text-stone-900">Avant / Après</p>
                </div>
                <div className="rounded-full bg-stone-100 px-4 py-2 sm:px-4 sm:py-2 text-xs sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] text-stone-600 ring-1 ring-stone-200">
                  Adobe Photoshop
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Avant", "Après"].map((label, idx) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
                  >
                    <div
                      className="aspect-[4/5] bg-cover bg-center"
                      style={{
                        backgroundImage:
                          idx === 0
                            ? "url('/images/IMG_0602.webp')"
                            : "url('/images/IMG_0602-2.webp')",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <p className="absolute left-4 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-stone-700 ring-1 ring-stone-200">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <ul className="grid gap-2 text-base text-stone-600">
                <li>• Travail de la peau naturel, sans lissage excessif</li>
                <li>• Ajustement colorimétrique calibré pour impression et web</li>
                <li>• Nettoyage de fond, suppression des éléments parasites</li>
                <li>• Export optimisé : HD, web, et profils ICC sur demande</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="services" className="grid gap-6 border-t border-stone-200/70 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                Prestations
              </p>
              <h2 className="mt-2 text-3xl sm:text-3xl font-semibold text-stone-900">Des offres claires, pensées pour vendre</h2>
              <p className="text-base sm:text-base text-stone-600">
                Portrait, branding, événementiel ou contenu social : je structure chaque prestation pour un rendu pro et cohérent.
              </p>
            </div>
            <a
              href="#contact"
              className="rounded-full border border-stone-300 px-5 py-3 sm:px-5 sm:py-2 text-sm sm:text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white w-fit"
            >
              Demander un devis
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Portrait",
                desc: "Portraits professionnels, artistiques et personnels. Lumière maîtrisée, direction précise, retouche naturelle.",
                badges: ["Studio mobile", "Lumière mixte", "Color grading"],
                link: "/portfolio?category=Portrait",
              },
              {
                title: "Instagram / Réseaux",
                desc: "Création de contenus photo pour Instagram, créateurs et marques. Images modernes, impactantes et optimisées pour le feed et les stories.",
                badges: ["Feed & Story", "Format vertical", "Optimisé réseaux"],
                link: "/portfolio?category=Instagram / Réseaux",
              },
              {
                title: "Événement",
                desc: "Reportages vibrants pour mariages, conférences, festivals. Narration visuelle discrète et énergique.",
                badges: ["Planning", "Photojournalisme", "Livraison rapide"],
                link: "/portfolio?category=Événement",
              },
              {
                title: "Animal",
                desc: "Portraits d'animaux de compagnie et sauvages. Captures émotionnelles révélant leur personnalité unique.",
                badges: ["Studio/Extérieur", "Approche douce", "Retouche naturelle"],
                link: "/portfolio?category=Animal",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.link}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300"
              >
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">{service.title}</h3>
                  <p className="mt-2 text-base text-stone-600">{service.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-stone-600 ring-1 ring-stone-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-t border-stone-200/70 pt-10 lg:grid-cols-3">
          {[
            {
              title: "Devis rapide & clair",
              desc: "Réponse sous 24-48h avec une proposition et un planning réalistes.",
            },
            {
              title: "Retouche premium",
              desc: "Color grading propre, peau naturelle, exports web & impression.",
            },
            {
              title: "Livraison sécurisée",
              desc: "Galerie privée, téléchargement simple, suivi post-livraison.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="text-lg font-semibold text-stone-900">{item.title}</p>
              <p className="mt-2 text-sm text-stone-600">{item.desc}</p>
            </div>
          ))}
        </section>

        <section
          id="portfolio"
          className="overflow-hidden border-t border-stone-200/70 pt-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                Preuves
              </p>
              <h2 className="mt-2 text-3xl sm:text-3xl font-semibold text-stone-900">Des exemples concrets de prestations</h2>
              <p className="text-base sm:text-base text-stone-600">
                Chaque projet illustre un type de prestation, avec un rendu final prêt pour la communication et la vente.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="rounded-full bg-[#1c1916] px-5 py-3 sm:px-5 sm:py-2 text-sm sm:text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 w-fit"
            >
              Voir les prestations
            </Link>
          </div>
          <div className="mt-6 sm:mt-8 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-stone-300"
              >
                <div
                  className="aspect-[4/5] bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${project.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 transition group-hover:opacity-85" />
                <div className="absolute inset-0 flex flex-col justify-end gap-1 sm:gap-2 p-3 sm:p-4">
                  <span className="w-fit rounded-full bg-white/80 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm font-semibold uppercase tracking-wide text-stone-700 ring-1 ring-stone-200">
                    {project.category}
                  </span>
                  <p className="text-base sm:text-xl font-semibold text-white leading-tight">{project.title}</p>
                  <p className="text-xs sm:text-base text-stone-200 leading-tight">{project.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="process"
          className="grid gap-6 border-t border-stone-200/70 pt-10 lg:grid-cols-[1.1fr,0.9fr]"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Process
            </p>
            <h2 className="text-3xl sm:text-3xl font-semibold text-stone-900">Un processus simple et efficace</h2>
            <p className="text-base sm:text-base text-stone-600">
              De notre premier échange à la livraison de tes photos, je te guide à chaque étape pour un résultat qui dépasse tes attentes.
            </p>
            <div className="mt-6 grid gap-4">
              {[
                {
                  step: "01",
                  title: "Brief & moodboard",
                  desc: "Analyse de vos besoins, références visuelles, planning, devis détaillé.",
                },
                {
                  step: "02",
                  title: "Prise de vue",
                  desc: "Gestion lumière naturelle ou artificielle, direction modèle.",
                },
                {
                  step: "03",
                  title: "Retouche calibrée",
                  desc: "Tri, retouche fine, harmonisation des tons, préparation impression/web.",
                },
                {
                  step: "04",
                  title: "Livraison & suivi",
                  desc: "Galerie privée, exports multi-formats, ajustements inclus, archivage 6 mois.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-stone-200 bg-white p-3 sm:p-4"
                >
                  <div className="flex h-10 w-10 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm sm:text-sm font-semibold text-stone-700 ring-1 ring-stone-200">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-lg sm:text-lg font-semibold text-stone-900">{item.title}</p>
                    <p className="text-sm sm:text-sm text-stone-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <p className="text-sm sm:text-sm uppercase tracking-[0.2em] text-stone-500">
                Offres rapides
              </p>
              <span className="rounded-full bg-stone-100 px-3 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-xs font-semibold uppercase tracking-wide text-stone-600 ring-1 ring-stone-200 w-fit">
                Retouche incluse
              </span>
            </div>
            <div className="space-y-4">
              {pricingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 rounded-xl bg-stone-50 px-3 py-2 sm:px-4 sm:py-3 ring-1 ring-stone-200"
                >
                  <div>
                    <p className="text-lg sm:text-lg font-semibold text-stone-900">{offer.name}</p>
                    <p className="text-sm sm:text-sm text-stone-600">{offer.desc}</p>
                  </div>
                  <p className="text-xl sm:text-xl font-semibold text-stone-900">{offer.price}</p>
                </div>
              ))}
            </div>
            <p className="text-base text-stone-600">
              Chaque prestation inclut une calibration colorimétrique et un suivi post-livraison.
          </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-[#1c1916] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                Réserver une prestation
              </a>
            </div>
        </div>
        </section>
        <section className="border-t border-stone-200/70 pt-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Témoignages
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-3xl font-semibold text-stone-900">Ce que disent les clients</h2>
                <p className="text-base text-stone-600 mt-2">
                  Des retours authentiques de clients qui ont fait confiance à LueurStudio pour leurs shootings.
                </p>
              </div>
              <Link
                href="/testimonials"
                className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white w-fit"
              >
                Laisser un avis
              </Link>
            </div>
            {testimonials.filter(t => t && t.approved !== false).length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.filter(t => t && t.approved !== false).map((testimony) => (
                  <div
                    key={testimony.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5"
                  >
                    {testimony.rating && (
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-base sm:text-lg ${i < testimony.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base sm:text-lg font-semibold text-white mb-1">{testimony.name}</p>
                    {testimony.role && (
                      <p className="text-xs sm:text-sm text-slate-300 mb-2">{testimony.role}</p>
                    )}
                    {testimony.project && (
                      <p className="text-xs text-stone-500 mb-2">Projet: {testimony.project}</p>
                    )}
                    <p className="mt-2 text-sm sm:text-base text-stone-600 italic leading-relaxed">"{testimony.quote}"</p>
                    {testimony.date && (
                      <p className="text-xs text-stone-400 mt-3">{new Date(testimony.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-base sm:text-lg text-stone-600 mb-4">
                  Aucun témoignage publié pour le moment. Soyez le premier à partager votre expérience !
                </p>
                <Link
                  href="/testimonials"
                  className="inline-block rounded-full bg-[#1c1916] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  Laisser un avis
                </Link>
              </div>
            )}
          </div>
        </section>
        <section className="border-t border-stone-200/70 pt-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold text-stone-900">Questions fréquentes</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <p className="text-base font-semibold text-stone-900">{item.question}</p>
                  <p className="mt-2 text-sm text-stone-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="border-t border-stone-200/70 pt-10"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Contact
            </p>
            <h2 className="text-3xl sm:text-3xl font-semibold text-stone-900">Prêt à créer quelque chose d'unique ensemble ?</h2>
            <p className="text-base sm:text-base text-stone-600">
              Partage-moi ton projet, tes envies, tes dates. Je te réponds rapidement avec une proposition sur mesure et un devis détaillé.
            </p>
            <ReservationForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200/70 bg-transparent px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3 text-sm sm:text-sm text-stone-600">
          <div>
            <p className="font-semibold text-stone-900">LueurStudio</p>
            <p className="text-sm sm:text-sm">Photographie, retouche, direction artistique — basé près de Paris.</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <Link className="underline hover:text-stone-900" href="/mentions-legales">
                Mentions légales
              </Link>
              <Link className="underline hover:text-stone-900" href="/politique-confidentialite">
                Politique de confidentialité
              </Link>
              <Link className="underline hover:text-stone-900" href="/infos-hebergeur">
                Infos hébergeur
              </Link>
              <a className="underline hover:text-stone-900" href="#contact">
                Contact
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <a 
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 sm:px-4 sm:py-2 text-center text-sm sm:text-sm transition hover:bg-stone-50" 
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              Instagram
            </a>
            <a className="rounded-full border border-stone-200 bg-white px-4 py-3 sm:px-4 sm:py-2 text-center text-sm sm:text-sm transition hover:bg-stone-50" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <a className="rounded-full bg-[#1c1916] px-4 py-3 sm:px-4 sm:py-2 text-center text-sm sm:text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20" href="#contact">
              Bookez une date
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
