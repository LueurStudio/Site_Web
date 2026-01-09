'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { projects, categories, type Project } from "./projects-data";
import { CONTACT_EMAIL } from "@/config/contact";

export default function PortfolioClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  const activeProject = useMemo(() => {
    if (!activeSlug) return null;
    return filteredProjects.find((p) => p.slug === activeSlug) ?? null;
  }, [activeSlug, filteredProjects]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfolio LueurStudio",
            description:
              "Portfolio de photographie professionnelle : portraits, événements, photos d'animaux et contenus pour réseaux sociaux",
            url: "https://lueurstudio/portfolio",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: filteredProjects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "CreativeWork",
                  name: project.title,
                  description: project.description,
                  url: `https://lueurstudio/portfolio/${project.slug}`,
                  image: project.image.startsWith("http") ? project.image : `https://lueurstudio${project.image}`,
                },
              })),
            },
          }),
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(79,70,229,0.25),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(236,72,153,0.25),transparent_28%),radial-gradient(circle_at_50%_60%,rgba(14,165,233,0.2),transparent_30%)]" />

      <header className="mx-auto w-full max-w-6xl px-4 pb-6 sm:pb-8 md:pb-10 pt-20 sm:px-6 md:px-10 lg:px-14">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-sm text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20 font-medium backdrop-blur-sm mb-4 sm:mb-6"
        >
          <svg
            className="h-4 w-4 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Retour à l&apos;accueil</span>
        </Link>
        <div className="space-y-4 sm:space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/30">

          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] sm:tracking-[0.6em] text-indigo-100">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              Chaque projet raconte une histoire unique.
            </h1>
            <p className="text-lg sm:text-lg text-slate-200">
              Découvre mes réalisations et laisse-toi inspirer. Passe ta souris sur une vignette pour en savoir plus, ou clique pour voir toutes les photos du shooting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveSlug(null);
              }}
              className={`rounded-full px-4 py-2.5 sm:px-4 sm:py-2 text-sm sm:text-sm font-semibold transition whitespace-nowrap ${selectedCategory === null
                  ? "bg-white text-slate-900"
                  : "border border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                }`}
            >
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveSlug(null);
                }}
                className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${selectedCategory === category
                    ? "bg-white text-slate-900"
                    : "border border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-12 px-4 sm:px-6 md:px-10 lg:px-14 pb-16 sm:pb-20 md:pb-24">
        <section className="grid gap-6 sm:gap-8 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 shadow-2xl shadow-indigo-950/30 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const isActive = project.slug === activeProject?.slug;
                return (
                  <Link
                    key={project.slug}
                    href={`/portfolio/${project.slug}`}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    onMouseLeave={() => setActiveSlug(null)}
                    className={`group relative overflow-hidden rounded-2xl border block transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${isActive
                        ? "border-white/50 shadow-xl shadow-indigo-950/40"
                        : "border-white/10 hover:border-white/30"
                      }`}
                  >
                    <div
                      className="aspect-[4/5] bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${project.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4">
                      <span className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-indigo-100 ring-1 ring-white/20">
                        {project.category}
                      </span>
                      <p className="text-sm uppercase tracking-[0.4em] text-indigo-200">
                        {project.subtitle}
                      </p>
                      <p className="text-xl font-semibold text-white">
                        {project.title}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">
                <p className="text-slate-300">Aucun projet dans cette catégorie.</p>
              </div>
            )}
          </div>

          {activeProject && (
            <div className="flex h-full flex-col gap-3 sm:gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-100">
                Description
              </p>
              <h2 className="text-3xl sm:text-3xl font-semibold text-white">
                {activeProject.title}
              </h2>
              <p className="text-sm sm:text-sm uppercase tracking-[0.4em] text-indigo-200">
                {activeProject.subtitle}
              </p>
              <p className="text-base sm:text-base text-slate-200">{activeProject.description}</p>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-sm text-indigo-50">
                {activeProject.details.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Link
                  href={`/portfolio/${activeProject.slug}`}
                  className="rounded-full bg-white px-5 py-3 sm:px-5 sm:py-2 text-sm sm:text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 text-center"
                >
                  Voir toutes les photos
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-full border border-white/20 px-5 py-3 sm:px-5 sm:py-2 text-sm sm:text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 text-center"
                >
                  Créer un projet similaire
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 text-center shadow-xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.4em] text-indigo-100">
            Vous avez un projet ?
          </p>
          <h2 className="mt-3 sm:mt-4 text-3xl sm:text-3xl font-semibold text-white">
            Envie de créer des images qui te ressemblent ?
          </h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-lg text-slate-200">
            Brief gratuit en visio ou sur place. Je te propose un moodboard personnalisé, un planning détaillé et un devis transparent. Prêt à démarrer ?
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Réserver mon shooting
            </Link>
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full border border-white/20 px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 break-all sm:break-normal"
            >
              {CONTACT_EMAIL}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

