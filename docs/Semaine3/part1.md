Inventaire : 

| | Guide (feedforward) : consigne donnée avant l'action | Capteur (feedback) |
| --- | --- | --- |
| **Inférentiel (interprété par une IA)** | Les instructions Copilot : copilot-instructions.md<br><br>Impose à l’agent l’architecture, les conventions d’imports, la séparation contrôleurs/services/repositories, les règles d’autorisation et les commandes de validation. En gros ce fichier fixe un cadre pour l'agent. <br>Exemple : les services ne doivent pas recevoir Request ou Response. <br> Ce fichier est décrit (lu et appliqué par l'IA) <br><br><br>  - La documentation technique et métier : cdc_gesta_developpement.md, architecture.md, README.md. Ces fichiers sont aussi utilisés par l'IA pour comprendre le contexte, les exigences, ... Exemple: le cahier des charges dit qu'un étudiant peut consulter les offres publiées. Ces fichiers sont décrits. | Revue du code par l’IA: outils de lecture et recherche (view, rg) et conversations documentées dans conversation-1.md et conversation-2.md<br><br>L’agent repère les incohérences et formule un diagnostic.<br>Exemple : l’analyse a identifié qu’un avertissement Lint react(set-state-in-effect) faisait échouer npm run check.<br><br>Ce sont principalement des fichiers éxécuté pendant la séance. |
| **Computationnel (règles ou calculs exécutables)** | Scripts et configuration d’exécution:  package.json, backend/package.json, frontend/package.json, settings.json<br><br>Ces fichiers prescrivent les versions, les commandes, les permissions d’outils et étapes attendues.<br>Exemples : Node.js doit être en version >=22.14.0 ; npm run check doit exécuter lint, typecheck, tests et builds.<br><br>Ces fichiers sont des fichiers configurés et décrit.<br><br>Gabarit de pull request:  pull_request_template.md. Ce fichier impose de documenter les pull request en décrivant les fonctionnalités, changements, ... Exemple :<!-- Quelle fonctionnalité du cahier des charges ? Indiquez l'exigence (EF-xx, RG-xx) ou l'issue (#…). --> Ce fichier est un fichier partiellement éxécuté et vérifié. | Linter: backend/.oxlintrc.json et frontend/.oxlintrc.json<br><br>Ces fichiers vérifient les règles TypeScript, React, les hooks et l’absence d’avertissements.<br>Exemple : le fait de mettre un "any" dans le code peut faire échouer le contrôle. Ce sont des fichiers éxécutés et vérifiés <br><br>Les Tests automatisés: Vitest, Supertest et Testing Library dans backend/tests/ et frontend/tests/<br><br>Ils vérifient le comportement API et interface.<br>Exemples : GET /health doit retourner { status: "ok" } ; l’interface affiche les quatre statuts de candidature dans ApplicationsPage.test.tsx. Ce sont des fichiers éxécutés et vérifiés<br><br>Contraintes SQLite: 001_initial.sql et constraints.test.ts<br>Ils refusent les données invalides.<br>Exemples : une offre au statut Publiée est rejetée car le code attendu est PUBLISHED ; une date de fin antérieure à la date de début provoque une erreur CHECK.<br><br>Sécurité et règles métier exécutables: authorize.ts, permissions.ts<br><br>Ils contrôlent l’accès côté serveur.<br>Exemple : un contact uniquement promoteur ou signataire reçoit 403 FORBIDDEN pour la liste des offres.Ce sont des fichiers éxécutés et vérifiés par les tests avec la base de données  |


------------

Couverture des exigences :

| Exigence | Cas à vérifier | Test existant (fichier et nom) | Assertions utiles | Couverture |
| --- | --- | --- | --- | --- |
| EF-32 | Candidater à une offre publiée  | `applications.test.ts` : « crée une candidature avec un message trimé » | `status` 201 ; corps contient `offerId` et `message` trimé | **Couvert**  |
| EF-32 | Refuser une candidature à une offre non publiée | `applications.test.ts` : « refuse une candidature à une offre non publiée » | `status` 409 ; code `APPLICATION_NOT_ALLOWED` pour `OFFER.CLIENT_PORTAL` | **Couvert**  |
| EF-32 | Retirer une candidature en cours | `applications.test.ts` : « retire une candidature en cours puis autorise une nouvelle candidature » | DELETE 204 ; nouveau POST 201 | **Couvert** |
| EF-32 | Refuser le retrait d'une candidature déjà traitée | `applications.test.ts` : « refuse le retrait d'une candidature traitée » | DELETE sur `MATEUSZ_CLOUD_MIGRATION` : 409 ; code `APPLICATION_NOT_WITHDRAWABLE` | **Couvert**  |
| EF-32 | Un étudiant ne peut pas retirer la candidature d'un autre | `applications.test.ts` : « empêche un étudiant de retirer la candidature d'un autre » | DELETE sur `INES_FLEET_APP` par Lucas : 404 ; code `NOT_FOUND` | **Couvert** |
| EF-33 | Un étudiant ne voit que ses candidatures | `applications.test.ts` : « retourne uniquement les candidatures de l'étudiant connecté » | résultat limité à `LUCAS_FLEET_APP` et au statut `IN_PROGRESS` | **Couvert**  |
| EF-33 | Statuts « En cours », « Retenue », « Non retenue », « Retirée » visibles | `applications.test.ts` : « retourne le statut %s » | GET pour Lucas, Mateusz, Léa et Inès ; vérification des quatre codes de statut | **Couvert**  |

Cas non vérifiable avec les tests API actuels : aucun parmi les cas listés ci-dessus. Les tests vérifient les codes de statut métier retournés par l'API ; la traduction visuelle en libellés français est vérifiée séparément par le test frontend `ApplicationsPage.test.tsx`.

-------------

Modifications et vérification :

Ajout des tests API dans applications.test.ts :
    - offre non publiée ;
    - doublon actif ;
    - code d’erreur métier ;
    - retrait par un autre étudiant ;
    - retrait d’une candidature traitée ;
    - les quatre statuts EF-33.

Commandes lancées : npm run check --> OK

Vérifications manuelle: 
    - Retrait de candidature OK
    - Impossibke de postuler à une offre non active OK
    - Repostuler à une offre OK
    - Ecrire un message avec la candidature OK
