const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;

export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.size <= MAX_UPLOAD_BYTES && file.type === 'image/webp') return file;

  try {
    const imageBitmap = await createImageBitmap(file);
    const maxSide = Math.max(imageBitmap.width, imageBitmap.height);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / maxSide);
    const targetWidth = Math.round(imageBitmap.width * scale);
    const targetHeight = Math.round(imageBitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Conversion impossible'))),
        'image/webp',
        0.82,
      );
    });

    const nextName = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], nextName, { type: 'image/webp' });
  } catch {
    return file;
  }
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const compressed = await compressImageForUpload(file);
      const formData = new FormData();
      formData.append('file', compressed);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        errors.push(`${file.name}: ${errData.error || `Erreur HTTP ${res.status}`}`);
        continue;
      }
      const data = await res.json();
      if (data.success && data.url) {
        uploadedUrls.push(data.url);
      } else {
        errors.push(`${file.name}: ${data.error || 'Réponse invalide'}`);
      }
    } catch {
      errors.push(`${file.name}: Erreur lors de l'upload`);
    }
  }

  if (errors.length > 0) {
    alert('⚠️ Certains fichiers n\'ont pas pu être uploadés :\n\n' + errors.join('\n'));
  }

  return uploadedUrls;
}
