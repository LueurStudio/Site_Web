'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/app/portfolio/projects-data';
import { uploadFiles } from '@/app/admin/_lib/imageUtils';

type Mode = 'rapide' | 'complet';

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  description: '',
  category: categories[0] as typeof categories[number],
  details: ['', '', ''],
  photos: [] as string[],
};

export default function NouveauProjetPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('rapide');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(files));
      if (urls.length) setForm((prev) => ({ ...prev, photos: [...prev.photos, ...urls] }));
    } finally { setUploading(false); e.target.value = ''; }
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Le titre est requis'); return; }
    if (form.photos.length === 0) { setError('Ajoutez au moins une photo'); return; }
    setLoading(true); setError('');
    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim() || form.title.trim(),
        category: form.category,
        image: form.photos[0],
        photos: form.photos,
        details: mode === 'complet' ? form.details.filter((d) => d.trim()) : [],
      };
      const res = await fetch('/api/projects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) router.push('/admin/projets');
      else setError(data.error || 'Erreur lors de la création');
    } catch { setError('Erreur lors de la création'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <button onClick={() => router.push('/admin/projets')} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", marginBottom: 12 }}>← Retour aux projets</button>
        <h1 className="display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Nouveau projet</h1>
      </div>

      {/* Sélecteur de mode */}
      <div className="surface-card" style={{ padding: "clamp(16px,2.5vw,28px)", marginBottom: 24, display: "flex", gap: 12 }}>
        <button onClick={() => setMode('rapide')} className={"btn " + (mode === 'rapide' ? "btn-gold" : "btn-outline")} style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center", padding: "16px 12px", gap: 6 }}>
          <span style={{ fontSize: "1.4rem" }}>⚡</span>
          <span style={{ fontWeight: 700 }}>Mode rapide</span>
          <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>Titre, photos, catégorie</span>
        </button>
        <button onClick={() => setMode('complet')} className={"btn " + (mode === 'complet' ? "btn-gold" : "btn-outline")} style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center", padding: "16px 12px", gap: 6 }}>
          <span style={{ fontSize: "1.4rem" }}>✏️</span>
          <span style={{ fontWeight: 700 }}>Mode complet</span>
          <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>Tous les champs</span>
        </button>
      </div>

      <form onSubmit={submit}>
        <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Titre */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Titre du projet *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Ex : Portraits Corporate Paris" required />
          </div>

          {/* Catégorie */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 10 }}>Catégorie *</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <button type="button" key={cat} onClick={() => setForm({ ...form, category: cat })} className={"btn " + (form.category === cat ? "btn-gold" : "btn-outline")} style={{ fontSize: "0.85rem" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Champs mode complet */}
          {mode === 'complet' && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Sous-titre</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input" placeholder="Ex : Direction artistique & retouche éditoriale" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={4} placeholder="Présentation du projet, approche photographique…" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 10 }}>Points clés (détails)</label>
                {form.details.map((d, i) => (
                  <input key={i} type="text" value={d} onChange={(e) => { const next = [...form.details]; next[i] = e.target.value; setForm({ ...form, details: next }); }} className="input" placeholder={`Point ${i + 1}`} style={{ marginBottom: 8 }} />
                ))}
                <button type="button" onClick={() => setForm({ ...form, details: [...form.details, ''] })} className="btn btn-outline" style={{ fontSize: "0.82rem", marginTop: 4 }}>+ Ajouter un point</button>
              </div>
            </>
          )}
        </div>

        {/* Upload photos */}
        <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 600, marginBottom: 6, fontSize: "1.1rem" }}>Photos *</h2>
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 16 }}>La première photo sera la couverture du projet.</p>

          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple disabled={uploading} onChange={handleUpload} style={{ display: "block", width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--line)", color: "var(--fg-soft)", cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1, marginBottom: 12 }} />
          {uploading && <p style={{ fontSize: "0.88rem", color: "var(--accent)", marginBottom: 12 }}>⏳ Upload en cours…</p>}
          <p className="muted" style={{ fontSize: "0.82rem", marginBottom: 16 }}>JPG, PNG ou WebP · compression automatique</p>

          {form.photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
              {form.photos.map((photo, index) => (
                <div key={`${photo}-${index}`} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: index === 0 ? "2px solid var(--accent)" : "2px solid var(--line)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                  {index === 0 && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--accent)", color: "#1a1208", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, padding: "3px 0" }}>COUVERTURE</div>
                  )}
                  <button type="button" onClick={() => removePhoto(index)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "#e87070", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: "#e87070", fontSize: "0.88rem", marginBottom: 16 }}>{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={loading || uploading} className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }}>
            {loading ? 'Création…' : 'Créer le projet'}
          </button>
          <button type="button" onClick={() => router.push('/admin/projets')} className="btn btn-outline">Annuler</button>
        </div>
      </form>
    </div>
  );
}
