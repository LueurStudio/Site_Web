import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "../projects-data";

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
      url: `https://lueurstudio.fr/portfolio/${slug}`,
      images: [
        {
          url: project.image.startsWith("http") ? project.image : `https://lueurstudio.fr${project.image}`,
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
            "@id": `https://lueurstudio.fr/portfolio/${project.slug}`,
            name: project.title,
            description: project.description,
            image: project.photos.map((photo) =>
              photo.startsWith("http") ? photo : `https://lueurstudio.fr${photo}`
            ),
            creator: {
              "@type": "Organization",
              name: "LueurStudio",
              url: "https://lueurstudio.fr",
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
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-indigo-200 transition hover:text-white"
          >
            <svg
              className="h-4 w-4"
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
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-indigo-200 transition hover:text-white"
          >
            <svg
              className="h-4 w-4"
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
            Retour au portfolio
          </Link>
        </div>
        <div className="space-y-3 sm:space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/30">
          <p className="text-xs uppercase tracking-[0.4em] sm:tracking-[0.6em] text-indigo-100">
            {project.subtitle}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-200">{project.description}</p>
          <ul className="flex flex-wrap gap-2 pt-2">
            {project.details.map((detail) => (
              <li
                key={detail}
                className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-50 ring-1 ring-white/15"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-14 pb-16 sm:pb-20 md:pb-24">
        <section className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {project.photos.map((photo, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"
            >
              <div className="aspect-[4/5] relative">
                <Image
                  src={photo}
                  alt={`${project.title} - ${project.category} - Photo ${index + 1} par LueurStudio, photographe professionnel à Paris`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 sm:mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 text-center shadow-xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-100">
            Vous aimez ce projet ?
          </p>
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-semibold text-white">
            Ce projet t'inspire ? Créons quelque chose d'encore plus fort ensemble.
          </h2>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-200">
            Brief gratuit en visio ou sur place. Je te propose un moodboard personnalisé, un planning détaillé et un devis transparent en moins de 24h. On démarre quand tu veux.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Réserver mon shooting
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              Voir d&apos;autres projets
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

