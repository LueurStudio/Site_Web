import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { Reservation } from '@/app/reservations/reservations-data';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'> = {
      lastName: formData.get('lastName') as string,
      firstName: formData.get('firstName') as string,
      email: formData.get('email') as string,
      prestationType: formData.get('prestationType') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      specialRetouches: (formData.get('specialRetouches') as string) || undefined,
      inspirationPhotos: formData.getAll('inspirationPhotos').length > 0 
        ? formData.getAll('inspirationPhotos').map(p => p as string)
        : undefined,
    };

    // Validation
    if (!reservation.lastName || !reservation.firstName || !reservation.email || 
        !reservation.prestationType || !reservation.date || !reservation.location) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    const newReservation: Reservation = {
      ...reservation,
      id: `reservation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Sauvegarder dans le fichier reservations-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');

    const reservationsMatch = content.match(/export const reservations: Reservation\[\] = \[([\s\S]*?)\];/);
    if (!reservationsMatch) {
      throw new Error('Impossible de trouver le tableau reservations');
    }

    const newReservationStr = `  {
    id: ${JSON.stringify(newReservation.id)},
    lastName: ${JSON.stringify(newReservation.lastName)},
    firstName: ${JSON.stringify(newReservation.firstName)},
    email: ${JSON.stringify(newReservation.email)},
    prestationType: ${JSON.stringify(newReservation.prestationType)},
    date: ${JSON.stringify(newReservation.date)},
    location: ${JSON.stringify(newReservation.location)},
    ${newReservation.specialRetouches ? `specialRetouches: ${JSON.stringify(newReservation.specialRetouches)},` : ''}
    ${newReservation.inspirationPhotos ? `inspirationPhotos: ${JSON.stringify(newReservation.inspirationPhotos)},` : ''}
    createdAt: ${JSON.stringify(newReservation.createdAt)},
    status: ${JSON.stringify(newReservation.status)},
  },`;

    const insertPosition = content.lastIndexOf('];');
    const reservationsStr = reservationsMatch[1].trim();
    const newContent = 
      content.slice(0, insertPosition) + 
      (reservationsStr && !reservationsStr.endsWith(',') ? (reservationsStr ? ',' : '') + '\n' : '') + newReservationStr + '\n' + 
      content.slice(insertPosition);

    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      reservation: newReservation
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la réservation' },
      { status: 500 }
    );
  }
}

