import { NextRequest, NextResponse } from 'next/server';
import { isDateAvailable } from '@/app/availability/availability-data';

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

    const result = isDateAvailable(date);

    return NextResponse.json({
      success: true,
      available: result.available,
      reason: result.reason,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

