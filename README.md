# Monvisasur

Application front-end React/Vite de gestion de démarches administratives, de trajets et de réservations.

## Prérequis

- Node.js 20 ou plus récent
- npm

## Installation

Depuis le dossier `afri-link-front` :

```powershell
npm install
npm run dev
```

Puis ouvrir l'URL affichée par Vite, généralement `http://localhost:5173/`.

## Commandes

```powershell
npm run dev     # serveur de développement
npm run build   # compilation de production
npm run lint    # contrôle Oxlint
npm run preview # aperçu de la compilation
```

## Fonctionnalités du niveau 1

- accueil public, catalogue et fiches détaillées des prestations ;
- inscription et connexion locale avec profils client, conseiller et administrateur ;
- ouverture d'un dossier avec validation et téléversement d'une pièce ;
- espace client avec dossiers, statuts et commandes ;
- recherche de trajets et réservation simulée avec récapitulatif ;
- back-office avec consultation et modification des statuts ;
- routes protégées selon l'authentification et le profil.

## Architecture

- `src/pages` : écrans publics, authentification, réservation et espace client ;
- `src/components` : composants partagés ;
- `src/data` : jeu de données statique des services et trajets ;
- `src/api.js` : façade unique des appels de données locaux ;
- `src/api/index.js` : ancien point d'entrée conservé pour compatibilité ; les écrans utilisent `src/api.js`.

Les composants utilisent des états de chargement, succès, erreur et liste vide lorsque des données sont chargées.

## Limites connues

Le projet utilise actuellement une API locale en mémoire. Les comptes, dossiers et commandes sont perdus au rechargement de la page. Les fonctions de `src/api.js` sont isolées pour permettre un remplacement ultérieur par des appels HTTP sans modifier les écrans.

Les comptes de démonstration ne sont pas préremplis : il faut créer un compte depuis l'écran d'inscription avant de se connecter.
