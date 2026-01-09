import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Reservation } from '@/app/reservations/reservations-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code d\'accès requis' },
        { status: 400 }
      );
    }

    // Charger les réservations
    const dataFile = join(process.cwd(), 'src', 'app', 'reservations', 'reservations-data.ts');
    let content = await readFile(dataFile, 'utf-8');
    const reservationsMatch = content.match(/export const reservations: Reservation\[\] = (\[[\s\S]*?\]);/);
    
    if (!reservationsMatch) {
      return NextResponse.json(
        { success: false, error: 'Impossible de charger les réservations' },
        { status: 500 }
      );
    }

    let reservations: Reservation[] = eval(reservationsMatch[1]);
    
    // Trouver la réservation avec ce code
    const reservation = reservations.find(r => r.galleryCode?.toUpperCase() === code.toUpperCase());

    if (!reservation || !reservation.galleryCreated) {
      return NextResponse.json(
        { success: false, error: 'Code d\'accès invalide ou galerie non créée' },
        { status: 404 }
      );
    }

    // Vérifier si la galerie est expirée
    if (reservation.galleryExpiresAt) {
      const expiresAt = new Date(reservation.galleryExpiresAt);
      const now = new Date();
      
      if (now > expiresAt) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cette galerie a expiré',
            expired: true,
            expiresAt: reservation.galleryExpiresAt
          },
          { status: 403 }
        );
      }
    }

    // Retourner les photos de la galerie client
    const gallery = {
      reservation,
      photos: reservation.galleryPhotos || [], // Photos finales pour la galerie client
      expiresAt: reservation.galleryExpiresAt,
    };

    return NextResponse.json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

