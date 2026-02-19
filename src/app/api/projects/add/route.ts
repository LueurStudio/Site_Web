import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';
import type { Project } from '@/app/portfolio/projects-data';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const project: Omit<Project, 'slug'> & { slug?: string } = await request.json();

    if (!project.title || !project.image || !project.description || !project.category) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Générer un slug à partir du titre si non fourni
    if (!project.slug) {
      project.slug = project.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const details = (project.details || []).filter((detail) => detail && detail.trim() !== '');
    const photos = (project.photos || []).filter((photo) => photo && photo.trim() !== '');

    const { data, error } = await supabaseServer
      .from('projects')
      .insert({
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle || '',
        image: project.image,
        description: project.description,
        details,
        photos,
        category: project.category,
        hidden: false,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du projet' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: data,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du projet' },
      { status: 500 }
    );
  }
}

