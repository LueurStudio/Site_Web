import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { reservations } from '@/app/reservations/reservations-data';

export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Filtrer les valeurs null/undefined et trier par date de création (plus récentes en premier)
    const validReservations = reservations.filter(r => r !== null && r !== undefined && r.id);
    const sortedReservations = [...validReservations].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ 
      success: true, 
      reservations: sortedReservations 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

