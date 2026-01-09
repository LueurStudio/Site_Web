import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const imagePath = path.join('/');
    
    // Construire le chemin complet vers l'image dans public
    const publicPath = join(process.cwd(), 'public', imagePath);
    
    // Vérifier que le fichier existe
    let imageBuffer: Buffer;
    try {
      imageBuffer = await readFile(publicPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    // Détecter si c'est un téléchargement ou un affichage
    const acceptHeader = request.headers.get('accept') || '';
    const referer = request.headers.get('referer') || '';
    const secFetchDest = request.headers.get('sec-fetch-dest') || '';
    const secFetchMode = request.headers.get('sec-fetch-mode') || '';
    const range = request.headers.get('range') || '';
    const userAgent = request.headers.get('user-agent') || '';
    
    const siteOrigin = request.nextUrl.origin;
    const hasReferer = referer && (
      referer.startsWith(siteOrigin) || 
      referer.includes('localhost') ||
      referer.includes('127.0.0.1')
    );
    
    // C'est un téléchargement si :
    // 1. sec-fetch-dest est "empty" (téléchargement direct)
    // 2. Pas de referer ET pas d'accept image (accès direct)
    // 3. Accept contient "application/octet-stream"
    // 4. C'est un outil de téléchargement
    // 5. Pas de range header (les requêtes d'affichage ont souvent un range pour le streaming)
    
    const isDownload = 
      secFetchDest === 'empty' ||
      (!hasReferer && !acceptHeader.includes('image/')) ||
      acceptHeader.includes('application/octet-stream') ||
      userAgent.includes('curl') ||
      userAgent.includes('wget') ||
      (!range && !acceptHeader.includes('image/'));

    // Log pour déboguer
    console.log('🔍 Image request:', {
      path: imagePath,
      hasReferer: !!hasReferer,
      accept: acceptHeader,
      secFetchDest,
      secFetchMode,
      hasRange: !!range,
      isDownload,
    });

    // Si c'est un téléchargement, ajouter le filigrane
    if (isDownload) {
      console.log('✅ Téléchargement détecté - Ajout du filigrane');
      return await addWatermark(imageBuffer, path);
    } else {
      // Sinon, affichage normal sans filigrane
      console.log('👁️ Affichage normal - Pas de filigrane');
      return await serveImageWithoutWatermark(imageBuffer, path);
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de l\'image' },
      { status: 500 }
    );
  }
}

async function addWatermark(imageBuffer: Buffer, path: string[]): Promise<NextResponse> {
  const originalBuffer = imageBuffer;
  try {
    // Créer le filigrane avec sharp
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    // Dimensions de l'image
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;
    
    // Taille du texte du filigrane (adaptatif selon la taille de l'image)
    const baseFontSize = Math.max(60, Math.min(width, height) / 12);
    const text = 'LueurStudio';
    const spacing = baseFontSize * 1.5;
    
    // Créer un SVG pour le filigrane (texte répété en diagonale)
    const watermarkTexts1 = Array.from({ length: Math.ceil((width + height) / spacing) + 2 }, (_, i) => {
      const offset = (i - 1) * spacing;
      const x = offset - (height * 0.4);
      const y = offset + (height * 0.4);
      return `<text x="${x}" y="${y}" transform="rotate(-45 ${x} ${y})" class="watermark">${text}</text>`;
    }).join('');

    const watermarkTexts2 = Array.from({ length: Math.ceil((width + height) / spacing) + 2 }, (_, i) => {
      const offset = (i - 1) * spacing + (spacing / 2);
      const x = offset - (height * 0.4);
      const y = offset + (height * 0.4);
      return `<text x="${x}" y="${y}" transform="rotate(-45 ${x} ${y})" class="watermark">${text}</text>`;
    }).join('');

    const svgText = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .watermark {
            font-family: Arial, sans-serif;
            font-weight: 900;
            font-size: ${baseFontSize}px;
            fill: rgba(255, 255, 255, 0.75);
            stroke: rgba(0, 0, 0, 0.9);
            stroke-width: 3;
            letter-spacing: 2px;
          }
          .watermark-large {
            font-family: Arial, sans-serif;
            font-weight: 900;
            font-size: ${baseFontSize * 2.5}px;
            fill: rgba(255, 255, 255, 0.8);
            stroke: rgba(0, 0, 0, 0.95);
            stroke-width: 4;
            letter-spacing: 4px;
          }
        </style>
      </defs>
      ${watermarkTexts1}
      ${watermarkTexts2}
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" transform="rotate(-45 ${width / 2} ${height / 2})" class="watermark-large">${text}</text>
      <text x="${width - 50}" y="${height - 30}" text-anchor="end" class="watermark" transform="rotate(0 ${width - 50} ${height - 30})">${text}</text>
    </svg>`;

    // Appliquer le filigrane et conserver le format original
    const watermarkedImage = await image
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      // Conserver le format original (ne pas convertir en WebP)
      .toFormat(metadata.format || 'jpeg', {
        quality: metadata.format === 'png' ? undefined : 90,
      })
      .toBuffer();

    // Déterminer le type MIME
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const format = (metadata.format || 'jpeg').toLowerCase();
    const contentType = mimeTypes[format] || 'image/jpeg';

    // Retourner l'image avec filigrane
    return new NextResponse(watermarkedImage.buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${path[path.length - 1]}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (watermarkError) {
    console.error('Erreur lors de l\'ajout du filigrane:', watermarkError);
    // En cas d'erreur, retourner l'image originale
    return new NextResponse(originalBuffer.buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
}

async function serveImageWithoutWatermark(imageBuffer: Buffer, path: string[]): Promise<NextResponse> {
  const originalBuffer = imageBuffer;
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const format = (metadata.format || 'jpeg').toLowerCase();
    const contentType = mimeTypes[format] || 'image/jpeg';

    return new NextResponse(originalBuffer.buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    // En cas d'erreur, retourner l'image brute
    const extension = path[path.length - 1].split('.').pop()?.toLowerCase() || 'jpg';
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const contentType = mimeTypes[extension] || 'image/jpeg';

    return new NextResponse(originalBuffer.buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
}
