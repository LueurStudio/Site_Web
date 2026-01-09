import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email, code }: { email: string; code: string } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      );
    }

    // Lire directement le fichier pour éviter les problèmes de cache
    const dataFile = join(process.cwd(), 'src', 'app', 'testimonials', 'testimonials-data.ts');
    const content = await readFile(dataFile, 'utf-8');
    
    // Parser les codes de vérification depuis le fichier
    const codesMatch = content.match(/export const verificationCodes: Record<string, string> = \{([\s\S]*?)\};/);
    const verificationCodes: Record<string, string> = {};
    
    if (codesMatch) {
      const codesContent = codesMatch[1];
      // Parser chaque ligne de code
      const codeLines = codesContent.match(/"([^"]+)":\s*"([^"]+)",?/g) || [];
      codeLines.forEach(line => {
        const match = line.match(/"([^"]+)":\s*"([^"]+)",?/);
        if (match) {
          verificationCodes[match[1].toLowerCase().trim()] = match[2].trim();
        }
      });
    }
    
    const emailLower = email.toLowerCase().trim();
    const codeUpper = code.toUpperCase().trim();
    const storedCode = verificationCodes[emailLower];
    
    console.log('Verification attempt:', { 
      emailLower, 
      codeUpper, 
      storedCode, 
      allCodes: verificationCodes,
      isValid: storedCode === codeUpper 
    });
    
    const isValid = storedCode === codeUpper;

    return NextResponse.json({ 
      success: isValid,
      message: isValid ? 'Code de vérification valide' : 'Code de vérification invalide'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

