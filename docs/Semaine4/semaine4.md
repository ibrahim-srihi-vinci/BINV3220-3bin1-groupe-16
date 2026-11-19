# Audit des tests

| Cas à vérifier | Test existant et assertion utile | Manque confirmé ou constat écarté |
| :--- | :--- | :--- |
| Validation du corps de POST /applications (offerId invalide, message non textuel, message > 1000 caractères) | `applications.test.ts` : aucun test n'envoie un corps invalide. Seuls les cas de base et les 409 existent. | Manque confirmé : j'ai ouvert le fichier et aucun cas 400 n'existe alors que le service le prévoit. |
| POST/DELETE par un non-étudiant (403) | `applications.test.ts` : seul GET par un administrateur est testé (403). | Manque confirmé pour POST et DELETE. GET est déjà couvert. |
| Parcours frontend de candidature (ApplyForm) | `ApplicationsPage.test.tsx:54` ne teste pas le formulaire. | Manque confirmé, mais hors backend. |
| États frontend de EF-33 (chargement, erreur, liste vide) | `ApplicationsPage.test.tsx:54` vérifie les 4 statuts. | Manque confirmé. |

Test ajouté : Dans le fichier ApplyForm.test.tsx, 4 tests ont été ajoutés. Résultat : 4/4 tests passent. Ils sont passés du premier coup, donc le code était déjà correct. Les tests couvrent maintenant tous les cas. 

----------------------

## TDD

### Voici un exemple de test vu en échec avant l'implémentation 

`FAIL  tests/OffersPage.test.tsx > OffersPage > affiche un message adapté lorsqu'aucune offre ne correspond
TestingLibraryElementError: Unable to find a label with the text of: Rechercher par titre`  
  
### et puis en réussite :  
  
´✓ affiche un message adapté lorsqu'aucune offre ne correspond 365ms´

  
Mon avis sur les tests proposés : Il y avait des tests qui donnaient pas éxactememnt le résulat attendu comme par exemple le test de période combinée qui était un faux positif (il passait alors que la recherche était pas encore implémentée). L'agent l'a ensuite corrigé et j'ai validé  
  
  
----------------------

## Recherche

### Cas essayés dans le navigateur :  

| Saisie | Résultat attendu | Résultat  |
|---|---|---|
| API | Offre contenant "API" | OK |
| Api | Offre contenant "Api" | OK (casse est ignorée) |
| api | Offre contenant "api" | OK (casse ignorée) |
| (vide) | toutes les offres visibles | OK |
| `zzzz` | liste vide + message | OK ( message : "Aucune offre ne correspond à la recherche.") |
| API  +  P2 | combinée | OK |


### Résultats ´npm run check´  :
  
npm run check

> check
> npm run lint && npm run typecheck && npm run test && npm run build


> lint
> npm run lint --workspaces


> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 26ms on 63 files with 85 rules using 12 threads.

> lint
> oxlint --deny-warnings

Found 0 warnings and 0 errors.
Finished in 28ms on 54 files with 118 rules using 12 threads.

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

 ✓ tests/nodeVersion.test.ts (11 tests) 13ms
 ✓ tests/permissions.test.ts (6 tests) 11ms
 ✓ tests/db/migrations.test.ts (3 tests) 33ms
 ✓ tests/db/seed.test.ts (20 tests) 236ms
 ✓ tests/db/constraints.test.ts (21 tests) 247ms
 ✓ tests/health.test.ts (2 tests) 97ms
 ✓ tests/companies.test.ts (12 tests) 301ms
 ✓ tests/applications.test.ts (12 tests) 324ms
 ✓ tests/offers.test.ts (18 tests) 378ms
 ✓ tests/auth.test.ts (22 tests) 508ms

 Test Files  10 passed (10)
      Tests  127 passed (127)
   Start at  17:07:47
   Duration  1.82s (import 52%, tests 26%, transform 16%, setup 4%, worker 2%)


> test
> vitest run


 RUN  v5.0.5 C:/Vinci 3/Q1/IA Dev/Projet/BINV3220-3bin1-groupe-16/frontend

 ✓ tests/guards.test.ts (22 tests) 12ms
 ✓ tests/HomePage.test.tsx (2 tests) 340ms
 ✓ tests/NavBar.test.tsx (4 tests) 363ms
 ✓ tests/ApplicationsPage.test.tsx (1 test) 376ms
   ✓ ApplicationsPage (1)
     ✓ affiche les quatre statuts et ne permet de retirer que la candidature en cours 372ms
 ✓ tests/LoginPage.test.tsx (3 tests) 425ms
   ✓ LoginPage (3)
     ✓ regroupe les utilisateurs de démo par profil 331ms
 ✓ tests/App.test.tsx (5 tests) 428ms
   ✓ App : session (5)
     ✓ affiche la connexion de démo sans session 313ms
 ✓ tests/CompaniesPage.test.tsx (6 tests) 747ms
   ✓ CompaniesPage (6)
     ✓ transmet la recherche saisie à l'API 352ms
 ✓ tests/OffersPage.test.tsx (8 tests) 1244ms
   ✓ OffersPage (8)
     ✓ affiche les offres avec leurs libellés français 370ms
     ✓ transmet le texte recherché tronqué et le combine à la période 334ms
     ✓ affiche un message adapté lorsqu'aucune offre ne correspond 362ms

 Test Files  8 passed (8)
      Tests  51 passed (51)
   Start at  17:07:49
   Duration  5.74s (environment 71%, setup 14%, tests 11%, transform 2%, import 2%)


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

✓ built in 276ms

### Problèmes restants 

Pas de problèmes particulier détécté avec la recherche (EF-30)