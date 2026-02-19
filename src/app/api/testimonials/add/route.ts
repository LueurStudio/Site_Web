import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { checkAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { testimonial, verificationCode } = await request.json();
    const isAdmin = await checkAuth(request);

    if (!testimonial?.name || !testimonial?.quote || !testimonial?.email) {
      return NextResponse.json(
        { error: 'Nom, email et témoignage requis' },
        { status: 400 }
      );
    }

    const email = String(testimonial.email).trim().toLowerCase();

    if (!isAdmin) {
      if (!verificationCode) {
        return NextResponse.json(
          { error: 'Code de vérification requis' },
          { status: 400 }
        );
      }

      const code = String(verificationCode).trim().toUpperCase();

      const { data: codeRow, error: codeError } = await supabaseServer
        .from('testimonial_codes')
        .select('code')
        .eq('email', email)
        .single();

      if (codeError || !codeRow || String(codeRow.code).toUpperCase() !== code) {
        return NextResponse.json(
          { error: 'Code de vérification invalide' },
          { status: 401 }
        );
      }
    }

    const { error: insertError } = await supabaseServer
      .from('testimonials')
      .insert({
        name: testimonial.name,
        role: testimonial.role || null,
        quote: testimonial.quote,
        project: testimonial.project || null,
        rating: testimonial.rating || 5,
        date: testimonial.date || null,
        image: testimonial.image || null,
        email,
        approved: isAdmin ? true : false,
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'avis' },
      { status: 500 }
    );
  }
}