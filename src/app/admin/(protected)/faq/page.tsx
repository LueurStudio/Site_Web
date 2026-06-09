'use client';

import { useState, useEffect } from 'react';
import type { FaqItem } from '@/app/faq/faq-data';

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/faq/list')
      .then((r) => r.json())
      .then((d) => { if (d.items) setItems(d.items); })
      .catch(console.error);
  }, []);

  const add = () => setItems((prev) => [...prev, { id: `faq-${Date.now()}`, question: '', answer: '' }]);

  const update = (id: string, field: keyof Omit<FaqItem, 'id'>, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/faq/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items || []);
        alert('FAQ mise à jour avec succès');
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch {
      setError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="kicker">Administration</span>
          <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>FAQ</h1>
        </div>
        <button onClick={add} className="btn btn-outline" style={{ fontSize: "0.88rem" }}>+ Ajouter une question</button>
      </div>

      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
        {items.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune question configurée.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item) => (
              <div key={item.id} className="surface-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>Question</p>
                  <button onClick={() => remove(item.id)} style={{ color: "#e87070", fontSize: "0.88rem", background: "none", border: "none", cursor: "pointer" }}>Supprimer</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Question</label>
                    <input type="text" value={item.question} onChange={(e) => update(item.id, 'question', e.target.value)} className="input" placeholder="Ex: Quels sont les délais ?" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Réponse</label>
                    <textarea value={item.answer} onChange={(e) => update(item.id, 'answer', e.target.value)} rows={3} className="input" placeholder="Ex: Livraison rapide selon la prestation…" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: "#e87070", fontSize: "0.88rem", marginTop: 16 }}>{error}</p>}

        <div style={{ marginTop: 24 }}>
          <button onClick={save} disabled={loading} className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? 'Enregistrement…' : 'Enregistrer la FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}
