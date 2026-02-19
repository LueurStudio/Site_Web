import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { slug, hidden }: { slug: string; hidden: boolean } = await request.json();

    if (!slug || typeof hidden !== 'boolean') {
      return NextResponse.json(
        { error: 'Slug et hidden requis' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('projects')
      .update({ hidden })
      .eq('slug', slug);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de visibilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
