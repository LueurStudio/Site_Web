/**
 * Normalise les URLs d'images JPG/JPEG en WebP pour l'affichage.
 * Les fichiers ont été convertis en WebP ; les chemins en base peuvent encore être en .jpg
 * Gère .jpg, .jpeg, .JPG, .JPEG avec ou sans query string / hash.
 */
export function toWebPUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/\.(jpe?g)(\?|#|$)/gi, '.webp$2');
}

export function toWebPUrls(urls: string[]): string[] {
  return (urls ?? []).map(toWebPUrl);
}
