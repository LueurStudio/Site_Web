'use client';

import { useState, useEffect } from 'react';

export default function DisponibilitesPage() {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [unlockedDates, setUnlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/availability/list');
    const data = await res.json();
    if (data.success) {
      setBlockedDates(data.blockedDates || []);
      setUnlockedDates(data.unlockedDates || []);
    }
  };

  useEffect(() => { load(); }, []);

  const action = async (act: string) => {
    if (!selectedDate) { alert('Veuillez sélectionner une date'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/availability/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: act, date: selectedDate }),
      });
      const data = await res.json();
      if (data.success) { await load(); setSelectedDate(''); alert(`Date ${act === 'unlock' ? 'déverrouillée' : act === 'block' ? 'bloquée' : 'débloquée'} avec succès`); }
      else alert('Erreur: ' + (data.error || 'Erreur inconnue'));
    } catch { alert('Erreur lors de la mise à jour'); }
    finally { setLoading(false); }
  };

  const removeDate = async (act: string, date: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/availability/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: act, date }),
      });
      const data = await res.json();
      if (data.success) await load();
      else alert('Erreur');
    } catch { alert('Erreur'); }
    finally { setLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="kicker">Administration</span>
        <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Disponibilités</h1>
      </div>

      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.25)", fontSize: "0.88rem", color: "var(--fg-soft)" }}>
          <p><strong>Règles par défaut :</strong> Réservations disponibles uniquement les week-ends.</p>
          <p style={{ marginTop: 8 }}><strong>Déverrouiller :</strong> Rend une date de semaine disponible.</p>
          <p style={{ marginTop: 8 }}><strong>Bloquer :</strong> Rend une date indisponible (week-end ou semaine).</p>
        </div>

        <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: 18 }}>Gérer une date</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input" />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => action('unlock')} disabled={loading || !selectedDate} className="btn btn-outline" style={{ borderColor: "#4ade80", color: "#4ade80" }}>Déverrouiller</button>
            <button onClick={() => action('block')} disabled={loading || !selectedDate} className="btn btn-outline" style={{ borderColor: "#e87070", color: "#e87070" }}>Bloquer</button>
            <button onClick={() => action('unblock')} disabled={loading || !selectedDate} className="btn btn-outline" style={{ borderColor: "#d8b46a", color: "var(--accent)" }}>Débloquer</button>
          </div>
        </div>
      </div>

      {unlockedDates.length > 0 && (
        <div className="surface-card" style={{ padding: "clamp(20px,3vw,30px)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 600 }}>📅 Dates déverrouillées</h3>
            <span style={{ padding: "2px 10px", borderRadius: 99, background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: "0.85rem", fontWeight: 600 }}>{unlockedDates.length}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {unlockedDates.map((date) => (
              <div key={date} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
                <span>{fmtDate(date)}</span>
                <button onClick={() => removeDate('lock', date)} disabled={loading} style={{ color: "#e87070", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {blockedDates.length > 0 && (
        <div className="surface-card" style={{ padding: "clamp(20px,3vw,30px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 600 }}>🚫 Dates bloquées</h3>
            <span style={{ padding: "2px 10px", borderRadius: 99, background: "rgba(232,112,112,0.15)", color: "#e87070", fontSize: "0.85rem", fontWeight: 600 }}>{blockedDates.length}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {blockedDates.map((date) => (
              <div key={date} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: "rgba(232,112,112,0.1)", border: "1px solid rgba(232,112,112,0.3)" }}>
                <span>{fmtDate(date)}</span>
                <button onClick={() => removeDate('unblock', date)} disabled={loading} style={{ color: "#4ade80", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlockedDates.length === 0 && blockedDates.length === 0 && (
        <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune date spéciale configurée. Par défaut, seuls les week-ends sont disponibles.</p>
      )}
    </div>
  );
}
