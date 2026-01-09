// Dates bloquées (indisponibles) - format YYYY-MM-DD
export const blockedDates: string[] = [];

// Dates déverrouillées (disponibles même en semaine) - format YYYY-MM-DD
export const unlockedDates: string[] = [
  "2026-01-16"
];

// Fonction pour vérifier si une date est disponible
export function isDateAvailable(dateString: string): { available: boolean; reason?: string } {
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.getDay(); // 0 = Dimanche, 6 = Samedi

  // Vérifier si la date est bloquée
  if (blockedDates.includes(dateString)) {
    return { available: false, reason: 'Cette date est bloquée' };
  }

  // Si c'est un week-end (Samedi = 6, Dimanche = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { available: true };
  }

  // Si c'est en semaine, vérifier si la date est déverrouillée
  if (unlockedDates.includes(dateString)) {
    return { available: true };
  }

  // Sinon, pas disponible (jour de semaine non déverrouillé)
  return { available: false, reason: 'Les réservations sont disponibles uniquement les week-ends' };
}

// Fonction pour obtenir toutes les dates disponibles dans une plage
export function getAvailableDatesInRange(startDate: Date, endDate: Date): string[] {
  const availableDates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    const { available } = isDateAvailable(dateString);
    
    if (available) {
      availableDates.push(dateString);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableDates;
}

