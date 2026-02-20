import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoGallery from "./PhotoGallery";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await supabaseServer.from("projects").select("slug");
  return (data || []).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    return {
      title: "Projet non trouvé",
    };
  }

  const normalizedProject = {
    ...project,
    details: project.details ?? [],
    photos: project.photos ?? [],
  };

  const keywords = [
    `photographe ${normalizedProject.category.toLowerCase()}`,
    `shooting ${normalizedProject.category.toLowerCase()}`,
    "photographe professionnel Paris",
    "retouche photo professionnelle",
    ...(normalizedProject.category === "Portrait" ? ["photographe portrait", "portrait professionnel"] : []),
    ...(normalizedProject.category === "Événement" ? ["photographe événement", "reportage photo"] : []),
    ...(normalizedProject.category === "Animal" ? ["photographe animal", "photo animalière"] : []),
    ...(normalizedProject.category === "Instagram / Réseaux" ? ["photographe Instagram", "contenu photo réseaux sociaux"] : []),
  ];

  return {
    title: normalizedProject.title,
    description: `${normalizedProject.description} | ${normalizedProject.category} par LueurStudio, photographe professionnel à Paris. Découvrez nos services de shooting photo et retouche haut de gamme.`,
    keywords,
    openGraph: {
      title: `${normalizedProject.title} | LueurStudio`,
      description: normalizedProject.description,
      url: `https://lueurstudio/portfolio/${slug}`,
      images: [
        {
          url: normalizedProject.image.startsWith("http") ? normalizedProject.image : `https://lueurstudio${normalizedProject.image}`,
          alt: `${normalizedProject.title} - ${normalizedProject.category}`,
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
  const { data: project } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    notFound();
  }

  const normalizedProject = {
    ...project,
    details: project.details ?? [],
    photos: project.photos ?? [],
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `https://lueurstudio/portfolio/${normalizedProject.slug}`,
            name: normalizedProject.title,
            description: normalizedProject.description,
            image: normalizedProject.photos.map((photo: string) =>
              photo.startsWith("http") ? photo : `https://lueurstudio${photo}`
            ),
            creator: {
              "@type": "Organization",
              name: "LueurStudio",
              url: "https://lueurstudio",
            },
            about: {
              "@type": "Thing",
              name: normalizedProject.category,
            },
            keywords: normalizedProject.category,
            inLanguage: "fr-FR",
          }),
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(180,140,96,0.12),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(56,189,248,0.08),transparent_30%)]" />

      <header className="mx-auto w-full max-w-6xl px-4 pb-6 sm:pb-8 pt-20 sm:px-6 md:px-10 lg:px-14">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-sm text-stone-700 transition-all duration-200 hover:border-stone-400 hover:bg-stone-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 font-medium"
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
            className="group inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 sm:px-5 py-2.5 sm:py-2 text-sm sm:text-sm text-stone-700 transition-all duration-200 hover:border-stone-400 hover:bg-stone-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 font-medium"
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
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] sm:tracking-[0.6em] text-stone-500">
            {normalizedProject.subtitle}
          </p>
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold leading-tight text-stone-900">
            {normalizedProject.title}
          </h1>
          <p className="text-lg sm:text-lg text-stone-600">{normalizedProject.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              Demander un devis
            </Link>
            <Link
              href="/#services"
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
            >
              Voir les prestations
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2 pt-2">
            {normalizedProject.details.map((detail: string) => (
              <li
                key={detail}
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-stone-600 ring-1 ring-stone-200"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-14 pb-16 sm:pb-20 md:pb-24">
        <PhotoGallery photos={normalizedProject.photos} projectTitle={normalizedProject.title} />

        <section className="mt-8 sm:mt-12 border-t border-stone-200/70 pt-10 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-stone-500">
            Vous aimez ce projet ?
          </p>
          <h2 className="mt-3 sm:mt-4 text-3xl sm:text-3xl font-semibold text-stone-900">
            Ce projet t'inspire ? Créons quelque chose d'encore plus fort ensemble.
          </h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-lg text-stone-600">
            Brief gratuit en visio ou sur place. Je te propose un moodboard personnalisé, un planning détaillé et un devis transparent. On démarre quand tu veux.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              Réserver mon shooting
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-stone-300 px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
            >
              Voir d&apos;autres projets
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

