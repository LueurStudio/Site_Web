import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, formatDate } from "@/lib/blog";
import { Reveal, IcoArrow, IcoArrowUpRight } from "../components/ui";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "Journal — LueurStudio | Photographe Paris",
  description:
    "Conseils de photographe, guides pratiques et astuces pour réussir vos shootings photo à Paris. Retouche, portraits, événements et plus encore.",
  openGraph: {
    title: "Journal — LueurStudio | Conseils Photo & Shooting Paris",
    description: "Conseils de photographe, guides pratiques et astuces pour réussir vos shootings photo à Paris.",
    url: "https://www.lueurstudio-photographie.fr/blog",
  },
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Journal LueurStudio",
            description: "Conseils photo, guides de shooting et astuces professionnelles par LueurStudio, photographe à Paris.",
            url: "https://www.lueurstudio-photographie.fr/blog",
            publisher: { "@type": "Organization", name: "LueurStudio", url: "https://www.lueurstudio-photographie.fr" },
          }),
        }}
      />

      <section className="page-head">
        <div className="wrap">
          <Reveal as="span" className="kicker">Journal · {posts.length} articles</Reveal>
          <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, maxWidth: "14ch" }}>
            Conseils, guides &<br /><span className="serif-italic gold-text">inspirations</span>.
          </Reveal>
          <Reveal className="lede" delay={2} style={{ marginTop: 24 }}>
            Préparer son shooting, choisir un photographe, comprendre la retouche — tout ce qu&apos;il faut savoir.
          </Reveal>
        </div>
      </section>

      {featured && (
        <section style={{ paddingBottom: "clamp(40px,5vh,64px)" }}>
          <div className="wrap">
            <Reveal className="bl-feat">
              <Link href={`/blog/${featured.slug}`} className="bl-feat-link">
                <div className="frame bl-feat-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.image} alt={featured.title} />
                  <div className="corner" />
                </div>
                <div className="bl-feat-body">
                  <span className="pill">{featured.category}</span>
                  <h2 className="display" style={{ marginTop: 20, fontSize: "clamp(1.8rem,3.5vw,3rem)" }}>{featured.title}</h2>
                  <p className="lede" style={{ marginTop: 18, fontSize: "clamp(1rem,1.4vw,1.15rem)" }}>{featured.description}</p>
                  <div className="flex" style={{ gap: 20, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
                    <time className="muted" dateTime={featured.date} style={{ fontFamily: "var(--ff-mono)", fontSize: 12, letterSpacing: "0.08em" }}>{formatDate(featured.date)}</time>
                    <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{featured.readingTime} min</span>
                    <span className="btn btn-ghost" style={{ marginLeft: "auto" }}>Lire <IcoArrowUpRight size={14} /></span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section style={{ paddingBottom: "clamp(60px,9vh,120px)" }}>
          <div className="wrap">
            <div className="bl-grid">
              {rest.map((post, i) => (
                <Reveal key={post.slug} delay={((i % 3) + 1) as 1 | 2 | 3} className="bl-card">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="frame ratio-169 bl-card-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt={post.title} />
                      <div className="corner" />
                    </div>
                    <div className="bl-card-body">
                      <div className="flex" style={{ gap: 10, alignItems: "center", marginBottom: 14 }}>
                        <span className="pill">{post.category}</span>
                        <span className="muted" style={{ fontFamily: "var(--ff-mono)", fontSize: 11, marginLeft: "auto" }}>{post.readingTime} min</span>
                      </div>
                      <h3 className="bl-card-title">{post.title}</h3>
                      <p className="muted bl-card-desc">{post.description}</p>
                      <time className="muted" dateTime={post.date} style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.06em", display: "block", marginTop: 16 }}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section style={{ padding: "clamp(60px,9vh,120px) 0" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <p className="lede muted">Le journal arrive bientôt.</p>
            <Link className="btn btn-gold" href="/reservation" style={{ marginTop: 28 }}>
              Réserver une séance <IcoArrow />
            </Link>
          </div>
        </section>
      )}

      <CTABand />
    </div>
  );
}
