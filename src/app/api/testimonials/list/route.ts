import { NextRequest, NextResponse } from 'next/server';
import { testimonials } from '@/app/testimonials/testimonials-data';
import { checkAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Si c'est un admin, retourner tous les avis, sinon uniquement les approuvés
    const isAdmin = await checkAuth(request);
    
    // Filtrer les valeurs null/undefined et s'assurer que tous ont les propriétés requises
    const validTestimonials = testimonials.filter(t => t !== null && t !== undefined).map(t => ({
      ...t,
      approved: t.approved !== undefined ? t.approved : false,
    }));
    
    if (isAdmin) {
      return NextResponse.json({ success: true, testimonials: validTestimonials });
    } else {
      // Pour le public, ne retourner que les avis approuvés
      const approvedTestimonials = validTestimonials.filter(t => t.approved === true);
      return NextResponse.json({ success: true, testimonials: approvedTestimonials });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json({ success: true, testimonials: [] });
  }
}

