'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/app/portfolio/projects-data';
import { uploadFiles } from '@/app/admin/_lib/imageUtils';

type ProjectWithMeta = Project & { hidden?: boolean; homepage_featured?: boolean };

export default function EditProjetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectWithMeta | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/projects/list?includeHidden=1')
      .then((r) => r.json())
      .then((data) => {
        const p = (data.projects || []).find((x: any) => x.slug === slug);
        if (p) { setProject(p); setPhotos(p.photos || []); setCoverUrl(p.image || ''); }
        else router.replace('/admin/projets');
      })
      .catch(() => router.replace('/admin/projets'));
  }, [slug, router]);

  const savePhotos = async () => {
    if (!project) return;
    if (photos.length === 0) { setError('Le projet doit avoir au moins une photo'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/projects/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: project.slug, photos }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else setError(data.error || 'Erreur lors de la sauvegarde');
    } catch { setError('Erreur lors de la sauvegarde'); }
    finally { setLoading(false); }
  };

  const setCover = async (url: string) => {
    if (!project) return;
    try {
      const res = await fetch('/api/projects/set-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: project.slug, coverUrl: url }),
      });
      const data = await res.json();
      if (data.success) { setCoverUrl(url); setProject({ ...project, image: url }); }
      else alert(data.error || 'Erreur');
    } catch { alert('Erreur lors de la mise à jour'); }
  };

  const setFeatured = async () => {
    if (!project) return;
    const newFeatured = !project.homepage_featured;
    try {
      const res = await fetch('/api/projects/set-homepage-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: project.slug, featured: newFeatured }),
      });
      const data = await res.json();
      if (data.success) setProject({ ...project, homepage_featured: newFeatured });
      else alert(data.error || 'Erreur');
    } catch { alert('Erreur'); }
  };

  const toggleVisibility = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects/visibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: project.slug, hidden: !project.hidden }) });
      const data = await res.json();
      if (data.success) setProject({ ...project, hidden: !project.hidden });
      else setError(data.error || 'Erreur');
    } catch { setError('Erreur'); }
    finally { setLoading(false); }
  };

  const deleteProject = async () => {
    if (!project || !confirm(`Supprimer "${project.title}" ? Cette action est irréversible.`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: project.slug }) });
      const data = await res.json();
      if (data.success) router.push('/admin/projets');
      else setError(data.error || 'Erreur lors de la suppression');
    } catch { setError('Erreur lors de la suppression'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(files));
      if (urls.length) setPhotos((prev) => [...prev, ...urls]);
    } finally { setUploading(false); e.target.value = ''; }
  };

  const removePhoto = (index: number) => {
    if (confirm('Supprimer cette photo ?')) setPhotos(photos.filter((_, i) => i !== index));
  };

  if (!project) {
    return <div style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}><p className="muted">Chargement…</p></div>;
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <button onClick={() => router.push('/admin/projets')} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", marginBottom: 12 }}>← Retour aux projets</button>
          <h1 className="display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{project.title}</h1>
          <p className="muted" style={{ marginTop: 6, fontSize: "0.88rem" }}>{project.category}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={setFeatured} className="btn btn-outline" style={{ fontSize: "0.85rem", color: project.homepage_featured ? "var(--accent)" : undefined, borderColor: project.homepage_featured ? "var(--accent)" : undefined }}>
            {project.homepage_featured ? '★ En couverture' : '☆ Couverture accueil'}
          </button>
          <button onClick={toggleVisibility} disabled={loading} className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
            {project.hidden ? 'Rendre visible' : 'Masquer'}
          </button>
          <button onClick={deleteProject} disabled={loading} className="btn" style={{ fontSize: "0.85rem", background: "rgba(232,112,112,0.15)", color: "#e87070", border: "1px solid rgba(232,112,112,0.4)" }}>
            Supprimer
          </button>
        </div>
      </div>

      {/* Photo de couverture actuelle */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,32px)", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 6, fontSize: "1.1rem" }}>Photo de couverture</h2>
        <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 16 }}>
          Cliquez sur <strong style={{ color: "var(--accent)" }}>▶ Définir comme couverture</strong> sur n'importe quelle photo pour la sélectionner.
        </p>
        {coverUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="Couverture actuelle" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid var(--accent)" }} />
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--accent)" }}>★ Couverture actuelle</p>
              <p className="muted" style={{ fontSize: "0.78rem", marginTop: 4, wordBreak: "break-all", maxWidth: 400 }}>{coverUrl.split('/').pop()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grille de photos */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,32px)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontWeight: 600, fontSize: "1.1rem" }}>Photos du projet</h2>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>Glissez pour réordonner · Cliquez ★ pour la couverture · × pour supprimer</p>
          </div>
          <span className="muted" style={{ fontSize: "0.85rem" }}>{photos.length} photo(s)</span>
        </div>

        {photos.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune photo dans ce projet</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {photos.map((photo, index) => {
              const isCover = photo === coverUrl;
              return (
                <div
                  key={`${photo}-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null && dragIndex !== index) {
                      const next = [...photos];
                      const [moved] = next.splice(dragIndex, 1);
                      next.splice(index, 0, moved);
                      setPhotos(next);
                    }
                    setDragIndex(null); setDragOverIndex(null);
                  }}
                  onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                  style={{ position: "relative", cursor: "move", borderRadius: 12, border: `2px solid ${isCover ? "var(--accent)" : dragOverIndex === index ? "#7b9fe0" : "var(--line)"}`, opacity: dragIndex === index ? 0.5 : 1, transition: "border-color 0.2s", overflow: "hidden" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={`Photo ${index + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />

                  {/* Badge couverture */}
                  {isCover && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--accent)", color: "#1a1208", textAlign: "center", fontSize: "0.72rem", fontWeight: 700, padding: "4px 0" }}>★ COUVERTURE</div>
                  )}

                  {/* Numéro */}
                  <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>#{index + 1}</div>

                  {/* Bouton supprimer */}
                  <button onClick={(e) => { e.stopPropagation(); removePhoto(index); }} style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "#e87070", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }} title="Supprimer">×</button>

                  {/* Bouton couverture — s'affiche au survol */}
                  {!isCover && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setCover(photo); }}
                      style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", padding: "4px 10px", borderRadius: 99, background: "var(--accent)", color: "#1a1208", border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700, opacity: 0, transition: "opacity 0.2s" }}
                      className="cover-btn"
                      title="Définir comme couverture"
                    >
                      ▶ Couverture
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <style>{`.cover-btn { opacity: 0 !important; } *:hover > .cover-btn { opacity: 1 !important; }`}</style>
      </div>

      {/* Ajout de photos */}
      <div className="surface-card" style={{ padding: "clamp(20px,2.5vw,32px)", marginBottom: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 12 }}>Ajouter des photos</p>
        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple disabled={uploading} onChange={handleUpload} style={{ display: "block", width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--line)", color: "var(--fg-soft)", cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1 }} />
        {uploading && <p style={{ marginTop: 10, fontSize: "0.88rem", color: "var(--accent)" }}>⏳ Upload en cours…</p>}
        <p className="muted" style={{ marginTop: 8, fontSize: "0.82rem" }}>JPG, PNG ou WebP · compression automatique · max 10 MB</p>
      </div>

      {/* Sauvegarde */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={savePhotos} disabled={loading} className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }}>
          {saved ? '✓ Sauvegardé !' : loading ? 'Sauvegarde…' : 'Sauvegarder les photos'}
        </button>
        <button onClick={() => { if (project) setPhotos(project.photos); }} className="btn btn-outline" style={{ fontSize: "0.88rem" }}>Annuler</button>
      </div>

      {error && <p style={{ color: "#e87070", fontSize: "0.88rem", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
