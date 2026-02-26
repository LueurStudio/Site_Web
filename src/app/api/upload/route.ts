import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';
import sharp from 'sharp';

const WEBP_QUALITY = 82;
const CONVERT_TO_WEBP_TYPES = ['image/jpeg', 'image/jpg'];

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Valider la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const baseName = sanitizedName.replace(/\.(jpe?g|png|webp)$/i, '') || sanitizedName;
    const isJpeg = CONVERT_TO_WEBP_TYPES.includes(file.type);

    // Conversion automatique JPG/JPEG → WebP pour un meilleur poids et qualité web
    const outputBuffer: Buffer = isJpeg
      ? await sharp(inputBuffer).webp({ quality: WEBP_QUALITY }).toBuffer()
      : inputBuffer;
    const contentType = isJpeg ? 'image/webp' : file.type;

    const filePath = isJpeg
      ? `uploads/${timestamp}_${baseName}.webp`
      : `uploads/${timestamp}_${sanitizedName}`;

    const { error: uploadError } = await supabaseServer.storage
      .from('projects')
      .upload(filePath, outputBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      );
    }

    const { data: publicData } = supabaseServer.storage
      .from('projects')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      filename: filePath,
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}



