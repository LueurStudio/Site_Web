import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { action, date, dates }: { action: 'block' | 'unblock' | 'unlock' | 'lock'; date?: string; dates?: string[] } = await request.json();

    if (!action || (!date && !dates)) {
      return NextResponse.json(
        { error: 'Action et date/dates requis' },
        { status: 400 }
      );
    }

    const dataFile = join(process.cwd(), 'src', 'app', 'availability', 'availability-data.ts');
    let content = await readFile(dataFile, 'utf-8');

    // Extraire les tableaux actuels
    const blockedMatch = content.match(/export const blockedDates: string\[\] = (\[[\s\S]*?\]);/);
    const unlockedMatch = content.match(/export const unlockedDates: string\[\] = (\[[\s\S]*?\]);/);

    if (!blockedMatch || !unlockedMatch) {
      throw new Error('Impossible de trouver les tableaux de disponibilité');
    }

    let blockedDates: string[] = eval(blockedMatch[1]);
    let unlockedDates: string[] = eval(unlockedMatch[1]);

    const datesToProcess = dates || (date ? [date] : []);

    // Traiter chaque date
    datesToProcess.forEach((d) => {
      if (action === 'block') {
        // Bloquer : ajouter à blockedDates, retirer de unlockedDates
        if (!blockedDates.includes(d)) {
          blockedDates.push(d);
        }
        unlockedDates = unlockedDates.filter(date => date !== d);
      } else if (action === 'unblock') {
        // Débloquer : retirer de blockedDates
        blockedDates = blockedDates.filter(date => date !== d);
      } else if (action === 'unlock') {
        // Déverrouiller : ajouter à unlockedDates, retirer de blockedDates
        if (!unlockedDates.includes(d)) {
          unlockedDates.push(d);
        }
        blockedDates = blockedDates.filter(date => date !== d);
      } else if (action === 'lock') {
        // Verrouiller (enlever le déverrouillage) : retirer de unlockedDates
        unlockedDates = unlockedDates.filter(date => date !== d);
      }
    });

    // Trier les dates
    blockedDates.sort();
    unlockedDates.sort();

    // Reconstruire le fichier
    const newBlockedContent = `export const blockedDates: string[] = ${JSON.stringify(blockedDates, null, 2)};`;
    const newUnlockedContent = `export const unlockedDates: string[] = ${JSON.stringify(unlockedDates, null, 2)};`;

    content = content.replace(/export const blockedDates: string\[\] = (\[[\s\S]*?\]);/, newBlockedContent);
    content = content.replace(/export const unlockedDates: string\[\] = (\[[\s\S]*?\]);/, newUnlockedContent);

    await writeFile(dataFile, content, 'utf-8');

    return NextResponse.json({
      success: true,
      blockedDates,
      unlockedDates,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

