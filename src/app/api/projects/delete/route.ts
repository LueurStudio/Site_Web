import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { slug }: { slug: string } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('projects')
      .delete()
      .eq('slug', slug)
      .select('id');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du projet' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Projet supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}

