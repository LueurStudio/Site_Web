import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { FaqItem } from '@/app/faq/faq-data';

const normalizeItem = (item: Partial<FaqItem>, index: number): FaqItem => {
  const question = String(item.question || '').trim();
  const answer = String(item.answer || '').trim();
  const id = String(item.id || `faq-${index + 1}`).trim();

  return { id, question, answer };
};

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { items }: { items: FaqItem[] } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'FAQ invalide' },
        { status: 400 }
      );
    }

    const normalizedItems = items.map(normalizeItem);
    const hasInvalid = normalizedItems.some((item) => !item.question || !item.answer);

    if (hasInvalid) {
      return NextResponse.json(
        { error: 'Chaque question doit avoir un titre et une réponse' },
        { status: 400 }
      );
    }

    const uniqueIds = new Set<string>();
    const uniqueItems = normalizedItems.map((item, index) => {
      let id = item.id || `faq-${index + 1}`;
      while (uniqueIds.has(id)) {
        id = `${id}-${uniqueIds.size + 1}`;
      }
      uniqueIds.add(id);
      return { ...item, id };
    });

    const dataFile = join(process.cwd(), 'src', 'app', 'faq', 'faq-data.ts');
    let content = await readFile(dataFile, 'utf-8');

    const newItemsContent = `export const faqItems: FaqItem[] = ${JSON.stringify(uniqueItems, null, 2)};`;
    const pattern = /export const faqItems: FaqItem\[\] = (\[[\s\S]*?\]);/;

    if (!pattern.test(content)) {
      return NextResponse.json(
        { error: 'Format de la FAQ invalide' },
        { status: 500 }
      );
    }

    content = content.replace(pattern, newItemsContent);
    await writeFile(dataFile, content, 'utf-8');

    return NextResponse.json({ success: true, items: uniqueItems });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la FAQ:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
