# Protection des Images du Portfolio

## Vue d'ensemble

Le système de protection des images a été mis en place pour empêcher la réutilisation non autorisée des photos du portfolio. Les images s'affichent normalement à l'écran, mais lorsqu'elles sont téléchargées, un filigrane visible "LueurStudio" est automatiquement ajouté.

## Comment ça fonctionne

### 1. Architecture

- **Route API** : `/api/images/protected/[...path]`
  - Sert les images depuis le dossier `public/`
  - Détecte les téléchargements via le paramètre `?download=true`
  - Ajoute un filigrane visible uniquement lors du téléchargement

- **Utilitaire** : `src/app/utils/image-protection.ts`
  - Fonction `getProtectedImageUrl()` pour convertir les chemins d'images
  - Gère les URLs normales et les URLs de téléchargement

- **Composant** : `PhotoGallery.tsx`
  - Utilise la route protégée pour toutes les images
  - Les images s'affichent normalement sans filigrane

### 2. Fonctionnement technique

#### Affichage normal
- Les images sont servies via `/api/images/protected/images/...`
- Aucun filigrane n'est ajouté
- Performance optimale avec cache

#### Téléchargement
- Détection automatique via les headers HTTP :
  - Paramètre `?download=true` dans l'URL
  - Absence de referer depuis notre site
  - Header `Accept` ne contenant pas "image/"
  - Outils de téléchargement (curl, wget, etc.)
- Le serveur utilise **Sharp** pour :
  1. Charger l'image originale
  2. Générer un SVG avec le filigrane "LueurStudio"
  3. Superposer le filigrane en diagonale (motif répété)
  4. Ajouter un filigrane central très visible
  5. Retourner l'image avec filigrane

### 3. Protection mise en place

✅ **Clic droit** : Intercepté et redirige vers le téléchargement avec filigrane
✅ **Images affichées** : Propres sans filigrane
✅ **Images téléchargées** : Filigrane très visible "LueurStudio"
✅ **Filigrane adaptatif** : Taille ajustée selon les dimensions de l'image
✅ **Support multi-formats** : JPEG, PNG, WebP, GIF

## Limitations

⚠️ **Important** : Il est impossible d'empêcher complètement le téléchargement d'images affichées dans un navigateur. Les utilisateurs avancés peuvent toujours :
- Utiliser les outils de développement
- Faire des captures d'écran
- Utiliser des extensions de navigateur

Cependant, cette solution :
- Décourage la majorité des utilisateurs
- Rend les images téléchargées inutilisables professionnellement
- Protège contre le téléchargement direct

## Personnalisation

### Modifier le texte du filigrane

Dans `src/app/api/images/protected/[...path]/route.ts`, ligne ~40 :
```typescript
const text = 'LueurStudio'; // Changez ce texte
```

### Ajuster la visibilité du filigrane

Dans le même fichier, vous pouvez modifier :
- `fill: rgba(255, 255, 255, 0.75)` : Opacité du texte (0-1)
- `stroke: rgba(0, 0, 0, 0.9)` : Opacité du contour (0-1)
- `stroke-width: 3` : Épaisseur du contour
- `font-size: ${baseFontSize}px` : Taille de base du texte

### Changer le motif du filigrane

Le filigrane est généré via SVG. Vous pouvez modifier :
- L'angle de rotation (actuellement -45°)
- L'espacement entre les répétitions
- Le nombre de répétitions
- La position du filigrane central

## Tests

Pour tester le système :

1. **Affichage normal** :
   - Ouvrez une page de portfolio
   - Les images doivent s'afficher sans filigrane

2. **Téléchargement avec filigrane** :
   - Clic droit sur une image → "Enregistrer l'image sous..."
   - L'image téléchargée doit contenir automatiquement le filigrane "LueurStudio"
   - Le filigrane est détecté et ajouté automatiquement par le serveur

3. **Test direct de l'API** :
   - URL normale : `http://localhost:3000/api/images/protected/images/IMG_0602-1.jpg`
   - URL téléchargement : `http://localhost:3000/api/images/protected/images/IMG_0602-1.jpg?download=true`

## Performance

- **Cache** : Les images normales sont mises en cache (1 an)
- **Traitement à la demande** : Le filigrane n'est généré que lors du téléchargement
- **Sharp** : Bibliothèque optimisée pour le traitement d'images (très rapide)

## Maintenance

- Les images originales restent dans `public/images/`
- Aucune modification des fichiers originaux
- Le filigrane est généré dynamiquement à chaque téléchargement

