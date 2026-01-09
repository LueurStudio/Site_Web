/**
 * Retourne l'URL directe de l'image depuis /public
 */
export function getProtectedImageUrl(imagePath: string, forDownload: boolean = false): string {
  // Si c'est une URL externe, la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Retourner l'URL directe depuis /public
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

/**
 * Détecte si une requête est un téléchargement
 */
export function isDownloadRequest(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Vérifier si l'utilisateur fait un clic droit ou utilise Ctrl+S
  // Cette fonction sera utilisée côté client pour intercepter les téléchargements
  return false;
}

