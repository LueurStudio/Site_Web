import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseServer
      .from('testimonial_codes')
      .select('email, code');

    if (error) throw error;

    const codes = (data || []).reduce<Record<string, string>>((acc, row) => {
      acc[String(row.email).toLowerCase()] = String(row.code).toUpperCase();
      return acc;
    }, {});

    return NextResponse.json({ success: true, codes });
  } catch (error) {
    console.error('Erreur lors de la récupération des codes:', error);
    return NextResponse.json({ success: true, codes: {} });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { email, code, action }: { email: string; code?: string; action: 'add' | 'remove' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (action === 'add') {
      if (!code) {
        return NextResponse.json(
          { error: 'Code requis' },
          { status: 400 }
        );
      }

      const normalizedCode = String(code).toUpperCase().trim();

      const { error } = await supabaseServer
        .from('testimonial_codes')
        .upsert({ email: normalizedEmail, code: normalizedCode }, { onConflict: 'email' });

      if (error) throw error;
    } else if (action === 'remove') {
      const { error } = await supabaseServer
        .from('testimonial_codes')
        .delete()
        .eq('email', normalizedEmail);

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: action === 'add' ? 'Code ajouté avec succès' : 'Code supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la modification des codes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification des codes' },
      { status: 500 }
    );
  }
}
