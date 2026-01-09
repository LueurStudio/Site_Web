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

    const project: Omit<Project, 'slug'> & { slug?: string } = await request.json();

    // Générer un slug à partir du titre si non fourni
    if (!project.slug) {
      project.slug = project.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Chemin vers le fichier projects-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'portfolio', 'projects-data.ts');
    
    // Lire le fichier actuel
    let content = await readFile(dataFile, 'utf-8');
    
    // Extraire le tableau projects
    const projectsMatch = content.match(/export const projects: Project\[\] = \[([\s\S]*?)\];/);
    if (!projectsMatch) {
      throw new Error('Impossible de trouver le tableau projects');
    }

    // Parser le contenu JSON (en remplaçant les simples quotes par des doubles quotes pour le parsing)
    const projectsStr = projectsMatch[1];
    
    // Ajouter le nouveau projet au format TypeScript
    const newProjectStr = `  {
    slug: "${project.slug}",
    title: ${JSON.stringify(project.title)},
    subtitle: ${JSON.stringify(project.subtitle)},
    image: ${JSON.stringify(project.image)},
    description: ${JSON.stringify(project.description)},
    details: [${project.details.map(d => JSON.stringify(d)).join(',\n      ')}],
    photos: [${project.photos.map(p => JSON.stringify(p)).join(',\n      ')}],
    category: ${JSON.stringify(project.category)},
  },`;

    // Insérer le nouveau projet avant la fermeture du tableau
    const insertPosition = content.lastIndexOf('];');
    const projectsStrTrimmed = projectsStr.trim();
    const newContent = 
      content.slice(0, insertPosition) + 
      (projectsStrTrimmed ? (projectsStrTrimmed.endsWith(',') ? '' : ',') + '\n' : '') + newProjectStr + '\n' + 
      content.slice(insertPosition);

    // Écrire le nouveau contenu
    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      project: { ...project, slug: project.slug } as Project
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du projet' },
      { status: 500 }
    );
  }
}

