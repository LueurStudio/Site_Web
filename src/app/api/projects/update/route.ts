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

    const { slug, photos }: { slug: string; photos: string[] } = await request.json();

    if (!slug || !photos || !Array.isArray(photos)) {
      return NextResponse.json(
        { error: 'Slug et photos requises' },
        { status: 400 }
      );
    }

    const { data: project, error } = await supabaseServer
      .from('projects')
      .select('photos')
      .eq('slug', slug)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    const existingPhotos = Array.isArray(project.photos) ? project.photos : [];
    const cleanedPhotos = photos.filter((photo) => photo && photo.trim() !== '');
    const allPhotos = [...new Set([...existingPhotos, ...cleanedPhotos])];

    const { error: updateError } = await supabaseServer
      .from('projects')
      .update({ photos: allPhotos })
      .eq('slug', slug);

    if (updateError) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du projet' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photos: allPhotos,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

