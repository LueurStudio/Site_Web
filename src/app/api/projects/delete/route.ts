import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { checkAuth } from '@/lib/auth';
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

    const { slug }: { slug: string } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug requis' },
        { status: 400 }
      );
    }

    // Chemin vers le fichier projects-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'portfolio', 'projects-data.ts');
    
    // Charger les projets existants
    const { projects } = await import('@/app/portfolio/projects-data');
    
    // Trouver et supprimer le projet
    const projectIndex = projects.findIndex(p => p.slug === slug);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le projet du tableau
    const updatedProjects = projects.filter(p => p.slug !== slug);

    // Lire le fichier pour préserver le formatage
    let content = await readFile(dataFile, 'utf-8');
    
    // Extraire la partie avant le tableau projects
    const beforeMatch = content.match(/^([\s\S]*?export const projects: Project\[\] = \[)/);
    if (!beforeMatch) {
      throw new Error('Impossible de trouver le début du tableau projects');
    }
    
    const beforeProjects = beforeMatch[1];
    
    // Générer le contenu du tableau projects
    const projectsStr = updatedProjects.map((project) => {
      return `  {
    slug: ${JSON.stringify(project.slug)},
    title: ${JSON.stringify(project.title)},
    subtitle: ${JSON.stringify(project.subtitle)},
    image:
      ${JSON.stringify(project.image)},
    description:
      ${JSON.stringify(project.description)},
    details: [
      ${project.details.map(d => JSON.stringify(d)).join(',\n      ')},
    ],
    photos: [${project.photos.map(p => JSON.stringify(p)).join(',\n      ')}],
    category: ${JSON.stringify(project.category)},
  },`;
    }).join('\n\n');

    // Reconstruire le fichier
    const newContent = beforeProjects + '\n' + projectsStr + '\n];\n';
    
    // Extraire la partie après le tableau (s'il y a du contenu)
    const afterMatch = content.match(/\];\s*([\s\S]*)$/);
    if (afterMatch && afterMatch[1].trim()) {
      // Il y a du contenu après le tableau
      const fullNewContent = beforeProjects + '\n' + projectsStr + '\n];' + afterMatch[1];
      await writeFile(dataFile, fullNewContent, 'utf-8');
    } else {
      await writeFile(dataFile, newContent, 'utf-8');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}

