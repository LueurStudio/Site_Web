import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { pricingOffers } = await import('@/app/pricing/pricing-data');
    return NextResponse.json({ offers: pricingOffers });
  } catch (error) {
    console.error('Erreur lors de la récupération des tarifs:', error);
    return NextResponse.json({ offers: [] });
  }
}
