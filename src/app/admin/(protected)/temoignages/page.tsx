'use client';

import { useState, useEffect } from 'react';

type Testimonial = { id: string; name: string; email?: string; role?: string; quote: string; project?: string; rating?: number; date?: string; image?: string; approved: boolean };
type CodeEntry = [string, string];

export default function TemoignagesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', role: '', quote: '', project: '', rating: 5, date: '', image: '' });
  const [codeForm, setCodeForm] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTestimonials = async () => {
    const res = await fetch('/api/testimonials/list');
    const data = await res.json();
    if (data.testimonials) {
      setTestimonials(data.testimonials.filter((t: any) => t).map((t: any) => ({
        id: t.id, name: t.name, email: t.email, role: t.role, quote: t.quote,
        project: t.project, rating: t.rating, date: t.date, image: t.image,
        approved: t.approved ?? false,
      })));
    }
  };

  const loadCodes = async () => {
    const res = await fetch('/api/testimonials/codes');
    const data = await res.json();
    if (data.codes) setCodes(data.codes);
  };

  useEffect(() => { loadTestimonials(); loadCodes(); }, []);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.quote) { setError('Nom, email et témoignage requis'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/testimonials/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testimonial: form }) });
      const data = await res.json();
      if (data.success) { await loadTestimonials(); setForm({ name: '', email: '', role: '', quote: '', project: '', rating: 5, date: '', image: '' }); alert('Avis ajouté !'); }
      else setError(data.error || 'Erreur');
    } catch { setError('Erreur'); } finally { setLoading(false); }
  };

  const approve = async (id: string, approved: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved }) });
      const data = await res.json();
      if (data.success) { await loadTestimonials(); alert(approved ? 'Avis approuvé !' : 'Avis retiré'); }
      else alert(data.error || 'Erreur');
    } catch { alert('Erreur'); } finally { setLoading(false); }
  };

  const deleteTestimonial = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'avis de ${name} ?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (data.success) { await loadTestimonials(); alert('Avis supprimé !'); }
      else alert(data.error || 'Erreur');
    } catch { alert('Erreur'); } finally { setLoading(false); }
  };

  const addCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeForm.email || !codeForm.code) { setError('Email et code requis'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/testimonials/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: codeForm.email, code: codeForm.code, action: 'add' }) });
      const data = await res.json();
      if (data.success) { await loadCodes(); setCodeForm({ email: '', code: '' }); alert('Code ajouté !'); }
      else setError(data.error || 'Erreur');
    } catch { setError('Erreur'); } finally { setLoading(false); }
  };

  const removeCode = async (email: string) => {
    if (!confirm(`Supprimer le code pour ${email} ?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action: 'remove' }) });
      const data = await res.json();
      if (data.success) await loadCodes();
    } catch { } finally { setLoading(false); }
  };

  const Stars = ({ n }: { n?: number }) => (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map((i) => <span key={i} style={{ fontSize: "0.9rem", color: i <= (n || 0) ? "#facc15" : "var(--line)" }}>★</span>)}
    </div>
  );

  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="kicker">Administration</span>
        <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Avis clients</h1>
      </div>

      {/* Ajout avis */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
        <h2 className="display" style={{ fontSize: "1.4rem", marginBottom: 20 }}>Ajouter un avis</h2>
        <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Nom *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Marie Dupont" required /></div>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="client@email.com" required /></div>
          </div>
          <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Rôle (optionnel)</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="Directrice marketing" /></div>
          <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Témoignage *</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input" rows={4} placeholder="Le témoignage…" required /></div>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Note (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="input" /></div>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></div>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Projet lié</label>
              <input type="text" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="input" placeholder="Portrait signature" /></div>
          </div>
          {error && <p style={{ color: "#e87070", fontSize: "0.88rem" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? 'Ajout…' : 'Ajouter l\'avis'}
          </button>
        </form>
      </div>

      {/* En attente */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 20 }}>En attente de modération <span style={{ marginLeft: 8, fontSize: "0.85rem", color: "var(--accent)" }}>{pending.length}</span></h2>
        {pending.length === 0 ? <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}>Aucun avis en attente</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((t) => (
              <div key={t.id} className="surface-card" style={{ padding: 16, borderColor: "rgba(216,180,106,0.4)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <strong>{t.name}</strong>
                      {t.email && <span className="muted" style={{ fontSize: "0.78rem" }}>({t.email})</span>}
                      <Stars n={t.rating} />
                    </div>
                    {t.role && <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 4 }}>{t.role}</p>}
                    <p style={{ fontStyle: "italic" }}>"{t.quote}"</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={() => approve(t.id, true)} disabled={loading} style={{ padding: "5px 14px", borderRadius: 99, border: "1px solid #4ade80", color: "#4ade80", background: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Approuver</button>
                    <button onClick={() => deleteTestimonial(t.id, t.name)} disabled={loading} style={{ padding: "5px 14px", borderRadius: 99, border: "1px solid #e87070", color: "#e87070", background: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approuvés */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 20 }}>Avis approuvés <span style={{ marginLeft: 8, fontSize: "0.85rem", color: "#4ade80" }}>{approved.length}</span></h2>
        {approved.length === 0 ? <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}>Aucun avis approuvé</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {approved.map((t) => (
              <div key={t.id} className="surface-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <strong>{t.name}</strong>
                      <Stars n={t.rating} />
                    </div>
                    {t.role && <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 4 }}>{t.role}</p>}
                    <p style={{ fontStyle: "italic" }}>"{t.quote}"</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={() => approve(t.id, false)} disabled={loading} style={{ padding: "5px 14px", borderRadius: 99, border: "1px solid #fb923c", color: "#fb923c", background: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Retirer</button>
                    <button onClick={() => deleteTestimonial(t.id, t.name)} disabled={loading} style={{ padding: "5px 14px", borderRadius: 99, border: "1px solid #e87070", color: "#e87070", background: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Codes de vérification */}
      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
        <h2 style={{ fontWeight: 600, marginBottom: 20 }}>Codes de vérification</h2>
        <form onSubmit={addCode} style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Email client</label>
              <input type="email" value={codeForm.email} onChange={(e) => setCodeForm({ ...codeForm, email: e.target.value })} className="input" placeholder="client@example.com" required /></div>
            <div><label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Code</label>
              <input type="text" value={codeForm.code} onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })} className="input" placeholder="CODE123" required /></div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-gold" style={{ fontSize: "0.88rem" }}>{loading ? 'Ajout…' : 'Ajouter le code'}</button>
        </form>
        {Object.keys(codes).length === 0 ? <p className="muted" style={{ textAlign: "center", padding: "16px 0" }}>Aucun code configuré</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(Object.entries(codes) as CodeEntry[]).map(([email, code]) => (
              <div key={email} className="surface-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{email}</p>
                  <p className="muted" style={{ fontSize: "0.78rem" }}>Code : {code}</p>
                </div>
                <button onClick={() => removeCode(email)} disabled={loading} style={{ padding: "4px 12px", borderRadius: 99, border: "1px solid #e87070", color: "#e87070", background: "none", cursor: "pointer", fontSize: "0.8rem" }}>Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
