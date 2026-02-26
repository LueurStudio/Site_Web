import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { faqItems } = await import('@/app/faq/faq-data');
    return NextResponse.json({ items: faqItems });
  } catch (error) {
    console.error('Erreur lors de la récupération de la FAQ:', error);
    return NextResponse.json({ items: [] });
  }
}
