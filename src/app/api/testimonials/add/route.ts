import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { checkAuth } from '@/lib/auth';
import type { Testimonial } from '@/app/testimonials/testimonials-data';

export async function POST(request: NextRequest) {
  try {
    const { testimonial: testimonialData, verificationCode }: { testimonial: Omit<Testimonial, 'id' | 'approved' | 'createdAt'>, verificationCode?: string } = await request.json();

    // Vérifier si c'est un admin
    const isAdmin = await checkAuth(request);
    
    // Si pas d'authentification admin, vérifier le code de vérification
    if (!isAdmin) {
      // Vérification pour les clients
      if (!verificationCode || !testimonialData.email) {
        return NextResponse.json(
          { error: 'Code de vérification et email requis' },
          { status: 400 }
        );
      }
      
      // Vérifier le code en lisant directement le fichier
      const dataFileCodes = join(process.cwd(), 'src', 'app', 'testimonials', 'testimonials-data.ts');
      const contentCodes = await readFile(dataFileCodes, 'utf-8');
      
      // Parser les codes de vérification depuis le fichier
      const codesMatch = contentCodes.match(/export const verificationCodes: Record<string, string> = \{([\s\S]*?)\};/);
      const verificationCodes: Record<string, string> = {};
      
      if (codesMatch) {
        const codesContent = codesMatch[1];
        const codeLines = codesContent.match(/"([^"]+)":\s*"([^"]+)",?/g) || [];
        codeLines.forEach(line => {
          const match = line.match(/"([^"]+)":\s*"([^"]+)",?/);
          if (match) {
            verificationCodes[match[1].toLowerCase().trim()] = match[2].trim();
          }
        });
      }
      
      const emailLower = testimonialData.email.toLowerCase().trim();
      const codeUpper = verificationCode.toUpperCase().trim();
      const storedCode = verificationCodes[emailLower];
      
      console.log('Code verification in add:', { emailLower, codeUpper, storedCode, allCodes: verificationCodes, match: storedCode === codeUpper });
      
      if (!storedCode || storedCode !== codeUpper) {
        return NextResponse.json(
          { error: 'Code de vérification invalide' },
          { status: 401 }
        );
      }
    }

    const testimonial: Omit<Testimonial, 'id' | 'approved' | 'createdAt'> & { id?: string; approved?: boolean; createdAt?: string } = testimonialData;
    
    // Générer un ID unique si non fourni
    if (!testimonial.id) {
      testimonial.id = `testimonial-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Si c'est un admin, l'avis est approuvé directement, sinon en attente
    testimonial.approved = isAdmin ? (testimonial.approved !== undefined ? testimonial.approved : true) : false;
    testimonial.createdAt = testimonial.createdAt || new Date().toISOString();

    // Chemin vers le fichier testimonials-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'testimonials', 'testimonials-data.ts');
    
    // Lire le fichier actuel
    let content = await readFile(dataFile, 'utf-8');
    
    // Extraire le tableau testimonials
    const testimonialsMatch = content.match(/export const testimonials: Testimonial\[\] = \[([\s\S]*?)\];/);
    if (!testimonialsMatch) {
      throw new Error('Impossible de trouver le tableau testimonials');
    }

    // Ajouter le nouvel avis au format TypeScript
    const newTestimonialStr = `  {
    id: ${JSON.stringify(testimonial.id)},
    name: ${JSON.stringify(testimonial.name)},
    ${testimonial.role ? `role: ${JSON.stringify(testimonial.role)},` : ''}
    quote: ${JSON.stringify(testimonial.quote)},
    ${testimonial.project ? `project: ${JSON.stringify(testimonial.project)},` : ''}
    rating: ${testimonial.rating || 5},
    ${testimonial.date ? `date: ${JSON.stringify(testimonial.date)},` : ''}
    ${testimonial.image ? `image: ${JSON.stringify(testimonial.image)},` : ''}
    ${testimonial.email ? `email: ${JSON.stringify(testimonial.email)},` : ''}
    approved: ${testimonial.approved || false},
    createdAt: ${JSON.stringify(testimonial.createdAt)},
  },`;

    // Insérer le nouvel avis avant la fermeture du tableau
    const insertPosition = content.lastIndexOf('];');
    const testimonialsStr = testimonialsMatch[1].trim();
    const newContent = 
      content.slice(0, insertPosition) + 
      (testimonialsStr && !testimonialsStr.endsWith(',') ? (testimonialsStr ? ',' : '') + '\n' : '') + newTestimonialStr + '\n' + 
      content.slice(insertPosition);

    // Écrire le nouveau contenu
    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      testimonial: { ...testimonial, id: testimonial.id } as Testimonial
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'avis' },
      { status: 500 }
    );
  }
}

