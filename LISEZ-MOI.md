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

## Publier une mise à jour (à ne pas oublier)

Le service worker sert en priorité la copie enregistrée sur l'appareil. Après chaque
modification du jeu :

1. Ouvre `service-worker.js` et change le numéro de version sur la première ligne
   (`naval-invaders-v6` devient `naval-invaders-v7`, puis `v8`, etc.).
2. Mets en ligne tous les fichiers modifiés (le service worker et le jeu ensemble).

Sans ce changement de numéro, les personnes qui ont déjà ouvert le jeu risquent de
garder l'ancienne version, parfois très longtemps. Une fois la mise à jour publiée,
il faut ouvrir le jeu une première fois (qui télécharge la nouvelle version en
arrière-plan), puis une seconde fois pour qu'elle soit effectivement utilisée.

Pour savoir quelle version est en cache sur un appareil : Chrome sur ordinateur →
F12 → onglet « Application » → « Cache Storage » (le nom du cache est le numéro de version).

## Vérifier le mode hors-ligne (sur la version en ligne, pas sur une copie téléchargée)

1. Ouvre l'adresse du jeu dans Chrome, avec du réseau, et laisse la page se charger
   complètement. Recharge-la une fois.
2. Active le mode avion (ou coupe le Wi-Fi et les données mobiles).
3. Rouvre le jeu depuis l'icône de l'écran d'accueil, ou en tapant à nouveau l'adresse.
   Il doit se lancer et se jouer normalement.

Sur ordinateur, même test : F12 → « Application » → « Service Workers » → cocher « Offline »,
puis recharger la page. Le même onglet, rubrique « Manifest », indique si Chrome juge
l'application installable et détaille les problèmes éventuels.

## Si l'installation échoue sur Android (« Installer » → erreur)

Sur Chrome Android, deux choses différentes se cachent derrière le menu :

- « Créer un raccourci » : un simple favori sur l'écran d'accueil. Il ouvre le jeu dans
  Chrome, avec sa barre d'adresse.
- « Installer » : une vraie application. Chrome la fabrique via les services Google Play,
  ce qui suppose que le Play Store soit accessible sur l'appareil.

Si l'installation échoue alors que le raccourci fonctionne, les pistes à vérifier côté
téléphone sont : le Play Store s'ouvre et se met à jour normalement, Google Play Services
et Chrome sont à jour, il reste de la place de stockage, et l'essai est refait avec une
autre connexion (Wi-Fi ou données mobiles).
