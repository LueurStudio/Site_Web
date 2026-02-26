/**
 * Normalise les URLs d'images JPG/JPEG en WebP pour l'affichage.
 * - Convertit .jpg/.jpeg en .webp (avec ou sans query/hash).
 * - Si l'URL est absolue et que le chemin est /images/... ou /uploads/... (nos assets),
 *   on garde seulement le chemin relatif pour que les images chargent depuis le domaine actuel.
 *   Ainsi ça fonctionne avec n'importe quel domaine (Vercel, futur nom de domaine, etc.).
 */
export function toWebPUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  let pathOrUrl = url;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const u = new URL(url);
      if (u.pathname.startsWith('/images/') || u.pathname.startsWith('/uploads/')) {
        pathOrUrl = u.pathname;
      }
    }
  } catch {
    // garder l'URL telle quelle en cas d'erreur de parsing
  }
  return pathOrUrl.replace(/\.(jpe?g)(\?|#|$)/gi, '.webp$2');
}

export function toWebPUrls(urls: string[]): string[] {
  return (urls ?? []).map(toWebPUrl);
}
