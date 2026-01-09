import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { checkAuth } from '@/lib/auth';
import { testimonials } from '@/app/testimonials/testimonials-data';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id, approved }: { id: string; approved: boolean } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    // Trouver et mettre à jour l'avis
    const testimonialIndex = testimonials.findIndex(t => t.id === id);
    
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      );
    }

    const updatedTestimonials = testimonials.map(t => 
      t.id === id ? { ...t, approved } : t
    );

    // Chemin vers le fichier testimonials-data.ts
    const dataFile = join(process.cwd(), 'src', 'app', 'testimonials', 'testimonials-data.ts');
    
    // Lire le fichier pour préserver le formatage
    let content = await readFile(dataFile, 'utf-8');
    
    // Extraire la partie avant le tableau testimonials
    const beforeMatch = content.match(/^([\s\S]*?export const testimonials: Testimonial\[\] = \[)/);
    if (!beforeMatch) {
      throw new Error('Impossible de trouver le début du tableau testimonials');
    }
    
    const beforeTestimonials = beforeMatch[1];
    
    // Générer le contenu du tableau testimonials
    const testimonialsStr = updatedTestimonials.map((testimonial) => {
      return `  {
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
    }).join('\n\n');

    // Reconstruire le fichier
    const newContent = beforeTestimonials + '\n' + testimonialsStr + '\n];\n';
    
    await writeFile(dataFile, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true,
      message: approved ? 'Avis approuvé' : 'Avis désapprouvé'
    });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'avis' },
      { status: 500 }
    );
  }
}

