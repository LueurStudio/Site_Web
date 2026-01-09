import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../projects-data";
import PhotoGallery from "./PhotoGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Projet non trouvé",
    };
  }

  const keywords = [
    `photographe ${project.category.toLowerCase()}`,
    `shooting ${project.category.toLowerCase()}`,
    "photographe professionnel Paris",
    "retouche photo professionnelle",
    ...(project.category === "Portrait" ? ["photographe portrait", "portrait professionnel"] : []),
    ...(project.category === "Événement" ? ["photographe événement", "reportage photo"] : []),
    ...(project.category === "Animal" ? ["photographe animal", "photo animalière"] : []),
    ...(project.category === "Instagram / Réseaux" ? ["photographe Instagram", "contenu photo réseaux sociaux"] : []),
  ];

  return {
    title: project.title,
    description: `${project.description} | ${project.category} par LueurStudio, photographe professionnel à Paris. Découvrez nos services de shooting photo et retouche haut de gamme.`,
    keywords,
    openGraph: {
      title: `${project.title} | LueurStudio`,
      description: project.description,
      url: `https://lueurstudio/portfolio/${slug}`,
      images: [
        {
          url: project.image.startsWith("http") ? project.image : `https://lueurstudio${project.image}`,
          alt: `${project.title} - ${project.category}`,
        },
      ],
    },
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `https://lueurstudio/portfolio/${project.slug}`,
            name: project.title,
            description: project.description,
            image: project.photos.map((photo) =>
              photo.startsWith("http") ? photo : `https://lueurstudio${photo}`
            ),
            creator: {
              "@type": "Organization",
              name: "LueurStudio",
              url: "https://lueurstudio",
            },
            about: {
              "@type": "Thing",
              name: project.category,
            },
            keywords: project.category,
            inLanguage: "fr-FR",
          }),
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(79,70,229,0.25),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(236,72,153,0.25),transparent_28%),radial-gradient(circle_at_50%_60%,rgba(14,165,233,0.2),transparent_30%)]" />

      <header className="mx-auto w-full max-w-6xl px-4 pb-6 sm:pb-8 pt-20 sm:px-6 md:px-10 lg:px-14">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-sm text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20 font-medium backdrop-blur-sm"
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
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-sm text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20 font-medium backdrop-blur-sm"
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
            <span>Retour au portfolio</span>
          </Link>
        </div>
        <div className="space-y-3 sm:space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/30">
          <p className="text-sm uppercase tracking-[0.4em] sm:tracking-[0.6em] text-indigo-100">
            {project.subtitle}
          </p>
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            {project.title}
          </h1>
          <p className="text-lg sm:text-lg text-slate-200">{project.description}</p>
          <ul className="flex flex-wrap gap-2 pt-2">
            {project.details.map((detail) => (
              <li
                key={detail}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-50 ring-1 ring-white/15"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-14 pb-16 sm:pb-20 md:pb-24">
        <PhotoGallery photos={project.photos} projectTitle={project.title} />

        <section className="mt-8 sm:mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 text-center shadow-xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.4em] text-indigo-100">
            Vous aimez ce projet ?
          </p>
          <h2 className="mt-3 sm:mt-4 text-3xl sm:text-3xl font-semibold text-white">
            Ce projet t'inspire ? Créons quelque chose d'encore plus fort ensemble.
          </h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-lg text-slate-200">
            Brief gratuit en visio ou sur place. Je te propose un moodboard personnalisé, un planning détaillé et un devis transparent. On démarre quand tu veux.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Réserver mon shooting
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/20 px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              Voir d&apos;autres projets
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

