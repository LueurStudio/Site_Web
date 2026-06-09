'use client';

import { useState, useEffect } from 'react';
import type { PricingOffer } from '@/app/pricing/pricing-data';

export default function TarifsPage() {
  const [offers, setOffers] = useState<PricingOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/pricing/list')
      .then((r) => r.json())
      .then((d) => { if (d.offers) setOffers(d.offers); })
      .catch(console.error);
  }, []);

  const add = () => {
    setOffers((prev) => [...prev, { id: `offer-${Date.now()}`, name: '', price: '', unit: 'à partir de', desc: '', features: [] }]);
  };

  const update = (id: string, field: keyof Omit<PricingOffer, 'id'>, value: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const remove = (id: string) => setOffers((prev) => prev.filter((o) => o.id !== id));

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pricing/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offers }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOffers(data.offers || []);
        alert('Tarifs mis à jour avec succès');
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
          <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Tarifs</h1>
        </div>
        <button onClick={add} className="btn btn-gold" style={{ fontSize: "0.88rem" }}>+ Ajouter une offre</button>
      </div>

      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
        {offers.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune offre configurée.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {offers.map((offer) => (
              <div key={offer.id} className="surface-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>Offre</p>
                  <button onClick={() => remove(offer.id)} style={{ color: "#e87070", fontSize: "0.88rem", background: "none", border: "none", cursor: "pointer" }}>Supprimer</button>
                </div>
                <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Nom</label>
                    <input type="text" value={offer.name} onChange={(e) => update(offer.id, 'name', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Prix</label>
                    <input type="text" value={offer.price} onChange={(e) => update(offer.id, 'price', e.target.value)} placeholder="Ex: 150€ ou Sur devis" className="input" />
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Description</label>
                  <textarea value={offer.desc} onChange={(e) => update(offer.id, 'desc', e.target.value)} rows={3} className="input" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: "#e87070", fontSize: "0.88rem", marginTop: 16 }}>{error}</p>}

        <div style={{ marginTop: 24 }}>
          <button onClick={save} disabled={loading} className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? 'Enregistrement…' : 'Enregistrer les tarifs'}
          </button>
        </div>
      </div>
    </div>
  );
}
