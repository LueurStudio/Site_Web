import { NextRequest, NextResponse } from 'next/server';
import { blockedDates, unlockedDates } from '@/app/availability/availability-data';

export async function GET(request: NextRequest) {
  try {
    // Route publique pour obtenir les dates bloquées et déverrouillées
    // (sans besoin d'authentification pour le formulaire public)
    return NextResponse.json({
      success: true,
      blockedDates,
      unlockedDates,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
}

