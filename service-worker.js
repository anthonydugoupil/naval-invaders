const CACHE_NAME = 'naval-invaders-v9';
// IMPORTANT : à chaque modification du jeu, changer ce numéro de version (v9 -> v10, etc.),
// sinon les joueurs qui ont déjà ouvert le jeu continueront de recevoir l'ancienne copie.
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation : met en cache les fichiers essentiels au jeu.
// cache: 'reload' force un vrai téléchargement depuis le serveur : sans cela, le navigateur
// peut réutiliser sa copie HTTP (GitHub Pages en garde une quelques minutes) et ranger
// l'ANCIENNE version du jeu dans le NOUVEAU cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS_TO_CACHE.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

// Activation : nettoie les anciennes versions du cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch : sert le cache en priorité ; pour toute navigation qui échouerait
// (hors-ligne + URL non trouvée telle quelle), on retombe sur index.html en dernier
// recours, pour garantir que le jeu se charge toujours hors-ligne.
// ignoreSearch : un lancement depuis l'écran d'accueil peut ajouter des paramètres à l'adresse
// (ex. ?source=pwa) ; on les ignore pour retrouver quand même la copie en cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      });
    })
  );
});
