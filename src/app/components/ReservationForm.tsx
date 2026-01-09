'use client';

import { useState, FormEvent, useEffect } from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';

interface ReservationFormData {
  lastName: string;
  firstName: string;
  email: string;
  prestationType: string;
  date: string;
  isDateToDefine: boolean;
  startTime: string; // Heure de début (format HH:MM)
  location: string;
  inspirationPhotos?: FileList;
  specialRetouches?: string;
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<ReservationFormData>({
    lastName: '',
    firstName: '',
    email: '',
    prestationType: '',
    date: '',
    isDateToDefine: false,
    startTime: '10:00',
    location: '',
    specialRetouches: '',
  });
  const [timeError, setTimeError] = useState<string>('');
  const [inspirationPhotos, setInspirationPhotos] = useState<FileList | null>(null);

  // Charger les disponibilités au montage
  useEffect(() => {
    loadAvailability();
  }, []);

  // Charger les heures réservées quand la date change
  useEffect(() => {
    if (formData.date && !formData.isDateToDefine) {
      const loadBookedTimes = async () => {
        try {
          const timesRes = await fetch(`/api/reservations/booked-times?date=${formData.date}`);
          const timesData = await timesRes.json();
          if (timesData.success) {
            setBookedTimes(timesData.bookedTimes || []);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des heures réservées:', err);
          setBookedTimes([]);
        }
      };
      loadBookedTimes();
    } else {
      setBookedTimes([]);
    }
  }, [formData.date, formData.isDateToDefine]);

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/availability/public');
      const data = await res.json();
      if (data.success) {
        setBlockedDates(data.blockedDates || []);
        setUnlockedDates(data.unlockedDates || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des disponibilités:', err);
    }
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dateError, setDateError] = useState<string>('');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [unlockedDates, setUnlockedDates] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<Array<{ startTime: string; endTime: string; duration: number }>>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validation côté client
      if (!formData.lastName || !formData.firstName || !formData.email || !formData.prestationType || !formData.location) {
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires.' });
        setLoading(false);
        return;
      }

      if (!formData.isDateToDefine && !formData.date) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une date ou cliquer sur "À définir sur RDV".' });
        setLoading(false);
        return;
      }

      // Vérifier la disponibilité de la date avant de soumettre
      if (!formData.isDateToDefine && formData.date) {
        try {
          const res = await fetch(`/api/availability/check?date=${formData.date}`);
          const data = await res.json();
          if (!data.available) {
            setMessage({ type: 'error', text: data.reason || 'Cette date n\'est pas disponible. Veuillez en choisir une autre.' });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Erreur lors de la vérification:', err);
        }
      }

      // Vérifier que l'heure est valide si une date est sélectionnée
      if (!formData.isDateToDefine && formData.date && formData.startTime) {
        try {
          const res = await fetch('/api/reservations/check-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: formData.date,
              startTime: formData.startTime,
              duration: 3, // Durée par défaut d'un shooting
            }),
          });
          const data = await res.json();
          if (!data.available) {
            setTimeError(data.reason || 'Ce créneau n\'est pas disponible');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Erreur lors de la vérification du créneau:', err);
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('prestationType', formData.prestationType);
      formDataToSend.append('date', formData.isDateToDefine ? 'À définir sur RDV' : formData.date);
      formDataToSend.append('startTime', formData.isDateToDefine ? '' : (formData.startTime || ''));
      formDataToSend.append('duration', '3'); // Durée par défaut
      formDataToSend.append('location', formData.location);
      formDataToSend.append('specialRetouches', formData.specialRetouches || '');

      if (inspirationPhotos && inspirationPhotos.length > 0) {
        Array.from(inspirationPhotos).forEach((file) => {
          formDataToSend.append('inspirationPhotos', file);
        });
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Votre réservation a été envoyée avec succès ! Nous vous répondrons rapidement.' });
        // Réinitialiser le formulaire
        setFormData({
          lastName: '',
          firstName: '',
          email: '',
          prestationType: '',
          date: '',
          isDateToDefine: false,
          startTime: '10:00',
          location: '',
          specialRetouches: '',
        });
        setTimeError('');
        setInspirationPhotos(null);
        // Réinitialiser l'input file
        const fileInput = document.getElementById('inspirationPhotos') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage({ type: 'error', text: data.error || 'Une erreur est survenue. Veuillez réessayer.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Nom et Prénom */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 text-base text-slate-100">
          Nom <span className="text-red-400">*</span>
          <input
            type="text"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
            placeholder="Ex. Dupont"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </label>
        <label className="space-y-2 text-base text-slate-100">
          Prénom <span className="text-red-400">*</span>
          <input
            type="text"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
            placeholder="Ex. Marie"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </label>
      </div>

      {/* Email */}
      <label className="space-y-2 text-base text-slate-100">
        Email <span className="text-red-400">*</span>
        <input
          type="email"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
          placeholder="exemple@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </label>

      {/* Type de prestation */}
      <label className="space-y-2 text-base text-slate-100">
        Type de prestation <span className="text-red-400">*</span>
        <select
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
          value={formData.prestationType}
          onChange={(e) => setFormData({ ...formData, prestationType: e.target.value })}
          required
        >
          <option value="" className="bg-slate-900 text-white">Sélectionner une prestation</option>
          <option value="Portrait" className="bg-slate-900 text-white">Portrait</option>
          <option value="Événement" className="bg-slate-900 text-white">Événement</option>
          <option value="Branding / Produit" className="bg-slate-900 text-white">Branding / Produit</option>
          <option value="Retouche seule" className="bg-slate-900 text-white">Retouche seule</option>
          <option value="Autre" className="bg-slate-900 text-white">Autre</option>
        </select>
      </label>

      {/* Date avec option "À définir sur RDV" */}
      <div className="space-y-3">
        <label className="space-y-2 text-base text-slate-100">
          Date <span className="text-red-400">*</span>
          <div className="space-y-3">
            {/* Affichage de la date sélectionnée ou bouton pour ouvrir le calendrier */}
            {!formData.isDateToDefine && formData.date ? (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white">
                  {new Date(formData.date + 'T00:00:00').toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setDateError('');
                  }}
                  className="rounded-xl border px-4 py-3 text-base font-semibold transition whitespace-nowrap border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                >
                  📅 Changer la date
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, isDateToDefine: !formData.isDateToDefine, date: '' });
                    setShowCalendar(false);
                  }}
                  className="rounded-xl border px-4 py-3 text-base font-semibold transition whitespace-nowrap border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                >
                  À définir sur RDV
                </button>
              </div>
            ) : formData.isDateToDefine ? (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white font-semibold">
                  À définir sur RDV
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, isDateToDefine: false });
                    setShowCalendar(true);
                  }}
                  className="rounded-xl border px-4 py-3 text-base font-semibold transition whitespace-nowrap border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                >
                  📅 Choisir une date
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowCalendar(true);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-base font-semibold transition whitespace-nowrap ${
                  showCalendar
                    ? 'bg-indigo-500 text-white border-indigo-400'
                    : 'border-white/20 text-white hover:border-white/40 hover:bg-white/10'
                }`}
              >
                📅 Choisir une date
              </button>
            )}
            
            {/* Calendrier des disponibilités */}
            {showCalendar && !formData.isDateToDefine && (
              <div className="mt-4">
                <AvailabilityCalendar
                  selectedDate={formData.date}
                  onDateSelect={async (date) => {
                    setFormData({ ...formData, date, isDateToDefine: false });
                    setDateError('');
                    setShowCalendar(false); // Fermer le calendrier après sélection
                    
                    // Vérifier la disponibilité
                    try {
                      const res = await fetch(`/api/availability/check?date=${date}`);
                      const data = await res.json();
                      if (!data.available) {
                        setDateError(data.reason || 'Cette date n\'est pas disponible');
                      }
                    } catch (err) {
                      console.error('Erreur lors de la vérification:', err);
                    }

                    // Charger les heures réservées pour cette date
                    try {
                      const timesRes = await fetch(`/api/reservations/booked-times?date=${date}`);
                      const timesData = await timesRes.json();
                      if (timesData.success) {
                        setBookedTimes(timesData.bookedTimes || []);
                      }
                    } catch (err) {
                      console.error('Erreur lors du chargement des heures réservées:', err);
                      setBookedTimes([]);
                    }
                  }}
                  blockedDates={blockedDates}
                  unlockedDates={unlockedDates}
                />
              </div>
            )}

            {/* Input date caché pour la validation HTML5 */}
            <input
              type="text"
              value={formData.isDateToDefine ? '' : formData.date}
              onChange={() => {}} // Lecture seule
              className="hidden"
              required={!formData.isDateToDefine}
            />
          </div>

          {dateError && (
            <p className="text-red-400 text-sm mt-2">{dateError}</p>
          )}
          {!formData.isDateToDefine && formData.date && !dateError && (
            <p className="text-green-400 text-sm mt-2">✓ Date disponible</p>
          )}
        </label>
      </div>

      {/* Heure de début */}
      {!formData.isDateToDefine && formData.date && (
        <label className="space-y-2 text-base text-slate-100">
          Heure de début <span className="text-red-400">*</span>
          <select
            value={formData.startTime}
            onChange={async (e) => {
              const selectedTime = e.target.value;
              setFormData({ ...formData, startTime: selectedTime });
              setTimeError('');
              
              // Vérifier la disponibilité du créneau
              if (formData.date) {
                try {
                  const res = await fetch('/api/reservations/check-time', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      date: formData.date,
                      startTime: selectedTime,
                      duration: 3,
                    }),
                  });
                  const data = await res.json();
                  if (!data.available) {
                    setTimeError(data.reason || 'Ce créneau n\'est pas disponible');
                  }
                } catch (err) {
                  console.error('Erreur lors de la vérification:', err);
                }
              }
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
            required
          >
            {(() => {
              const hours = [];
              for (let h = 10; h <= 17; h++) {
                const timeStr = `${h.toString().padStart(2, '0')}:00`;
                const endTime = h + 3 <= 20 ? `${(h + 3).toString().padStart(2, '0')}:00` : '20:00';
                
                // Vérifier si cette heure est réservée
                const isBooked = bookedTimes.some(booking => {
                  const bookingStartHour = parseInt(booking.startTime.split(':')[0]);
                  const bookingStartMin = parseInt(booking.startTime.split(':')[1] || '0');
                  const bookingEndHour = parseInt(booking.endTime.split(':')[0]);
                  const bookingEndMin = parseInt(booking.endTime.split(':')[1] || '0');
                  
                  // Convertir en minutes pour faciliter la comparaison
                  const bookingStartMinutes = bookingStartHour * 60 + bookingStartMin;
                  const bookingEndMinutes = bookingEndHour * 60 + bookingEndMin;
                  
                  const slotStartMinutes = h * 60;
                  const slotEndMinutes = (h + 3) * 60;
                  
                  // Chevauchement si : (slotStart < bookingEnd) && (slotEnd > bookingStart)
                  return slotStartMinutes < bookingEndMinutes && slotEndMinutes > bookingStartMinutes;
                });
                
                hours.push(
                  <option 
                    key={timeStr} 
                    value={timeStr} 
                    className={isBooked ? "bg-slate-700 text-slate-400" : "bg-slate-900 text-white"}
                    disabled={isBooked}
                  >
                    {isBooked ? `❌ ${timeStr} - ${endTime} (3h) - Indisponible` : `${timeStr} - ${endTime} (3h)`}
                  </option>
                );
              }
              return hours;
            })()}
          </select>
          {timeError && (
            <p className="text-red-400 text-sm mt-2">{timeError}</p>
          )}
          {!timeError && formData.startTime && (
            <p className="text-green-400 text-sm mt-2">✓ Créneau disponible</p>
          )}
          {bookedTimes.length > 0 && (
            <p className="text-slate-400 text-sm mt-2">
              Les heures grisées sont déjà réservées
            </p>
          )}
        </label>
      )}

      {/* Lieu */}
      <label className="space-y-2 text-base text-slate-100">
        Lieu <span className="text-red-400">*</span>
        <select
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        >
          <option value="" className="bg-slate-900 text-white">Sélectionner un lieu</option>
          <option value="Studio" className="bg-slate-900 text-white">Studio</option>
          <option value="Domicile" className="bg-slate-900 text-white">Domicile *plus cher</option>
          <option value="Extérieur" className="bg-slate-900 text-white">Extérieur</option>
          <option value="Autre" className="bg-slate-900 text-white">Autre</option>
        </select>
      </label>

      {/* Inspirations (optionnel) - avec upload de photos */}
      <label className="space-y-2 text-base text-slate-100">
        Inspirations (optionnel)
        <div className="space-y-2">
          <input
            id="inspirationPhotos"
            type="file"
            accept="image/*"
            multiple
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
            onChange={(e) => {
              if (e.target.files) {
                setInspirationPhotos(e.target.files);
              }
            }}
          />
          {inspirationPhotos && inspirationPhotos.length > 0 && (
            <p className="text-sm text-slate-300">
              {inspirationPhotos.length} photo(s) sélectionnée(s)
            </p>
          )}
        </div>
      </label>

      {/* Retouches spéciales (optionnel) */}
      <label className="space-y-2 text-base text-slate-100">
        Retouches spéciales (optionnel)
        <textarea
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-1 ring-transparent transition focus:ring-indigo-400/60"
          placeholder="Décrivez vos besoins spécifiques en retouche..."
          value={formData.specialRetouches}
          onChange={(e) => setFormData({ ...formData, specialRetouches: e.target.value })}
        />
      </label>

      {/* Message de statut */}
      {message && (
        <div
          className={`rounded-xl p-4 text-base ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-200'
              : 'bg-red-500/20 border border-red-500/50 text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm sm:text-sm text-slate-200">
        <p className="text-center sm:text-left">Livraison des premières sélections après le shoot.</p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 py-3 sm:px-5 sm:py-2 text-sm sm:text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours...' : 'Réserver mon shooting maintenant'}
        </button>
      </div>
    </form>
  );
}

