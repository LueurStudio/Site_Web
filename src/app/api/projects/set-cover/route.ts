import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let slug: string, coverUrl: string;
  try {
    ({ slug, coverUrl } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  if (!slug || !coverUrl) {
    return NextResponse.json({ error: 'slug et coverUrl requis' }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from('projects')
    .update({ image: coverUrl })
    .eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
