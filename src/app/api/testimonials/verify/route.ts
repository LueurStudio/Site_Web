import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const { email, code }: { email: string; code: string } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const codeUpper = code.toUpperCase().trim();

    const { data, error } = await supabaseServer
      .from('testimonial_codes')
      .select('code')
      .eq('email', emailLower)
      .single();

    if (error || !data) {
      return NextResponse.json({
        success: false,
        message: 'Code de vérification invalide',
      });
    }

    const isValid = String(data.code).toUpperCase() === codeUpper;

    return NextResponse.json({
      success: isValid,
      message: isValid ? 'Code de vérification valide' : 'Code de vérification invalide',
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
