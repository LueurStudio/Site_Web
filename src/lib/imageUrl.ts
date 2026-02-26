/**
 * Normalise les URLs d'images JPG/JPEG en WebP pour l'affichage.
 * Les fichiers ont été convertis en WebP ; les chemins en base peuvent encore être en .jpg
 */
export function toWebPUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/\.(jpe?g)$/i, '.webp');
}

export function toWebPUrls(urls: string[]): string[] {
  return (urls ?? []).map(toWebPUrl);
}
