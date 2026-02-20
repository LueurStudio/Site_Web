'use client';

import { useState, useEffect } from 'react';

interface AvailabilityCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  blockedDates: string[];
  unlockedDates: string[];
}

export default function AvailabilityCalendar({
  selectedDate,
  onDateSelect,
  blockedDates,
  unlockedDates,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const formatDateString = (date: Date): string => {
    // Créer la date en local pour éviter les problèmes de timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Charger les dates disponibles pour le mois en cours
    loadAvailableDates();
  }, [currentMonth, blockedDates, unlockedDates]);

  const loadAvailableDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Première et dernière journée du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const dates: string[] = [];
    const current = new Date(firstDay);

    while (current <= lastDay) {
      const dateString = formatDateString(current);
      const dayOfWeek = current.getDay();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(current);
      checkDate.setHours(0, 0, 0, 0);

      // Ignorer les dates passées
      if (checkDate >= today) {
        // Si bloquée, pas disponible
        if (blockedDates.includes(dateString)) {
          // Ne pas ajouter
        }
        // Si déverrouillée, disponible
        else if (unlockedDates.includes(dateString)) {
          dates.push(dateString);
        }
        // Si week-end, disponible
        else if (dayOfWeek === 0 || dayOfWeek === 6) {
          dates.push(dateString);
        }
      }

      current.setDate(current.getDate() + 1);
    }

    setAvailableDates(dates);
  };

  const isDateAvailable = (dateString: string): boolean => {
    return availableDates.includes(dateString);
  };

  const isDateBlocked = (dateString: string): boolean => {
    return blockedDates.includes(dateString);
  };

  const isDateUnlocked = (dateString: string): boolean => {
    return unlockedDates.includes(dateString);
  };

  const isDatePast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };


  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Convertir pour que lundi = 0, dimanche = 6
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    // Jours vides au début du mois
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const days = getDaysInMonth();
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="rounded-full border border-stone-300 px-3 py-1 text-sm text-stone-700 hover:bg-stone-100 transition"
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <h3 className="text-base sm:text-lg font-semibold capitalize">{formatMonthYear()}</h3>
        <button
          onClick={nextMonth}
          className="rounded-full border border-stone-300 px-3 py-1 text-sm text-stone-700 hover:bg-stone-100 transition"
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-stone-600">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded border border-emerald-400 bg-emerald-400/30"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded border border-red-400 bg-red-400/20"></div>
          <span>Bloquée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded border border-stone-400 bg-stone-200"></div>
          <span>Indisponible</span>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-stone-500 py-1 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendrier */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateString = formatDateString(date);
          const isSelected = selectedDate === dateString;
          const isPast = isDatePast(date);
          const isAvailable = isDateAvailable(dateString);
          const isBlocked = isDateBlocked(dateString);
          const isUnlocked = isDateUnlocked(dateString);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          let bgColor = 'bg-white border-stone-200';
          let textColor = 'text-stone-500';
          let cursorClass = 'cursor-not-allowed';

          if (isPast) {
            bgColor = 'bg-stone-50 border-stone-200';
            textColor = 'text-stone-400';
          } else if (isBlocked) {
            bgColor = 'bg-red-500/15 border-red-400';
            textColor = 'text-red-700';
          } else if (isAvailable) {
            bgColor = isSelected ? 'bg-[#1c1916] border-[#1c1916]' : 'bg-emerald-400/15 border-emerald-400';
            textColor = isSelected ? 'text-[#faf7f2]' : 'text-emerald-700';
            cursorClass = 'cursor-pointer hover:bg-emerald-400/25';
          } else {
            bgColor = 'bg-stone-50 border-stone-200';
            textColor = 'text-stone-500';
          }

          return (
            <button
              key={dateString}
              onClick={() => {
                if (!isPast && isAvailable && !isBlocked) {
                  onDateSelect(dateString);
                }
              }}
              disabled={isPast || !isAvailable || isBlocked}
              className={`
                aspect-square rounded border transition-all
                ${bgColor} ${textColor} ${cursorClass}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={
                isPast
                  ? 'Date passée'
                  : isBlocked
                  ? 'Date bloquée'
                  : isAvailable
                  ? isUnlocked
                    ? 'Disponible (déverrouillée)'
                    : 'Disponible (week-end)'
                  : 'Indisponible'
              }
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs sm:text-sm font-semibold">{date.getDate()}</span>
                {isUnlocked && !isBlocked && isAvailable && (
                  <span className="text-[7px] leading-tight">★</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-stone-500 mt-3 text-center">
        Cliquez sur une date disponible (vert) pour la sélectionner
      </p>
    </div>
  );
}

