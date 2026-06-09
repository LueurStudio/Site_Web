'use client';

import { useState } from 'react';
import { photoSpots, zones, tagsList } from '@/app/admin/spots-data';

export default function SpotsPage() {
  const [zone, setZone] = useState('Tous');
  const [tag, setTag] = useState('tous');
  const [search, setSearch] = useState('');
  const [expandedSpot, setExpandedSpot] = useState<string | null>(null);

  const filtered = photoSpots.filter((s) => {
    const matchZone = zone === 'Tous' || s.zone === zone;
    const matchTag = tag === 'tous' || s.tags.includes(tag);
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchZone && matchTag && matchSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span className="kicker">Administration</span>
        <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Spots photo</h1>
        <p className="muted" style={{ marginTop: 6, fontSize: "0.88rem" }}>{photoSpots.length} lieux référencés en Île-de-France</p>
      </div>

      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
        <input type="text" placeholder="Rechercher un lieu, une ville…" value={search} onChange={(e) => setSearch(e.target.value)} className="input" style={{ marginBottom: 20 }} />

        <div style={{ marginBottom: 16 }}>
          <p className="kicker" style={{ marginBottom: 8 }}>Département</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {zones.map((z) => (
              <button key={z} onClick={() => setZone(z)} className={"btn " + (zone === z ? "btn-gold" : "btn-outline")} style={{ padding: "5px 14px", fontSize: "0.85rem" }}>{z}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p className="kicker" style={{ marginBottom: 8 }}>Type de photo</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tagsList.map((t) => (
              <button key={t.id} onClick={() => setTag(t.id)} className={"btn " + (tag === t.id ? "btn-gold" : "btn-outline")} style={{ padding: "5px 14px", fontSize: "0.85rem" }}>{t.label}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "48px 0" }}>Aucun spot correspondant.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filtered.map((spot) => (
              <div key={spot.id} className="surface-card" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--surface)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={spot.image} alt={spot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80'; }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", padding: 12 }}>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>{spot.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>{spot.city}</p>
                  </div>
                  <span style={{ position: "absolute", top: 8, right: 8, borderRadius: 99, background: "var(--surface)", padding: "2px 8px", fontSize: "0.75rem", fontWeight: 600 }}>{spot.zone.split(' ')[0]}</span>
                </div>

                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {spot.tags.map((t) => (
                      <span key={t} style={{ borderRadius: 99, background: "var(--surface)", border: "1px solid var(--line)", padding: "2px 8px", fontSize: "0.75rem", textTransform: "capitalize" }}>{t}</span>
                    ))}
                  </div>
                  <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const }}>{spot.description}</p>
                  <button onClick={() => setExpandedSpot(expandedSpot === spot.id ? null : spot.id)} className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    {expandedSpot === spot.id ? '▲ Moins de détails' : '▼ Voir le conseil & accès'}
                  </button>
                  {expandedSpot === spot.id && (
                    <div style={{ paddingTop: 8, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10, padding: 12 }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#d97706", marginBottom: 4 }}>💡 Conseil pro</p>
                        <p className="muted" style={{ fontSize: "0.78rem" }}>{spot.tip}</p>
                      </div>
                      <div className="surface-card" style={{ padding: 12 }}>
                        <p className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 4 }}>📍 Adresse</p>
                        <p className="muted" style={{ fontSize: "0.78rem" }}>{spot.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="muted" style={{ marginTop: 24, fontSize: "0.85rem", textAlign: "center" }}>{filtered.length} spot{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
