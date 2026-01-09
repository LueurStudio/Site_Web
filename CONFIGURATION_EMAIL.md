# Configuration de l'envoi d'emails

## Pourquoi vous ne recevez pas d'emails ?

Si vous ne recevez pas d'emails de réservation, c'est probablement parce que la clé API Brevo n'est pas configurée.

## Comment configurer l'envoi d'emails

### 1. Créer un compte Brevo

1. Allez sur https://www.brevo.com
2. Créez un compte gratuit (300 emails/jour gratuits)
3. Une fois connecté, allez dans **SMTP & API** > **API Keys**
4. Cliquez sur **Generate a new API key**
5. Donnez-lui un nom (ex: "LueurStudio Production")
6. Copiez la clé API générée

### 2. Configurer la clé API dans votre projet

1. À la racine du projet (`site-photo`), créez un fichier nommé `.env.local` (s'il n'existe pas déjà)
2. Ajoutez-y la ligne suivante :

```env
BREVO_API_KEY=votre_cle_api_ici
NEXT_PUBLIC_SITE_URL=https://lueurstudio
```

**Important :** Remplacez `votre_cle_api_ici` par la vraie clé API que vous avez copiée depuis Brevo.

### 3. Redémarrer le serveur

Après avoir créé/modifié le fichier `.env.local`, vous devez **redémarrer votre serveur de développement** :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Relancez-le avec `npm run dev`

### 4. Vérifier que ça fonctionne

1. Remplissez le formulaire de réservation sur votre site
2. Vérifiez la console du terminal pour voir si les emails sont envoyés
3. Vérifiez votre boîte mail (admin) et celle du client (confirmation)

## Emails envoyés

Le système envoie maintenant **2 emails** :

1. **Email à l'admin** (`lueurstudio.contact@gmail.com`) : Contient tous les détails de la réservation
2. **Email de confirmation au client** : Confirmation de réception de sa demande avec récapitulatif

## Vérifier les erreurs

Si les emails ne sont toujours pas envoyés après configuration :

1. Vérifiez la console du terminal pour voir les erreurs
2. Vérifiez que la clé API est correcte
3. Vérifiez que le serveur a été redémarré après modification de `.env.local`
4. Vérifiez votre compte Brevo pour voir les logs d'envoi d'emails

## Note importante

Le fichier `.env.local` est déjà dans `.gitignore`, donc il ne sera pas versionné. C'est normal et sécurisé - chaque développeur/instance doit avoir sa propre clé API.
