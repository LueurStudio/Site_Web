import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Lire le fichier projects-data.ts et extraire les projets
    const dataFile = join(process.cwd(), 'src', 'app', 'portfolio', 'projects-data.ts');
    const content = await readFile(dataFile, 'utf-8');
    
    // Extraire le tableau projects en utilisant eval (safe ici car c'est notre propre fichier)
    // Ou mieux, parser le JSON depuis le contenu
    const projectsMatch = content.match(/export const projects: Project\[\] = \[([\s\S]*?)\];/);
    
    if (!projectsMatch) {
      return NextResponse.json({ projects: [] });
    }

    // Import dynamique du module (meilleure approche)
    const { projects } = await import('@/app/portfolio/projects-data');
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    // Fallback: retourner un tableau vide
    return NextResponse.json({ projects: [] });
  }
}

