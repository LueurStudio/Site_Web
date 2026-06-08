import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lueurstudio-photographie.fr";

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: `${post.title} | LueurStudio`,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["LueurStudio"],
      images: [
        {
          url: post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lueurstudio-photographie.fr";

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: "LueurStudio", url: siteUrl },
            publisher: {
              "@type": "Organization",
              name: "LueurStudio",
              logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.svg` },
            },
            image: post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`,
            url: `${siteUrl}/blog/${slug}`,
            keywords: post.keywords.join(", "),
            inLanguage: "fr-FR",
          }),
        }}
      />

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 hover:text-[#1c1916]"
            >
              ← Retour au blog
            </Link>
            <span>·</span>
            <span className="rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-500 ring-1 ring-stone-300">
              {post.category}
            </span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime} min de lecture</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="text-lg text-stone-500">{post.description}</p>
        </header>

        <div className="prose prose-lg max-w-none
          prose-headings:font-semibold prose-headings:text-[#1c1916]
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-stone-600 prose-p:leading-relaxed
          prose-strong:text-[#1c1916]
          prose-a:text-stone-600 prose-a:no-underline hover:prose-a:text-[#1c1916]
          prose-li:text-stone-600
          prose-table:text-sm
          prose-th:text-[#1c1916] prose-th:border-stone-300/60
          prose-td:border-stone-200/60 prose-td:text-stone-600
          prose-hr:border-stone-200/60
          prose-blockquote:border-stone-400 prose-blockquote:text-stone-500
        ">
          <MDXRemote source={post.content} />
        </div>

        <footer className="mt-16 rounded-3xl border border-stone-200/60 bg-stone-50 p-8 text-center shadow-xl shadow-stone-300/30">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
            Prêt à passer à l&apos;action ?
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Réserve ton shooting photo à Paris
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-stone-600">
            Brief gratuit en visio ou sur place. Moodboard personnalisé et devis en moins de 24h.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            >
              Réserver mon shooting
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-stone-300/60 px-6 py-3 text-sm font-semibold text-[#1c1916] transition hover:border-stone-400 hover:bg-stone-100"
            >
              Retour au blog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
