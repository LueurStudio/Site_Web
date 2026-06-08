import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { PricingOffer } from '@/app/pricing/pricing-data';

const normalizeOffer = (offer: Partial<PricingOffer>, index: number): PricingOffer => {
  const name = String(offer.name || '').trim();
  const price = String(offer.price || '').trim();
  const unit = String(offer.unit || 'à partir de').trim();
  const desc = String(offer.desc || '').trim();
  const features = Array.isArray(offer.features) ? offer.features : [];
  const id = String(offer.id || `offer-${index + 1}`).trim();

  return { id, name, price, unit, desc, features };
};

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { offers }: { offers: PricingOffer[] } = await request.json();

    if (!Array.isArray(offers)) {
      return NextResponse.json(
        { error: 'Offres invalides' },
        { status: 400 }
      );
    }

    const normalizedOffers = offers.map(normalizeOffer);
    const hasInvalid = normalizedOffers.some((offer) => !offer.name || !offer.price);

    if (hasInvalid) {
      return NextResponse.json(
        { error: 'Chaque offre doit avoir un nom et un prix' },
        { status: 400 }
      );
    }

    const uniqueIds = new Set<string>();
    const uniqueOffers = normalizedOffers.map((offer, index) => {
      let id = offer.id || `offer-${index + 1}`;
      while (uniqueIds.has(id)) {
        id = `${id}-${uniqueIds.size + 1}`;
      }
      uniqueIds.add(id);
      return { ...offer, id };
    });

    const dataFile = join(process.cwd(), 'src', 'app', 'pricing', 'pricing-data.ts');
    let content = await readFile(dataFile, 'utf-8');

    const newOffersContent = `export const pricingOffers: PricingOffer[] = ${JSON.stringify(uniqueOffers, null, 2)};`;
    const pattern = /export const pricingOffers: PricingOffer\[\] = (\[[\s\S]*?\]);/;

    if (!pattern.test(content)) {
      return NextResponse.json(
        { error: 'Format des tarifs invalide' },
        { status: 500 }
      );
    }

    content = content.replace(pattern, newOffersContent);
    await writeFile(dataFile, content, 'utf-8');

    return NextResponse.json({ success: true, offers: uniqueOffers });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des tarifs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
