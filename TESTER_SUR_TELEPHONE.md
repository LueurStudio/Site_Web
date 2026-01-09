# Tester le site sur votre téléphone

## Prérequis

1. **Votre ordinateur et votre téléphone doivent être sur le même réseau WiFi**
2. **Le serveur Next.js doit être en cours d'exécution** avec `npm run dev`

## Étapes

### 1. Trouver votre adresse IP locale

**Sur Windows (PowerShell) :**
```powershell
ipconfig
```

Cherchez la ligne **"Adresse IPv4"** sous **"Carte réseau sans fil Wi-Fi"** ou **"Adaptateur Ethernet"**.
`10.93.181.240` 

**Méthode rapide :**
```powershell
ipconfig | findstr /i "IPv4"
```

### 2. Vérifier que le serveur est accessible

Dans le terminal Next.js, vous devriez voir quelque chose comme :
```
  ▲ Next.js 16.0.8
  - Local:        http://localhost:3000
  - Network:      http://10.93.181.240:3000
```

L'adresse affichée sous **"Network"** est celle à utiliser sur votre téléphone.

### 3. Accéder depuis votre téléphone

1. **Sur votre téléphone**, ouvrez le navigateur (Chrome, Safari, etc.)
2. **Dans la barre d'adresse**, tapez :
   ```
   http://VOTRE_IP:3000
   ```
   Par exemple : `http://10.93.181.240:3000`

### 4. Résolution des problèmes

#### Si la page ne charge pas :

**a) Vérifier le pare-feu Windows :**
   - Ouvrez "Pare-feu Windows Defender" → "Paramètres avancés"
   - Cliquez sur "Règles de trafic entrant" → "Nouvelle règle"
   - Sélectionnez "Port" → Suivant
   - TCP, Ports spécifiques : `3000` → Suivant
   - Autoriser la connexion → Suivant
   - Cochez tous les profils → Suivant
   - Nom : "Next.js Dev Server" → Terminer

**b) Vérifier que vous êtes sur le même réseau :**
   - L'ordinateur et le téléphone doivent être connectés au même WiFi
   - Certains réseaux WiFi d'entreprise peuvent bloquer la communication entre appareils

**c) Vérifier l'adresse IP :**
   - Assurez-vous d'utiliser l'IP locale (commence souvent par 192.168.x.x ou 10.x.x.x)
   - N'utilisez pas 127.0.0.1 ou localhost (ce sont des adresses locales uniquement)

**d) Redémarrer le serveur :**
   - Arrêtez le serveur (Ctrl+C)
   - Relancez avec `npm run dev`

### 5. Astuce : Utiliser un nom personnalisé (optionnel)

Si vous avez configuré `LueurStudio.fr` dans votre fichier hosts sur l'ordinateur :
- Sur le téléphone, vous devrez toujours utiliser l'IP directement (ex: `http://10.93.181.240:3000`)
- Les fichiers hosts ne s'appliquent qu'à l'appareil où ils sont configurés

## Test rapide

Pour tester rapidement si le serveur est accessible :
1. Sur votre téléphone, ouvrez un navigateur
2. Tapez : `http://10.93.181.240:3000` (remplacez par votre IP)
3. Si ça fonctionne, vous verrez votre site !

## Note importante

- Utilisez **HTTP** (pas HTTPS) pour le développement local
- Le port par défaut est **3000**, mais vérifiez ce qui est affiché dans votre terminal
- L'IP peut changer si vous vous reconnectez au WiFi

