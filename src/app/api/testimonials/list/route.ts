import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

const mapTestimonial = (t: any) => ({
  id: t.id,
  name: t.name,
  role: t.role,
  quote: t.quote,
  project: t.project,
  rating: t.rating,
  date: t.date,
  image: t.image,
  email: t.email,
  approved: t.approved ?? false,
  createdAt: t.created_at,
});

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAuth(request);

    let query = supabaseServer
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('approved', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      testimonials: (data || []).map(mapTestimonial),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json({ success: true, testimonials: [] });
  }
}

