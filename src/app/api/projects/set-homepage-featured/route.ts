import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let slug: string, featured: boolean;
  try {
    ({ slug, featured } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  if (!slug || typeof featured !== 'boolean') {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }

  const { data: project, error: getError } = await supabaseServer
    .from('projects')
    .select('category')
    .eq('slug', slug)
    .single();

  if (getError || !project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
  }

  // Retire la couverture de tous les projets de cette catégorie
  const { error: clearError } = await supabaseServer
    .from('projects')
    .update({ homepage_featured: false })
    .eq('category', project.category);

  if (clearError) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }

  if (featured) {
    const { error: setError } = await supabaseServer
      .from('projects')
      .update({ homepage_featured: true })
      .eq('slug', slug);

    if (setError) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
