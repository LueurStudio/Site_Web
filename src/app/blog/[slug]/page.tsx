import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { Reveal, IcoArrow } from "../../components/ui";

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
    title: `${post.title} — LueurStudio`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: `${post.title} | LueurStudio`,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`, width: 1200, height: 630, alt: post.title }],
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
    <div className="page">
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
            publisher: { "@type": "Organization", name: "LueurStudio", logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.svg` } },
            image: post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`,
            url: `${siteUrl}/blog/${slug}`,
            keywords: post.keywords.join(", "),
            inLanguage: "fr-FR",
          }),
        }}
      />

      <section style={{ paddingTop: "clamp(100px,14vh,160px)", paddingBottom: "clamp(40px,5vh,64px)" }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <Link className="pd-back" href="/blog">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Journal
            </Link>
          </Reveal>
          <Reveal delay={1} style={{ marginTop: 28 }}>
            <div className="flex" style={{ gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
              <span className="pill">{post.category}</span>
              <time className="muted" dateTime={post.date} style={{ fontFamily: "var(--ff-mono)", fontSize: 12, letterSpacing: "0.08em" }}>{formatDate(post.date)}</time>
              <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{post.readingTime} min de lecture</span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1.15 }}>{post.title}</h1>
            <p className="lede" style={{ marginTop: 22 }}>{post.description}</p>
          </Reveal>
        </div>
      </section>

      <article style={{ paddingBottom: "clamp(60px,9vh,120px)" }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <div className="bl-prose">
            <MDXRemote source={post.content} />
          </div>

          <hr className="rule" style={{ marginTop: 64 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 32, paddingTop: 48, alignItems: "center" }}>
            <div>
              <span className="kicker">Prêt à passer à l&apos;action ?</span>
              <h2 className="display" style={{ marginTop: 20, fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>Réserve ton shooting photo à Paris</h2>
              <p className="muted" style={{ marginTop: 16, lineHeight: 1.75 }}>Brief gratuit en visio ou sur place. Moodboard personnalisé et devis en moins de 24h.</p>
            </div>
            <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
              <Link className="btn btn-gold" href="/reservation" style={{ justifyContent: "center" }}>
                Réserver mon shooting <IcoArrow />
              </Link>
              <Link className="btn btn-outline" href="/blog" style={{ justifyContent: "center" }}>
                Retour au journal
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
