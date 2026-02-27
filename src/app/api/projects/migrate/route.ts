import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';
import { projects } from '@/app/portfolio/projects-data';

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { data: existingProjects } = await supabaseServer
      .from('projects')
      .select('slug, hidden');

    const hiddenBySlug = new Map<string, boolean>(
      (existingProjects ?? []).map((p: { slug: string; hidden?: boolean }) => [
        p.slug,
        p.hidden === true,
      ])
    );

    const payload = projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle || '',
      image: project.image,
      description: project.description,
      details: project.details || [],
      photos: project.photos || [],
      category: project.category,
      hidden: hiddenBySlug.get(project.slug) ?? false,
    }));

    const { error } = await supabaseServer
      .from('projects')
      .upsert(payload, { onConflict: 'slug' });

    if (error) throw error;

    return NextResponse.json({ success: true, count: payload.length });
  } catch (error) {
    console.error('Erreur lors de la migration des projets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la migration des projets' },
      { status: 500 }
    );
  }
}
