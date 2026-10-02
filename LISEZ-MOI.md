# Naval Invaders — PWA

## Contenu de l'archive
- `index.html` — le jeu complet
- `manifest.json` — la carte d'identité de l'application (nom, icônes, orientation portrait)
- `service-worker.js` — permet le fonctionnement hors-ligne et l'installation
- `icons/` — les deux icônes de l'application (192px et 512px)

## Important : il faut un vrai serveur, pas un double-clic

Une PWA ne fonctionne pleinement (manifeste, hors-ligne, vibration, etc.) que si les
fichiers sont servis via **http://** ou **https://** — jamais en ouvrant `index.html`
directement depuis l'explorateur de fichiers (`file://`). C'est une restriction des
navigateurs, pas un défaut du jeu.

## Tester en local avant de diffuser

Si Python est installé sur ton ordinateur, ouvre un terminal dans le dossier
`naval-invaders-pwa` et lance :

```
python3 -m http.server 8000
```

Puis ouvre `http://localhost:8000` dans Chrome sur ton téléphone (connecté au même
réseau Wi-Fi que ton ordinateur, en remplaçant `localhost` par l'adresse IP locale de
ce dernier, par exemple `http://192.168.1.42:8000`).

## Mettre en ligne pour une vraie diffusion

Comme tu comptes diffuser le jeu toi-même (sans passer par un store), le plus simple
est un hébergement statique gratuit. Quelques options, sans rien à installer côté
serveur :

- **GitHub Pages** : dépose les fichiers dans un dépôt GitHub, active "Pages" dans les
  réglages du dépôt. Gratuit, HTTPS automatique.
- **Netlify** ou **Vercel** : glisser-déposer le dossier sur leur interface web suffit
  généralement à obtenir une adresse HTTPS en quelques secondes.

Une fois en ligne, n'importe qui pourra ouvrir le lien sur son téléphone Android avec
Chrome, puis utiliser le menu du navigateur → "Ajouter à l'écran d'accueil" pour
installer le jeu comme une vraie application, avec son icône et sans barre d'adresse.

## À vérifier après la mise en ligne

- Le retour haptique (vibration) devrait fonctionner, contrairement au test en `file://`.
- Le meilleur score se sauvegarde via `localStorage`, propre à chaque appareil/navigateur.
- L'orientation reste verrouillée en portrait ; en paysage, un message invite à tourner
  le téléphone.
