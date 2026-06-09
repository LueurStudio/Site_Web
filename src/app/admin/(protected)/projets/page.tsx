'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/app/portfolio/projects-data';
import type { Project } from '@/app/portfolio/projects-data';

type ProjectWithMeta = Project & { hidden?: boolean; homepage_featured?: boolean };

export default function ProjetsPage() {
  const [projects, setProjects] = useState<ProjectWithMeta[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const load = async () => {
    const res = await fetch('/api/projects/list?includeHidden=1');
    const data = await res.json();
    if (data.projects) setProjects(data.projects);
  };

  useEffect(() => { load(); }, []);

  const setFeatured = async (slug: string, featured: boolean) => {
    try {
      const res = await fetch('/api/projects/set-homepage-featured', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, featured }) });
      const data = await res.json();
      if (data.success) await load();
      else alert(data.error || 'Erreur');
    } catch { alert('Erreur lors de la mise à jour'); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="kicker">Administration</span>
          <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Projets</h1>
        </div>
        <Link href="/admin/projets/nouveau" className="btn btn-gold">+ Nouveau projet</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {categories.map((category) => {
          const catProjects = projects.filter((p) => p.category === category);
          if (catProjects.length === 0) return null;
          return (
            <div key={category} className="surface-card" style={{ padding: "clamp(20px,3vw,32px)" }}>
              <h3 className="display" style={{ fontSize: "1.3rem", marginBottom: 20 }}>{category}</h3>
              <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                {catProjects.map((project) => (
                  <div key={project.slug} className="surface-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Photo avec étoile */}
                    <div style={{ position: "relative" }}>
                      <div style={{ aspectRatio: "4/5", backgroundImage: `url('${project.image}')`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 10 }} />
                      <button
                        onClick={() => setFeatured(project.slug, !project.homepage_featured)}
                        title={project.homepage_featured ? "Retirer de l'accueil" : "Mettre en couverture accueil"}
                        style={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, borderRadius: "50%", border: project.homepage_featured ? "2px solid var(--accent)" : "2px solid rgba(255,255,255,0.3)", background: project.homepage_featured ? "var(--accent)" : "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", color: project.homepage_featured ? "#1a1208" : "#fff", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      >
                        {project.homepage_featured ? '★' : '☆'}
                      </button>
                    </div>

                    {/* Infos */}
                    <h4 style={{ fontWeight: 600, fontSize: "0.95rem" }}>{project.title}</h4>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {project.hidden && <span style={{ fontSize: "0.72rem", background: "rgba(232,112,112,0.15)", color: "#fca5a5", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>Masqué</span>}
                      <span className="muted" style={{ fontSize: "0.78rem" }}>{project.photos.length} photo(s)</span>
                    </div>

                    <Link href={`/admin/projets/${project.slug}`} className="btn btn-outline" style={{ fontSize: "0.82rem", justifyContent: "center", marginTop: "auto" }}>Éditer</Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="surface-card" style={{ padding: "clamp(32px,4vw,64px)", textAlign: "center" }}>
            <p className="muted" style={{ marginBottom: 20 }}>Aucun projet. Commencez par en créer un.</p>
            <Link href="/admin/projets/nouveau" className="btn btn-gold">+ Nouveau projet</Link>
          </div>
        )}
      </div>
    </div>
  );
}
