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

    const { slug, photos }: { slug: string; photos: string[] } = await request.json();

    if (!slug || !photos || !Array.isArray(photos)) {
      return NextResponse.json(
        { error: 'Slug et photos requises' },
        { status: 400 }
      );
    }

    // Chemin vers le fichier projects-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'portfolio', 'projects-data.ts');
    
    // Lire le fichier actuel
    let content = await readFile(dataFile, 'utf-8');
    
    // Trouver le projet par son slug
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const slugPattern = new RegExp(`slug:\\s*"${escapedSlug}"`, 'i');
    const slugMatch = content.search(slugPattern);
    
    if (slugMatch === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Trouver le bloc photos pour ce projet
    const afterSlug = content.substring(slugMatch);
    const photosStart = afterSlug.search(/photos:\s*\[/);
    
    if (photosStart === -1) {
      return NextResponse.json(
        { error: 'Format de projet invalide - photos non trouvées' },
        { status: 500 }
      );
    }

    // Trouver la fin du tableau photos
    let bracketCount = 0;
    let i = slugMatch + photosStart + afterSlug.substring(photosStart).indexOf('[');
    let startIndex = i;
    let endIndex = i;
    
    for (; i < content.length; i++) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') bracketCount--;
      if (bracketCount === 0 && content[i] === ']') {
        endIndex = i + 1;
        break;
      }
    }

    if (endIndex === startIndex) {
      return NextResponse.json(
        { error: 'Impossible de trouver la fin du tableau photos' },
        { status: 500 }
      );
    }

    // Reconstruire la chaîne photos avec le nouvel ordre/suppression
    const newPhotosStr = `[${photos.map(p => JSON.stringify(p)).join(',\n      ')}]`;

    // Remplacer dans le contenu
    const newContent = 
      content.substring(0, startIndex) + 
      newPhotosStr + 
      content.substring(endIndex);

    // Écrire le nouveau contenu
    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true,
      photos: photos
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

