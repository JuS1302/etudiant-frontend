# EtudiantFrontend

Front-end Angular de l'application EtuBibliothèque : les agents de la bibliothèque s'inscrivent, se connectent, puis gèrent les étudiants (liste, détail, ajout, modification, suppression).

Le back-end Spring Boot est dans le dépôt [etudiant-backend](https://github.com/JuS1302/etudiant-backend).

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## Pré-requis

- Node.js (version LTS) et npm
- Le back-end lancé sur `http://localhost:8080` pour utiliser l'application (pas nécessaire pour les tests)

## Installation

```bash
npm install
```

## Lancer l'application

```bash
npm start
```

Ouvrir ensuite `http://localhost:4200/`. Les appels à `/api` sont redirigés vers le back-end (`http://localhost:8080`) grâce au fichier `proxy.conf.json`.

## Écrans

| Adresse | Écran | Accès |
| --- | --- | --- |
| `/register` | inscription d'un agent | libre |
| `/login` | connexion | libre |
| `/students` | liste des étudiants | connecté |
| `/students/new` | ajout d'un étudiant | connecté |
| `/students/{id}` | détail d'un étudiant | connecté |
| `/students/{id}/edit` | modification d'un étudiant | connecté |

Après la connexion, le token JWT est rangé dans le `localStorage`. L'intercepteur `authInterceptor` l'ajoute à chaque requête (`Authorization: Bearer <token>`), et le guard `authGuard` renvoie vers `/login` si l'agent n'est pas connecté.

## Tests unitaires et d'intégration (Jest)

```bash
npx jest
```

Résultat attendu : `Tests: 37 passed, 37 total`. Le rapport de couverture est généré dans `coverage/` :

```bash
open coverage/index.html
```

Les services, le guard, l'intercepteur et tous les composants sont testés. Les appels HTTP sont simulés avec `HttpTestingController`, et les services avec des mocks `jest.fn()`.

## Tests end-to-end (Cypress)

Les tests E2E ouvrent l'application dans un vrai navigateur et la pilotent comme un utilisateur. Les réponses de l'API sont simulées avec `cy.intercept()` : **le back-end n'a pas besoin de tourner**.

1. Dans un premier terminal, lancer l'application **avec la mesure de couverture** :
   ```bash
   npm run start:e2e
   ```
   Attendre le message `Compiled successfully`.
2. Dans un second terminal, lancer les tests :
   ```bash
   npm run e2e        # dans le terminal
   npm run e2e:open   # ou dans la fenêtre Cypress, pour voir les tests en direct
   ```
   Résultat attendu : `All specs passed!` avec 10 tests.
3. Ouvrir le rapport de couverture :
   ```bash
   open coverage-e2e/index.html
   ```

| Fichier | Tests | Parcours |
| --- | --- | --- |
| `cypress/e2e/register.cy.ts` | 1 | inscription |
| `cypress/e2e/login.cy.ts` | 3 | connexion, déconnexion, protection par le guard |
| `cypress/e2e/students.cy.ts` | 6 | liste, ajout, détail, modification, suppression (depuis la liste et depuis le détail) |

`npm run start:e2e` construit l'application avec webpack et y ajoute des compteurs (instrumentation Istanbul) pour mesurer les lignes exécutées pendant les tests. Pour travailler normalement, utiliser `npm start`.

## Rapports de tests et de couverture

Une copie des derniers rapports est rangée dans le dossier [`rapports/`](rapports/) :

- `rapports/resultats-tests.txt` : la liste des tests Jest et Cypress, et le résumé de la couverture
- `rapports/couverture-jest/index.html` : la couverture des tests Jest
- `rapports/couverture-cypress/index.html` : la couverture des tests Cypress

| Tests | Nombre | Instructions | Lignes |
| --- | --- | --- | --- |
| Jest | 37 | 84,1 % | 83,3 % |
| Cypress | 10 | 83,7 % | 83,1 % |

## Construire l'application

```bash
npm run build
```

Les fichiers sont générés dans le dossier `dist/`.
