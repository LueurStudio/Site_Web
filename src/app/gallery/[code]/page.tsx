'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function GalleryPage() {
  const params = useParams();
  const code = params.code as string;
  const [accessCode, setAccessCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    if (code) {
      // Le code est dans l'URL, on peut vérifier l'accès
      checkAccess(code);
    }
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto === null || !gallery) return;

      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowLeft' && selectedPhoto > 0) {
        setSelectedPhoto(selectedPhoto - 1);
      } else if (e.key === 'ArrowRight' && selectedPhoto < gallery.photos.length - 1) {
        setSelectedPhoto(selectedPhoto + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, gallery]);

  useEffect(() => {
    if (selectedPhoto !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  const checkAccess = async (codeToCheck: string) => {
    try {
      const res = await fetch(`/api/gallery/verify?code=${codeToCheck}`);
      const data = await res.json();
      if (data.success && data.gallery) {
        setGallery(data.gallery);
        setAuthenticated(true);
        setError('');
      } else {
        if (data.expired) {
          setError('Cette galerie a expiré. Veuillez nous contacter pour obtenir un nouveau lien d\'accès.');
        } else {
          setError(data.error || 'Code d\'accès invalide');
        }
        setAuthenticated(false);
      }
    } catch (err) {
      setError('Erreur lors de la vérification du code');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gallery || !testimonialForm.name || !testimonialForm.quote) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/testimonials/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testimonial: {
            ...testimonialForm,
            email: gallery.reservation.email,
            project: gallery.reservation.prestationType,
          },
          verificationCode: gallery.reservation.galleryCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Merci pour votre avis ! Il sera publié après modération.');
        setTestimonialForm({ name: '', role: '', quote: '', rating: 5, date: '' });
      } else {
        setError(data.error || 'Erreur lors de la soumission de l\'avis');
      }
    } catch (err) {
      setError('Erreur lors de la soumission de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Accès à votre galerie</h1>
          <p className="text-slate-300 mb-6 text-center">
            Veuillez entrer le code d'accès qui vous a été envoyé par email.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkAccess(accessCode);
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Code d'accès"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-center text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60 uppercase tracking-widest"
              maxLength={8}
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Accéder à la galerie
            </button>
          </form>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  // Calculer les jours restants avant expiration
  const getDaysRemaining = () => {
    if (!gallery?.expiresAt) return null;
    const expiresAt = new Date(gallery.expiresAt);
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const expiresAtDate = gallery?.expiresAt ? new Date(gallery.expiresAt) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-semibold mt-4">Votre galerie photo</h1>
          <p className="text-slate-300 mt-2">
            {gallery.reservation.firstName} {gallery.reservation.lastName} - {gallery.reservation.prestationType}
          </p>
          
          {/* Message d'expiration */}
          {expiresAtDate && (
            <div className={`mt-4 rounded-xl border p-4 ${
              daysRemaining !== null && daysRemaining <= 7
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-blue-500/50 bg-blue-500/10'
            }`}>
              <p className="text-sm text-slate-200">
                <strong>⏰ Durée de disponibilité :</strong> Votre galerie est accessible pendant 2 mois.
              </p>
              {daysRemaining !== null && (
                <p className={`text-sm mt-1 ${
                  daysRemaining <= 7 ? 'text-yellow-300' : 'text-blue-300'
                }`}>
                  {daysRemaining > 0 ? (
                    <>
                      <strong>{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</strong>
                      {' '}avant expiration ({expiresAtDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })})
                    </>
                  ) : (
                    <strong>Cette galerie a expiré le {expiresAtDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Galerie de photos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {gallery.photos.map((photo: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(index)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="aspect-square relative">
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto !== null && gallery && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPhoto(null);
              }
            }}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
              aria-label="Fermer"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation précédente */}
            {selectedPhoto > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(selectedPhoto - 1);
                }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
                aria-label="Photo précédente"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Navigation suivante */}
            {selectedPhoto < gallery.photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(selectedPhoto + 1);
                }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
                aria-label="Photo suivante"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image plein écran */}
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
              <Image
                src={gallery.photos[selectedPhoto]}
                alt={`Photo ${selectedPhoto + 1} sur ${gallery.photos.length}`}
                fill
                className="object-contain p-4"
                sizes="100vw"
                priority
              />
            </div>

            {/* Compteur de photos */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              {selectedPhoto + 1} / {gallery.photos.length}
            </div>
          </div>
        )}

        {/* Formulaire d'avis */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">Laisser un avis</h2>
          <p className="text-slate-300 mb-6">
            Partagez votre expérience avec LueurStudio. Votre avis sera publié après modération.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Nom complet *</span>
                <input
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Fonction (optionnel)</span>
                <input
                  type="text"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm text-slate-300">Note (sur 5) *</span>
              <select
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
                required
              >
                <option value={5}>5 étoiles</option>
                <option value={4}>4 étoiles</option>
                <option value={3}>3 étoiles</option>
                <option value={2}>2 étoiles</option>
                <option value={1}>1 étoile</option>
              </select>
            </label>

            <label className="space-y-2 block">
              <span className="text-sm text-slate-300">Votre témoignage *</span>
              <textarea
                rows={4}
                value={testimonialForm.quote}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
                required
              />
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

