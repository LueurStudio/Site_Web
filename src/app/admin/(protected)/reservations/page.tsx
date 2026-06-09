'use client';

import { useState, useEffect } from 'react';
import { compressImageForUpload } from '@/app/admin/_lib/imageUtils';

type Reservation = {
  id: string; firstName: string; lastName: string; email: string; prestationType: string;
  date: string; startTime?: string; duration?: number; location?: string; eventType?: string;
  eventDetails?: string; contactPreference?: string; specialRetouches?: string;
  inspirationPhotos?: string[]; status: string; createdAt: string; galleryCode?: string;
  galleryCreated?: boolean; galleryExpiresAt?: string; emailSent?: boolean; galleryPhotos?: string[];
};

const STATUS_LABELS: Record<string, string> = { pending: 'En attente', confirmed: 'Confirmée', completed: 'Terminée', cancelled: 'Annulée' };
const STATUS_COLORS: Record<string, string> = { pending: '#eab308', confirmed: '#60a5fa', completed: '#4ade80', cancelled: '#e87070' };

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const [baseGalleryUrl, setBaseGalleryUrl] = useState('https://www.lueurstudio-photographie.fr/gallery');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => { if (typeof window !== 'undefined') setBaseGalleryUrl(`${window.location.origin}/gallery`); }, []);

  useEffect(() => {
    if (selected) setGalleryUrl(selected.galleryCode ? `${baseGalleryUrl}/${selected.galleryCode}` : `${baseGalleryUrl}/`);
  }, [selected?.id, selected?.galleryCode]);

  const load = async () => {
    const res = await fetch('/api/reservations/list');
    const data = await res.json();
    if (data.success && data.reservations) {
      setReservations(data.reservations.filter((r: any) => r?.id).map((r: any) => ({
        id: r.id, lastName: r.last_name, firstName: r.first_name, email: r.email,
        prestationType: r.prestation_type, date: r.date, startTime: r.start_time,
        duration: r.duration, location: r.location, eventType: r.event_type,
        eventDetails: r.event_details, contactPreference: r.contact_preference,
        specialRetouches: r.special_retouches, inspirationPhotos: r.inspiration_photos,
        status: r.status, createdAt: r.created_at, galleryCode: r.gallery_code,
        galleryCreated: r.gallery_created, galleryExpiresAt: r.gallery_expires_at,
        emailSent: r.email_sent, galleryPhotos: r.gallery_photos ?? [],
      })));
    }
  };

  useEffect(() => { load(); }, []);

  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '3h';
    const h = Math.floor(hours), m = Math.round((hours - h) * 60);
    return m === 0 ? `${h}h` : h === 0 ? `${m}min` : `${h}h${String(m).padStart(2, '0')}`;
  };

  const changeStatus = async (status: string) => {
    if (!selected) return;
    try {
      const wasConfirmed = selected.status === 'confirmed';
      const res = await fetch('/api/reservations/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, updates: { status } }) });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reservation) {
          setSelected(data.reservation);
          await load();
          if (!wasConfirmed && status === 'confirmed') alert(`✅ Réservation confirmée !\n\nUn email a été envoyé à ${selected.email}`);
        }
      }
    } catch { alert('Erreur lors de la mise à jour'); }
  };

  const sendGalleryEmail = async () => {
    if (!selected) return;
    setSendingEmail(true);
    try {
      const res = await fetch('/api/reservations/send-gallery-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservationId: selected.id, galleryUrl: galleryUrl || undefined }) });
      const data = await res.json();
      if (data.success) { alert(`✅ Email envoyé !\n\nCode d'accès : ${data.galleryCode}`); await load(); }
      else alert(`❌ Erreur : ${data.error}`);
    } catch (err: any) { alert(`❌ Erreur : ${err.message}`); }
    finally { setSendingEmail(false); }
  };

  const uploadGalleryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected || !e.target.files?.length) return;
    setUploadingPhotos(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const f = await compressImageForUpload(file);
        const fd = new FormData(); fd.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
        if (res.ok) { const d = await res.json(); if (d.url) urls.push(d.url); }
        else throw new Error('Upload échoué');
      }
      if (urls.length) {
        const newPhotos = [...(selected.galleryPhotos || []), ...urls];
        const upd = await fetch('/api/reservations/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, updates: { gallery_photos: newPhotos } }) });
        if (upd.ok) { const d = await upd.json(); if (d.success) { setSelected({ ...selected, galleryPhotos: newPhotos }); alert(`✅ ${urls.length} photo(s) ajoutée(s)`); } }
      }
    } catch (err: any) { alert(`❌ ${err.message || 'Erreur lors de l\'upload'}`); }
    finally { setUploadingPhotos(false); e.target.value = ''; }
  };

  const deleteGalleryPhoto = async (index: number) => {
    if (!selected || !confirm('Supprimer cette photo ?')) return;
    const newPhotos = (selected.galleryPhotos || []).filter((_, i) => i !== index);
    const res = await fetch('/api/reservations/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, updates: { gallery_photos: newPhotos } }) });
    if (res.ok) { const d = await res.json(); if (d.success) setSelected({ ...selected, galleryPhotos: newPhotos }); }
  };

  if (selected) {
    const days = getDaysRemaining(selected.galleryExpiresAt);
    return (
      <div style={{ maxWidth: 860 }}>
        <button onClick={() => { setSelected(null); setGalleryUrl(''); }} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", marginBottom: 24, fontSize: "0.9rem" }}>← Retour à la liste</button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div>
            <h1 className="display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{selected.firstName} {selected.lastName}</h1>
            <span style={{ marginTop: 6, display: "inline-block", padding: "3px 12px", borderRadius: 99, background: `${STATUS_COLORS[selected.status]}22`, color: STATUS_COLORS[selected.status], fontSize: "0.85rem", fontWeight: 600 }}>{STATUS_LABELS[selected.status]}</span>
          </div>
        </div>

        <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)", marginBottom: 24 }}>
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: 24 }}>
            {[
              ['Email', selected.email], ['Date', `${selected.date}${selected.startTime ? ` à ${selected.startTime}` : ''}${selected.duration ? ` (${formatDuration(selected.duration)})` : ''}`],
              ['Prestation', selected.prestationType], ['Lieu', selected.location || 'Non renseigné'],
              ...(selected.galleryCode ? [['Code galerie', selected.galleryCode] as [string, string]] : []),
              ...(days !== null ? [['Expiration galerie', days > 0 ? `${days} jour(s) restant(s)` : 'Expirée'] as [string, string]] : []),
            ].map(([label, value]) => (
              <div key={label}>
                <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 4 }}>{label}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>

          {selected.specialRetouches && <div style={{ marginBottom: 20 }}><p className="muted" style={{ fontSize: "0.85rem", marginBottom: 8 }}>Retouches spéciales</p><p>{selected.specialRetouches}</p></div>}

          {/* Galerie */}
          <div style={{ padding: 20, borderRadius: 12, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>📸 Photos de la galerie client</h3>
            <label>
              <span className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: 8 }}>Ajouter des photos</span>
              <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={uploadGalleryPhoto} disabled={uploadingPhotos} className="input" />
              {uploadingPhotos && <p style={{ marginTop: 8, fontSize: "0.85rem", color: "#4ade80" }}>Upload en cours…</p>}
            </label>
            {selected.galleryPhotos && selected.galleryPhotos.length > 0 && (
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                {selected.galleryPhotos.map((photo, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }} />
                    <button onClick={() => deleteGalleryPhoto(idx)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "#e87070", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email galerie */}
          {selected.status === 'completed' && (
            <div style={{ padding: 20, borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 16 }}>📧 Envoyer la galerie</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label style={{ display: "block", fontSize: "0.85rem", marginBottom: 8 }}>URL de la galerie</label>
                  <input type="text" value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} className="input" placeholder={`${baseGalleryUrl}/CODE`} /></div>
                <button onClick={sendGalleryEmail} disabled={sendingEmail || !galleryUrl} className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
                  {sendingEmail ? 'Envoi…' : 'Envoyer l\'email avec la galerie'}
                </button>
              </div>
            </div>
          )}

          {/* Statut */}
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
            <p className="muted" style={{ fontSize: "0.85rem", marginBottom: 12 }}>Changer le statut</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
                <button key={s} onClick={() => changeStatus(s)} className={"btn " + (selected.status === s ? "btn-gold" : "btn-outline")} style={{ fontSize: "0.8rem", padding: "5px 14px" }}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="kicker">Administration</span>
        <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Réservations</h1>
      </div>

      <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
        {reservations.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "48px 0" }}>Aucune réservation pour le moment</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reservations.filter((r) => r?.id && r?.firstName).map((r) => {
              const days = getDaysRemaining(r.galleryExpiresAt);
              return (
                <div key={r.id} className="surface-card" style={{ padding: "16px 20px", cursor: "pointer", transition: "border-color 0.2s" }} onClick={() => setSelected(r)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <strong>{r.firstName} {r.lastName}</strong>
                        <span style={{ padding: "2px 10px", borderRadius: 99, background: `${STATUS_COLORS[r.status]}22`, color: STATUS_COLORS[r.status], fontSize: "0.78rem", fontWeight: 600 }}>{STATUS_LABELS[r.status]}</span>
                        {r.emailSent && <span style={{ padding: "2px 8px", borderRadius: 99, background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: "0.75rem" }}>📧 Email envoyé</span>}
                      </div>
                      <p className="muted" style={{ fontSize: "0.85rem" }}>{r.email}</p>
                      <div className="muted" style={{ display: "flex", gap: 16, marginTop: 6, fontSize: "0.85rem", flexWrap: "wrap" }}>
                        <span>📅 {r.date}{r.startTime ? ` à ${r.startTime}` : ''}</span>
                        <span>🎯 {r.prestationType}</span>
                        {r.location && <span>📍 {r.location}</span>}
                      </div>
                      {days !== null && <div style={{ marginTop: 6, display: "inline-block", padding: "2px 8px", borderRadius: 99, background: days <= 0 ? "rgba(232,112,112,0.15)" : days <= 7 ? "rgba(234,179,8,0.15)" : "rgba(99,179,237,0.15)", color: days <= 0 ? "#e87070" : days <= 7 ? "#eab308" : "#93c5fd", fontSize: "0.75rem" }}>
                        {days > 0 ? `⏰ ${days} jour(s) restant(s)` : '⏰ Galerie expirée'}
                      </div>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSelected(r); }} className="btn btn-outline" style={{ fontSize: "0.85rem" }}>Voir détails</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
