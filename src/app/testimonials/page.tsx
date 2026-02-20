'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestimonialsPage() {
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'form'>('verify');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    project: '',
    rating: 5,
    date: '',
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/testimonials/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          code: code.trim().toUpperCase() 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        setVerifiedEmail(email.trim().toLowerCase());
        setStep('form');
        setError('');
      } else {
        setError(data.message || 'Code de vérification invalide');
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) {
      setError('Le nom et le témoignage sont requis');
      return;
    }
    if (!verifiedEmail) {
      setError('Email de vérification manquant. Merci de recommencer.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/testimonials/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testimonial: {
            ...formData,
            email: verifiedEmail,
            date: formData.date || new Date().toISOString().split('T')[0],
          },
          verificationCode: code.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Merci pour votre avis ! Il sera publié après modération.');
        router.push('/');
      } else {
        setError(data.error || 'Erreur lors de l\'envoi de votre avis');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de votre avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1916]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(180,140,96,0.12),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(56,189,248,0.08),transparent_30%)]" />
      
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 pb-24 pt-20 sm:px-10 md:px-14">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="space-y-3 mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Laisser un avis
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Partagez votre expérience
            </h1>
            <p className="text-base sm:text-lg text-stone-600">
              {step === 'verify' 
                ? 'Pour laisser un avis, veuillez d\'abord vérifier votre identité avec le code qui vous a été fourni après votre shooting.'
                : 'Merci de partager votre expérience avec LueurStudio. Votre avis sera publié après modération.'}
            </p>
          </div>

          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Email utilisé pour le shooting *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Code de vérification *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="CODE123"
                  required
                />
                <p className="text-xs text-stone-500 mt-2">
                  Le code vous a été fourni après votre shooting. Si vous ne l'avez pas, contactez-nous.
                </p>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1c1916] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Votre nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="Ex. Marie Dupont"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Votre rôle / Fonction (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="Ex. Directrice marketing"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Votre témoignage *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="Partagez votre expérience..."
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-stone-600">
                    Note (1-5 étoiles)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r} className="bg-white text-stone-900">
                        {r} étoile{r > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-stone-600">
                    Date du shooting (optionnel)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-stone-600">
                  Projet (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-1 ring-transparent transition focus:ring-amber-300/60"
                  placeholder="Ex. Portrait signature"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('verify')}
                  className="flex-1 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-[#f5f1ea] transition hover:border-white/40 hover:bg-white/10"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-[#1c1916] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer mon avis'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

