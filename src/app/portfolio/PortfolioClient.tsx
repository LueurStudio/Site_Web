"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Reveal, IcoArrowUpRight } from "../components/ui";
import CTABand from "../components/CTABand";

type Project = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  details: string[];
  photos: string[];
  category: string;
};

const CATEGORIES = ["Portrait", "Événement", "Animal", "Instagram / Réseaux"];

const PF_SPANS = [
  { c: 7, r: "ratio-32" },
  { c: 5, r: "ratio-45" },
  { c: 5, r: "ratio-45" },
  { c: 7, r: "ratio-32" },
  { c: 6, r: "ratio-45" },
  { c: 6, r: "ratio-45" },
  { c: 12, r: "ratio-169" },
];

export default function PortfolioClient() {
  const [cat, setCat] = useState("Tout");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((d) => { if (d.projects) setProjects(d.projects); })
      .catch(console.error);
  }, []);

  const list = useMemo(
    () => cat === "Tout" ? projects : projects.filter((p) => p.category === cat),
    [cat, projects]
  );

  const cats = ["Tout", ...CATEGORIES];

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal as="span" className="kicker">Portfolio · {projects.length} projets</Reveal>
          <Reveal as="h1" className="display" delay={1} style={{ maxWidth: "13ch" }}>
            Une sélection de <span className="serif-italic gold-text">prestations</span>.
          </Reveal>
          <Reveal className="lede" delay={2} style={{ marginTop: 22 }}>
            Chaque projet illustre un type de prestation, du portrait intimiste au reportage vibrant — avec un rendu final prêt pour la communication.
          </Reveal>
          <Reveal className="pf-filters" delay={2}>
            {cats.map((c) => (
              <button key={c} className={"pf-chip" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>{c}</button>
            ))}
          </Reveal>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(60px,9vh,120px)" }}>
        <div className="wrap">
          {list.length === 0 ? (
            <div style={{ border: "1px solid var(--line)", background: "var(--surface)", padding: 48, textAlign: "center" }}>
              <p className="muted">Aucun projet dans cette catégorie.</p>
            </div>
          ) : (
            <div className="pf-grid">
              {list.map((p, i) => {
                const sp = PF_SPANS[i % PF_SPANS.length];
                return (
                  <Reveal key={p.slug} delay={((i % 3) + 1) as 1 | 2 | 3} className="pf-card" style={{ gridColumn: "span " + sp.c }}>
                    <Link href={`/portfolio/${p.slug}`}>
                      <div className={"frame " + sp.r}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} />
                        <div className="corner" />
                        <div className="img-cap">
                          <span className="pill">{p.category}</span>
                          <IcoArrowUpRight size={18} />
                        </div>
                      </div>
                      <div className="pf-meta-row">
                        <h3>{p.title}</h3>
                      </div>
                      <p className="pf-sub">{p.subtitle}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTABand />
    </>
  );
}
