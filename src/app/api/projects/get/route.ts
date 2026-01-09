import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { projects } from '@/app/portfolio/projects-data';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug requis' },
        { status: 400 }
      );
    }

    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du projet' },
      { status: 500 }
    );
  }
}

