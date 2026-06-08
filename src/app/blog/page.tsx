import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Photo",
  description:
    "Conseils de photographe, guides pratiques et astuces pour réussir vos shootings photo à Paris. Articles sur la retouche, les portraits, le mariage, Instagram et plus encore.",
  keywords: [
    "blog photographe Paris",
    "conseils shooting photo",
    "guide photo portrait",
    "astuces photographe",
    "blog retouche photo",
    "blog photo Paris",
  ],
  openGraph: {
    title: "Blog — LueurStudio | Conseils Photo & Shooting Paris",
    description:
      "Conseils de photographe, guides pratiques et astuces pour réussir vos shootings photo à Paris.",
    url: "https://www.lueurstudio-photographie.fr/blog",
  },
  alternates: { canonical: "/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Conseils: "bg-indigo-500/20 text-stone-500 ring-stone-300",
  Mariage: "bg-rose-100 text-rose-600 ring-rose-300",
  Technique: "bg-cyan-100 text-cyan-600 ring-cyan-300",
  "Réseaux sociaux": "bg-fuchsia-100 text-fuchsia-600 ring-fuchsia-300",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog LueurStudio",
            description:
              "Conseils photo, guides de shooting et astuces professionnelles par LueurStudio, photographe à Paris.",
            url: "https://www.lueurstudio-photographie.fr/blog",
            publisher: {
              "@type": "Organization",
              name: "LueurStudio",
              url: "https://www.lueurstudio-photographie.fr",
            },
          }),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 md:px-14">
        <header className="mb-12 space-y-4 rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-100 via-stone-50 to-white p-8 md:p-12 shadow-2xl shadow-stone-300/40">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Blog</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Conseils, guides & inspirations photo
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Préparer son shooting, choisir un photographe, comprendre la retouche — tout ce qu&apos;il faut savoir pour des photos professionnelles à Paris.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const colorClass =
              CATEGORY_COLORS[post.category] ??
              "bg-stone-100 text-stone-400 ring-stone-200";
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-stone-200/60 bg-white/80 p-5 shadow-lg transition hover:border-stone-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${colorClass}`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-stone-400">
                    {post.readingTime} min de lecture
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold leading-snug text-[#1c1916] transition group-hover:text-stone-500">
                    {post.title}
                  </h2>
                  <p className="text-sm text-stone-500 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="text-stone-600 transition group-hover:translate-x-1">
                    Lire →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-16 rounded-3xl border border-stone-200/60 bg-stone-50 p-8 text-center shadow-xl shadow-stone-300/30">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
            Prêt à passer à l&apos;action ?
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Réserve ton shooting photo à Paris
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-stone-600">
            Brief gratuit en visio ou sur place. Moodboard personnalisé et devis détaillé en moins de 24h.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Réserver mon shooting
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
