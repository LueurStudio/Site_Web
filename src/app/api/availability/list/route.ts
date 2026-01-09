import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { blockedDates, unlockedDates } from '@/app/availability/availability-data';

export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

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

