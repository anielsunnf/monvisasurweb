# Application : Monvisasur

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

Puis ouvrir l'URL affichée par Vite, `http://localhost:5173/`.

## Commandes

```powershell
npm run dev     # serveur de développement
npm run build   # compilation de production
npm run lint    # contrôle Oxlint
npm run test    # tests Vitest + Testing Library
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

## Ajouts récents

- **Messagerie sur les dossiers** : un client échange avec le conseiller chargé de son dossier, le conseiller répond dans son back-office, l'administrateur consulte toutes les conversations. Les droits sont contrôlés dans la façade de données, pas dans les écrans.
- **Interface en 6 langues** : français, anglais, espagnol, hindi, russe et chinois, via i18next. Le choix est mémorisé dans le navigateur et modifiable depuis le sélecteur de l'en-tête (`LanguageSwitcher`). Les libellés manquants d'une langue héritent automatiquement du français.
- **Contrastes des deux thèmes** : le mode clair et le mode sombre garantissent la lisibilité des pastilles de statut, chips, messages d'erreur et accents sur toutes les pages, y compris sur téléphone — le thème sombre profite en particulier aux personnes sensibles à la luminosité de l'écran.

## Architecture

- `src/pages` : écrans publics, authentification, réservation, espace client et back-office ;
- `src/components` : composants partagés (en-tête, pied de page, modale, filtre, messages, routes protégées) ;
- `src/data` : jeu de données statique des services et trajets ;
- `src/locales` : libellés des 6 langues ;
- `src/test` : tests d'interface (Vitest + Testing Library) ;
- `src/api.js` : façade unique des appels de données locaux.

Les écrans appellent uniquement `src/api.js`. Lors du raccordement Spring Boot, ce fichier sera remplacé par les appels HTTP sans modifier les pages.

Les composants utilisent des états de chargement, succès, erreur et liste vide lorsque des données sont chargées.

## Limites connues

Le projet utilise actuellement une API locale persistée dans le navigateur. Elle est destinée à la démonstration ; les contrôles d'accès définitifs, les mots de passe chiffrés et le stockage de fichiers seront assurés par l'API Spring Boot.

Les traductions et les contrastes des deux thèmes sont fonctionnels sur l'ensemble des écrans, mais n'ont pas encore reçu de passe de finition complète (vérification automatisée des contrastes, relecture fine de certaines traductions).

Comptes de démonstration préchargés :

- client : `client@monvisasur.test` / `Client123!`
- conseiller : `conseiller@monvisasur.test` / `Conseiller123!`
- administrateur : `admin@monvisasur.test` / `Admin123!`

## Dépôt

Le code source est hébergé sur GitHub : https://github.com/anielsunnf/monvisasurweb (déploiement Vercel fourni via `vercel.json`).

Application déployée : https://monvisasurweb.vercel.app