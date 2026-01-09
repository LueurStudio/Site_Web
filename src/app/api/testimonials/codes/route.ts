import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { checkAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Import dynamique pour recharger les codes à jour
    const { verificationCodes } = await import('@/app/testimonials/testimonials-data');
    return NextResponse.json({ success: true, codes: verificationCodes });
  } catch (error) {
    console.error('Erreur lors de la récupération des codes:', error);
    return NextResponse.json({ success: true, codes: {} });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { email, code, action }: { email: string; code?: string; action: 'add' | 'remove' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Chemin vers le fichier testimonials-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'testimonials', 'testimonials-data.ts');
    
    // Lire le fichier actuel
    let content = await readFile(dataFile, 'utf-8');
    
    // Trouver la section verificationCodes
    const codesMatch = content.match(/export const verificationCodes: Record<string, string> = \{([\s\S]*?)\};/);
    
    if (!codesMatch) {
      throw new Error('Impossible de trouver la section verificationCodes');
    }

    // Import dynamique pour obtenir les codes actuels
    const { verificationCodes: currentCodesObj } = await import('@/app/testimonials/testimonials-data');
    const currentCodes = { ...currentCodesObj };
    
    if (action === 'add' && code) {
      currentCodes[email.toLowerCase()] = code.toUpperCase();
    } else if (action === 'remove') {
      delete currentCodes[email.toLowerCase()];
    }

    // Générer le nouveau contenu des codes
    const codesStr = Object.entries(currentCodes)
      .map(([email, code]) => `  ${JSON.stringify(email)}: ${JSON.stringify(code)},`)
      .join('\n');

    // Remplacer la section verificationCodes
    const newContent = content.replace(
      /export const verificationCodes: Record<string, string> = \{[\s\S]*?\};/,
      `export const verificationCodes: Record<string, string> = {\n${codesStr}\n};`
    );

    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true,
      message: action === 'add' ? 'Code ajouté avec succès' : 'Code supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification des codes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification des codes' },
      { status: 500 }
    );
  }
}

