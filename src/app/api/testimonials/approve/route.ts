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

    const { id, approved }: { id: string; approved: boolean } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('testimonials')
      .update({ approved })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: approved ? 'Avis approuvé' : 'Avis désapprouvé',
    });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'avis' },
      { status: 500 }
    );
  }
}
