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

Les écrans appellent uniquement `src/api.js`. Lors du raccordement Spring Boot, ce fichier sera remplacé par les appels HTTP sans modifier les pages.

Les composants utilisent des états de chargement, succès, erreur et liste vide lorsque des données sont chargées.

## Limites connues

Le projet utilise actuellement une API locale persistée dans le navigateur. Elle est destinée à la démonstration; les contrôles d'accès définitifs, les mots de passe chiffrés et le stockage de fichiers seront assurés par l'API Spring Boot.

Comptes de démonstration préchargés :

- client : `client@monvisasur.test` / `Client123!`
- conseiller : `conseiller@monvisasur.test` / `Conseiller123!`
- administrateur : `admin@monvisasur.test` / `Admin123!`
