# Naval Invaders — PWA

## Contenu de l'archive
- `index.html` — le jeu complet
- `manifest.json` — la carte d'identité de l'application (nom, icônes, orientation portrait)
- `service-worker.js` — permet le fonctionnement hors-ligne et l'installation
- `icon-192.png` et `icon-512.png` — les deux icônes de l'application (192px et 512px)
- `og-image.png` — l'image d'aperçu (1200x630) affichée quand le lien du jeu est partagé ; elle ne sert
  qu'aux aperçus de liens, le jeu ne la charge pas et le service worker ne la met pas en cache

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

**Règle d'or : tous les fichiers à la racine du dépôt, sans aucun sous-dossier.** Le jeu
cherche ses icônes à côté de `index.html`. Si une icône n'est pas au bon endroit, tout
semble fonctionner à l'écran mais : l'icône du raccourci devient une vignette grise avec
une lettre, l'installation comme application échoue, et le service worker ne s'installe
pas (donc pas de mode hors-ligne). Aucune erreur n'est affichée au joueur.

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
   (`naval-invaders-v9` devient `naval-invaders-v10`, puis `v11`, etc.).
2. Dans `index.html`, change le repère de build affiché en bas de l'écran titre
   (de la forme `build-AAAA-MM-JJ-X`), pour pouvoir constater à l'œil nu quelle version
   tourne sur un appareil.
3. Mets en ligne tous les fichiers modifiés (le service worker et le jeu ensemble).

Sans ce changement de numéro, les personnes qui ont déjà ouvert le jeu risquent de
garder l'ancienne version, parfois très longtemps. Une fois la mise à jour publiée,
il faut ouvrir le jeu une première fois (qui télécharge la nouvelle version en
arrière-plan), puis une seconde fois pour qu'elle soit effectivement utilisée.

Pour savoir quelle version tourne sur un appareil : regarde le repère de build en bas de
l'écran titre. Sur ordinateur, le cache en place est aussi visible dans Chrome → F12 →
onglet « Application » → « Cache Storage ».

## Vérifier le mode hors-ligne (sur la version en ligne)

Attention : un simple test en mode avion peut tromper. Après un chargement, le navigateur
garde sa propre copie de la page pendant environ dix minutes (GitHub Pages l'y autorise)
et peut la rouvrir sans réseau, sans que le service worker y soit pour quoi que ce soit.
La preuve fiable se lit sur ordinateur, dans Chrome :

1. Ouvre l'adresse du jeu, puis F12 → onglet « Application » → « Service Workers » :
   le statut doit être « activated and is running ».
2. Même onglet → « Cache Storage » : un cache `naval-invaders-vN` doit contenir
   5 entrées (`./`, `index.html`, `manifest.json` et les deux icônes).
3. Onglet « Network », recharge la page : la colonne « Size » doit afficher
   « (ServiceWorker) » pour `index.html` et les icônes.
4. Pour finir, coche « Offline » (dans « Service Workers » ou « Network ») et recharge :
   le jeu doit se lancer.

Le même onglet « Application », rubrique « Manifest », indique si Chrome juge
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

## Aperçu du lien quand on le partage

Le début de `index.html` contient des balises (`og:title`, `og:description`, `og:image`...) qui
indiquent aux messageries le titre, la description et l'image à afficher sous le lien. L'image
est `og-image.png`, à déposer à la racine du dépôt comme les autres fichiers. Les adresses de ces
balises sont complètes (elles commencent par `https://anthonydugoupil.github.io/naval-invaders/`) ;
c'est obligatoire, une adresse relative n'est pas comprise par les messageries.

Les messageries gardent l'aperçu en mémoire : un lien déjà partagé peut continuer à s'afficher
sans image un certain temps, même après la mise en ligne. Pour tester, partage le lien à soi-même,
ou ajoute un paramètre à l'adresse (par exemple `...naval-invaders/?v=2`) pour forcer une nouvelle lecture.
Pour Facebook et Messenger, l'outil « Sharing Debugger » de Facebook permet de rafraîchir l'aperçu.
