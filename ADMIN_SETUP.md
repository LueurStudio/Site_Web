# Configuration de l'Administration

## Configuration du mot de passe

Pour sécuriser l'accès à l'administration, créez un fichier `.env.local` à la racine du projet avec le mot de passe :

```env
ADMIN_PASSWORD=votre-mot-de-passe-securise
```

Si ce fichier n'existe pas, le mot de passe par défaut sera `admin123` (non recommandé pour la production).

## Accès à l'administration

1. Allez sur `/admin` dans votre navigateur
2. Entrez le mot de passe configuré
3. Vous pourrez alors :
   - Uploader des photos
   - Ajouter de nouveaux projets au portfolio

## Fonctionnalités

### Upload de photos
- Formats acceptés : JPG, PNG, WebP
- Taille maximale : 10MB
- Les photos sont stockées dans `public/images/`

### Ajout de projets
- Formulaire complet pour créer un nouveau projet
- Les projets sont automatiquement ajoutés au fichier `projects-data.ts`
- Le slug est généré automatiquement à partir du titre

