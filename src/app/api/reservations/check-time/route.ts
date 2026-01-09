import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Reservation } from '@/app/reservations/reservations-data';

export async function POST(request: NextRequest) {
  try {
    const { date, startTime, duration = 3 }: { date: string; startTime: string; duration?: number } = await request.json();

    if (!date || !startTime) {
      return NextResponse.json(
        { error: 'Date et heure requises' },
        { status: 400 }
      );
    }

    // Vérifier que l'heure est entre 10h et 20h
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 10 || hour > 20) {
      return NextResponse.json({
        available: false,
        reason: 'Les réservations sont disponibles uniquement entre 10h et 20h',
      });
    }

    // Vérifier que le créneau ne dépasse pas 20h
    const endHour = hour + duration;
    if (endHour > 21) { // 20h + 3h = 23h, mais on s'arrête à 20h de début, donc max fin à 23h... non, si on commence à 18h ça fait 18h-21h
      // En fait, si on commence à 18h, ça fait 18h-21h, donc on devrait accepter jusqu'à 17h (17h-20h)
      // Donc on doit vérifier que hour + duration <= 21 (ou hour <= 20 - duration + 1)
      if (hour > 20 - duration) {
        return NextResponse.json({
          available: false,
          reason: `Ce créneau dépasse 20h. Dernier créneau disponible: ${20 - duration}:00`,
        });
      }
    }

    // Charger les réservations existantes pour cette date
    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');
    const reservationsMatch = content.match(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/);
    
    if (!reservationsMatch) {
      return NextResponse.json({
        available: true, // Si on ne peut pas charger, on considère comme disponible
      });
    }

    let reservations: Reservation[] = [];
    try {
      reservations = JSON.parse(reservationsMatch[1]);
    } catch {
      reservations = eval(reservationsMatch[1]);
    }

    // Filtrer les réservations pour cette date avec un créneau horaire
    const reservationsForDate = reservations.filter((r: any) => 
      r !== null && 
      r !== undefined && 
      r.date === date && 
      r.startTime && 
      (r.status === 'pending' || r.status === 'confirmed') // Seulement les réservations actives
    );

    // Vérifier les chevauchements
    const startMinutes = hour * 60 + parseInt(startTime.split(':')[1] || '0');
    const endMinutes = startMinutes + (duration * 60);

    for (const reservation of reservationsForDate) {
      if (!reservation.startTime) continue;
      
      const resStartHour = parseInt(reservation.startTime.split(':')[0]);
      const resStartMinutes = resStartHour * 60 + parseInt(reservation.startTime.split(':')[1] || '0');
      const resDuration = reservation.duration || 3;
      const resEndMinutes = resStartMinutes + (resDuration * 60);

      // Vérifier le chevauchement
      // Chevauchement si: (start < resEnd) && (end > resStart)
      if (startMinutes < resEndMinutes && endMinutes > resStartMinutes) {
        return NextResponse.json({
          available: false,
          reason: `Ce créneau chevauche une réservation existante de ${reservation.startTime} à ${Math.floor(resEndMinutes / 60)}:${(resEndMinutes % 60).toString().padStart(2, '0')}`,
        });
      }
    }

    return NextResponse.json({
      available: true,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du créneau:', error);
    return NextResponse.json(
      { available: false, reason: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

