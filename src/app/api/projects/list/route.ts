import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { checkAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const includeHidden = request.nextUrl.searchParams.get('includeHidden') === '1';
    const isAdmin = includeHidden ? await checkAuth(request) : false;

    let query = supabaseServer
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeHidden || !isAdmin) {
      query = query.eq('hidden', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    const projects = (data || []).map((project: any) => ({
      ...project,
      details: project.details ?? [],
      photos: project.photos ?? [],
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json({ projects: [] });
  }
}

