import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, IcoArrow, IcoArrowUpRight, IcoCheck } from "../../components/ui";
import { supabaseServer } from "@/lib/supabaseServer";
import { toWebPUrl, toWebPUrls } from "@/lib/imageUrl";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { data } = await supabaseServer.from("projects").select("slug");
  return (data || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: p } = await supabaseServer.from("projects").select("*").eq("slug", slug).single();
  if (!p) return { title: "Projet — LueurStudio" };
  return {
    title: `${p.title} — LueurStudio`,
    description: p.description,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { data: project } = await supabaseServer.from("projects").select("*").eq("slug", slug).single();
  if (!project) notFound();

  const p = {
    ...project,
    details: project.details ?? [],
    image: toWebPUrl(project.image ?? ""),
    photos: toWebPUrls(project.photos ?? []),
  };

  const { data: allProjects } = await supabaseServer.from("projects").select("slug, title, image").neq("slug", slug).limit(1);
  const next = allProjects?.[0];

  return (
    <div className="page">
      <section className="pd-hero">
        <div className="wrap">
          <Link className="pd-back" href="/portfolio">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Portfolio
          </Link>
          <div className="pd-info">
            <div>
              <span className="pill" style={{ marginBottom: 18 }}>{p.category}</span>
              <h1 className="display pd-title" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>{p.title}</h1>
              <p className="lede" style={{ marginTop: 22 }}>{p.description}</p>
            </div>
            <div>
              <div className="pd-meta-list">
                <div className="row"><span>Catégorie</span><span>{p.category}</span></div>
                <div className="row"><span>Direction</span><span>{p.subtitle}</span></div>
                <div className="row"><span>Images</span><span>{p.photos.length} photos</span></div>
              </div>
              {p.details.length > 0 && (
                <ul className="pr-feats" style={{ marginTop: 0, borderTop: 0, paddingTop: 18 }}>
                  {p.details.map((d: string) => <li key={d}><IcoCheck />{d}</li>)}
                </ul>
              )}
              <Link className="btn btn-gold" style={{ marginTop: 8, width: "100%", justifyContent: "center" }} href="/reservation">
                Réserver une prestation similaire <IcoArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(40px,7vh,90px)" }}>
        <div className="wrap">
          <div className="pd-gallery">
            {p.photos.map((src: string, i: number) => (
              <Reveal key={i} className="frame" delay={((i % 3) + 1) as 1 | 2 | 3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${p.title} — photo ${i + 1}`} />
                <div className="corner" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {next && (
        <section className="section-tight">
          <div className="wrap">
            <hr className="rule" />
            <Link href={`/portfolio/${next.slug}`} className="flex" style={{ justifyContent: "space-between", alignItems: "center", gap: 24, paddingTop: 34, flexWrap: "wrap" }}>
              <div>
                <span className="kicker no-rule">Projet suivant</span>
                <h2 className="display" style={{ marginTop: 14, fontSize: "clamp(2rem,4vw,3.2rem)" }}>{next.title}</h2>
              </div>
              <div className="flex" style={{ alignItems: "center", gap: 22 }}>
                <div className="frame ratio-11" style={{ width: 120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={toWebPUrl(next.image ?? "")} alt={next.title} />
                </div>
                <span style={{ color: "var(--accent)" }}><IcoArrowUpRight size={28} /></span>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
