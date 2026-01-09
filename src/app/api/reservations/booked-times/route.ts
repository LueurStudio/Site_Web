import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Reservation } from '@/app/reservations/reservations-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date requise' },
        { status: 400 }
      );
    }

    // Charger les réservations existantes
    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');
    const reservationsMatch = content.match(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/);
    
    if (!reservationsMatch) {
      return NextResponse.json({
        success: true,
        bookedTimes: [],
      });
    }

    let reservations: Reservation[] = [];
    try {
      reservations = JSON.parse(reservationsMatch[1]);
    } catch {
      reservations = eval(reservationsMatch[1]);
    }

    // Filtrer les réservations pour cette date avec un créneau horaire actif
    // On exclut 'completed' car une fois le shooting terminé, le créneau peut être réutilisé
    const reservationsForDate = reservations.filter((r: any) => 
      r !== null && 
      r !== undefined && 
      r.date === date && 
      r.startTime && 
      (r.status === 'pending' || r.status === 'confirmed') // Seulement les réservations actives
    );

    // Extraire les heures réservées avec leur durée
    const bookedSlots: Array<{ startTime: string; endTime: string; duration: number }> = [];
    
    for (const reservation of reservationsForDate) {
      if (!reservation.startTime) continue;
      
      const startHour = parseInt(reservation.startTime.split(':')[0]);
      const startMinutes = startHour * 60 + parseInt(reservation.startTime.split(':')[1] || '0');
      const duration = reservation.duration || 3;
      const endMinutes = startMinutes + (duration * 60);
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      
      bookedSlots.push({
        startTime: reservation.startTime,
        endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
        duration,
      });
    }

    return NextResponse.json({
      success: true,
      bookedTimes: bookedSlots,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des heures réservées:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des heures réservées' },
      { status: 500 }
    );
  }
}

