import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

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

    const { data: reservation, error: reservationError } = await supabaseServer
      .from('reservations')
      .select('*')
      .eq('gallery_code', code.toUpperCase())
      .single();

    if (reservationError || !reservation || !reservation.gallery_created) {
      return NextResponse.json(
        { success: false, error: 'Code d\'accès invalide ou galerie non créée' },
        { status: 404 }
      );
    }

    // Vérifier si la galerie est expirée
    if (reservation.gallery_expires_at) {
      const expiresAt = new Date(reservation.gallery_expires_at);
      const now = new Date();
      
      if (now > expiresAt) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cette galerie a expiré',
            expired: true,
            expiresAt: reservation.gallery_expires_at
          },
          { status: 403 }
        );
      }
    }

    // Retourner les photos de la galerie client
    const gallery = {
      reservation,
      photos: reservation.gallery_photos || [], // Photos finales pour la galerie client
      expiresAt: reservation.gallery_expires_at,
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

