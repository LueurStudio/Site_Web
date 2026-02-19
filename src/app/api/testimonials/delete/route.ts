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

    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Avis supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'avis' },
      { status: 500 }
    );
  }
}
