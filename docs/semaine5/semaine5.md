# 2 scénarios end-to-end

# Scénarios 

| Numéro | Scénario | Actions dans l'interface | Résultat attendu |
| :--- | :--- | :--- | :--- |
| 1 | Recherche avec résultat | Saisir un mot présent dans le titre d'une offre publiée comme par exemple 'Api' | Seules les offres correspondantes et visibles sont affichées. |
| 2 | Recherche sans résultat | Saisir un texte qui ne correspond à aucune offre comme par exemple 'zzzz' | Aucune offre correspondante n'est affichée |

## Justification : 
Nous avon choisi le premier car c'est une recherche des plus basique, nécessaire au bon fonctionnement du site et le 2ème parce que c'est un résultat qui est censé ne rien afficher.

# MCP 

MCP n'a pas fonctionné chez nous. 


# Playwright Test

## Fichiers crées : 

e2e/recherches-offres/recherche-offres.spec.ts
e2e/recherches-offres

## Principales assertions


TO DO 


## Deux exécutions successives 

$ npx playwright test

Running 6 tests using 6 workers
  6 passed (10.8s)

To open last HTML report run:

  npx playwright show-report




$ npx playwright test

Running 6 tests using 6 workers
  6 passed (11.0s)

To open last HTML report run:

  npx playwright show-report


----

$ npx playwright test --headed

Running 6 tests using 6 workers
  6 passed (14.8s)

To open last HTML report run:

  npx playwright show-report

----

$ npm run check

> check
> npm run lint && npm run typecheck && npm run test && npm run build


> lint
> npm run lint --workspaces


> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 28ms on 63 files with 85 rules using 12 threads.

> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 30ms on 55 files with 118 rules using 12 threads.

> typecheck
> npm run typecheck --workspaces


> typecheck
> tsc --noEmit


> typecheck
> tsc -b


> test
> npm run test --workspaces


> test
> vitest run


 RUN  v5.0.5 C:/Vinci 3/Q1/IA Dev/Projet/BINV3220-3bin1-groupe-16/backend

 ✓ tests/permissions.test.ts (6 tests) 13ms
 ✓ tests/nodeVersion.test.ts (11 tests) 16ms
 ✓ tests/db/migrations.test.ts (3 tests) 41ms
 ✓ tests/db/constraints.test.ts (21 tests) 260ms
 ✓ tests/db/seed.test.ts (20 tests) 263ms
 ✓ tests/health.test.ts (2 tests) 108ms
 ✓ tests/companies.test.ts (12 tests) 309ms
 ✓ tests/applications.test.ts (12 tests) 340ms
 ✓ tests/auth.test.ts (22 tests) 555ms
 ✓ tests/offers.test.ts (18 tests) 447ms

 Test Files  10 passed (10)
      Tests  127 passed (127)
   Start at  15:22:29
   Duration  2.08s (import 54%, tests 27%, transform 14%, setup 3%, worker 2%)


> test
> vitest run


 RUN  v5.0.5 C:/Vinci 3/Q1/IA Dev/Projet/BINV3220-3bin1-groupe-16/frontend

 ✓ tests/guards.test.ts (22 tests) 21ms
 ✓ tests/HomePage.test.tsx (2 tests) 406ms
   ✓ HomePage (2)
     ✓ accueille l'utilisateur et rappelle son profil et ses entreprises 356ms
 ✓ tests/NavBar.test.tsx (4 tests) 459ms
   ✓ NavBar (4)
     ✓ propose les offres à un administrateur 349ms
 ✓ tests/ApplicationsPage.test.tsx (1 test) 477ms
   ✓ ApplicationsPage (1)
     ✓ affiche les quatre statuts et ne permet de retirer que la candidature en cours 474ms
 ✓ tests/LoginPage.test.tsx (3 tests) 568ms
   ✓ LoginPage (3)
     ✓ regroupe les utilisateurs de démo par profil 426ms
 ✓ tests/ApplyForm.test.tsx (4 tests) 631ms
   ✓ ApplyForm (4)
     ✓ envoie le message facultatif et confirme la candidature 417ms
 ✓ tests/App.test.tsx (5 tests) 544ms
   ✓ App : session (5)
     ✓ affiche la connexion de démo sans session 392ms
 ✓ tests/CompaniesPage.test.tsx (6 tests) 810ms
   ✓ CompaniesPage (6)
     ✓ transmet la recherche saisie à l'API 336ms
 ✓ tests/OffersPage.test.tsx (8 tests) 1332ms
   ✓ OffersPage (8)
     ✓ affiche les offres avec leurs libellés français 461ms
     ✓ transmet le texte recherché tronqué et le combine à la période 339ms
     ✓ affiche un message adapté lorsqu'aucune offre ne correspond 362ms

 Test Files  9 passed (9)
      Tests  55 passed (55)
   Start at  15:22:32
   Duration  6.93s (environment 72%, setup 14%, tests 10%, transform 2%, import 2%)


> build
> npm run build --workspaces


> build
> tsc -p tsconfig.build.json && node scripts/copyMigrations.js


> build
> tsc -b && vite build

vite v8.3.4 building client environment for production...
✓ 62 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-DHtPPxz-.css    4.76 kB │ gzip:  1.49 kB
dist/assets/index-DQJhaKZs.js   277.51 kB │ gzip: 87.23 kB

✓ built in 273ms