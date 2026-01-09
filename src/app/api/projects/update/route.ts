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
    
    // Trouver le projet par son slug avec un pattern plus robuste
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Chercher le bloc du projet qui commence avec ce slug
    const slugPattern = new RegExp(`slug:\\s*"${escapedSlug}"`, 'i');
    const slugMatch = content.search(slugPattern);
    
    if (slugMatch === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Trouver le début et la fin du bloc photos pour ce projet
    // Chercher "photos:" après le slug
    const afterSlug = content.substring(slugMatch);
    const photosStart = afterSlug.search(/photos:\s*\[/);
    
    if (photosStart === -1) {
      return NextResponse.json(
        { error: 'Format de projet invalide - photos non trouvées' },
        { status: 500 }
      );
    }

    // Trouver la fin du tableau photos en comptant les crochets
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

    // Extraire et parser les photos existantes
    const photosBlock = content.substring(startIndex, endIndex);
    // Utiliser JSON.parse si possible, sinon parser manuellement
    let existingPhotos: string[] = [];
    
    try {
      // Nettoyer le bloc pour le parsing JSON (remplacer les simples quotes par doubles quotes)
      const cleanedBlock = photosBlock
        .replace(/\[|\]/g, '')
        .split(',')
        .map(p => {
          const trimmed = p.trim();
          // Si c'est déjà entre guillemets, garder tel quel
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
              (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return JSON.parse(trimmed.replace(/'/g, '"'));
          }
          return trimmed;
        })
        .filter(p => p && p.length > 0);
      
      existingPhotos = cleanedBlock;
    } catch (e) {
      // Fallback: parser manuellement
      const matches = photosBlock.matchAll(/"([^"]+)"/g);
      existingPhotos = Array.from(matches, m => m[1]);
    }

    // Fusionner avec les nouvelles photos (éviter les doublons)
    const allPhotos = [...new Set([...existingPhotos, ...photos])];

    // Reconstruire la chaîne photos avec le bon formatage
    const newPhotosStr = `[${allPhotos.map(p => JSON.stringify(p)).join(',\n      ')}]`;

    // Remplacer dans le contenu
    const newContent = 
      content.substring(0, startIndex) + 
      newPhotosStr + 
      content.substring(endIndex);

    // Écrire le nouveau contenu
    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true,
      photos: allPhotos
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

