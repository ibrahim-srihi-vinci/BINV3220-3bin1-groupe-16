Nos choix lors de la planification : 

1) Nouvelle candidature après retrait

Une candidature retirée doit-elle empêcher de recandidater à la même offre, ou l’étudiant peut-il soumettre une nouvelle candidature ?
Réponse : Autoriser une nouvelle candidature. 

2) Quelle validation appliquer au message de candidature ?
Réponse : Facultatif, espaces périphériques supprimés, longueur maximum de 1000 caractères

3) Pour les offres et candidatures étudiantes, faut-il imposer l’année académique courante comme le prévoit EF-30/EF-72, ou conserver le comportement de la liste actuelle ? 
Réponse : Année courante uniquement 


Plan obtenu: 

CDC consulté : EF-32/EF-33, RG-02/RG-03/RG-04 et modèle applications vérifiés.
Plan en 3 étapes : candidater, consulter ses candidatures, retirer une candidature.
Intégration prévue dans les couches backend existantes et la liste des offres frontend, avec documentation et tests ciblés.
Décisions retenues : réinscription autorisée après retrait, message facultatif trimé limité à 1000 caractères, année courante uniquement.
Hors périmètre conservé : EF-30/EF-31 détaillés, EF-34, sélection administrateur et création du stage.

Feedback pendant la génération du code :
 
"Ne t'occupes pas du point EF-34" car pas encore demandé même si c'est normalement nécessaire pour correctement implémenter la fonction "retirer candidature"

Plan définitif : 

Plan mis à jour pour exclure explicitement EF-34 : aucun endpoint, écran ou règle de sélection administrateur ne sera ajouté.
Le périmètre reste limité aux trois étapes étudiant : candidater, consulter ses candidatures et retirer une candidature.
Les décisions confirmées restent : réinscription après retrait, message trimé limité à 1000 caractères et année courante.


------------------

Résultats : 

- candidature à une offre publiée, avec et sans message ;  			    OK
- présence de la candidature et de son statut après rechargement ;		OK
- retrait d’une candidature encore en cours ;					        OK
- impossibilité de retirer une candidature déjà traitée ;			    OK
- séparation des candidatures de deux étudiants différents.			    OK
- annulation d'une candidature avant l'envoie 					        OK
- message limité à 1000 caractères 						                OK
- deux candidatures à la même offre retirée l'une après l'autre sont 
affichées dans "mes candidatures"						                OK


Vérifiez aussi les refus : un autre rôle ne peut pas candidater et une offre non publiée n’accepte
pas de candidature. Les contrôles doivent exister côté serveur. Pour un cas inaccessible dans
l’interface, demandez à Copilot comment le vérifier par l’API ou un test ciblé.

------------------

Modifications : 

Fichiers ajoutés :

Backend: 

tests/application.test.ts, 
http/apllication.http

Frontend:

src/components/ApplicationTable.tsx, 
src/comonents/ApplyForm.tsx, 
hooks/useApplication.tsx, 
models/application.ts
pages/ApplicationPage.tsx
service/application.service.ts
test/AppliactionPageTest.tsx, 


Fichiers modifiés : 

Backend :

applications.controller.ts
applications.service.ts
applications.repository.ts
002_application_active_unique.sql
applications.test.ts

Frontend :

ApplicationsPage.tsx
ApplicationTable.tsx
ApplyForm.tsx
ApplicationsPage.test.tsx
Documentation :

API.md
applications.http

Décision pendant la lecture du plan : 
Retirer la feature EF-34 car pas mentionnée dans les tâches de la semaine 


------------------

Validation fonctionnelle :

Connecté avec l'user "Aminata Diallo"
Dans l'onglet "Offres"
Candidater pour l'offre "Assistant conversationnel interne"
Dans l'onglet "Mes candidatures" 
Présence de la candidature

Ensuite retrait de la candidature "Assistant conversationnel interne"
Dans l'onglet "Offres"
Candidater pour l'offre "Assistant conversationnel interne"
Dans l'onglet "Mes candidatures" 
Présence de la candidature
Ensuite retrait une deuxième fois de la candidature "Assistant conversationnel interne"

Dans l'onglet "Offres"
Candidater pour l'offre "API REST de facturation" sans appuyer sur envoyer
Dans l'onglet "Mes candidatures", l'offre n'est pas présente.

Dans l'onglet "Offres"
Candidater pour l'offre "API REST de facturation" avec un message dépassant les 1000 caractères --> impossible, message bloqué à 1000 caractères  mais candidature envoyée
Dans l'onglet "Mes candidatures", l'offre est présente 

Dans l'onglet "Offres"
Uniquement les offres publiées sont disponible à la candidature. 


------------------

Qualité : 

Points vérifiés : 
- Bonne utilisation des statuts
- Ajout de l'année en cours

Problèmes repérés et simplification de code : 

Pas de gros problème repérés dans le code, avant les tests et pas non plus de simplifications avant le test. 

------------------

Tests et commandes 

Fichiers de tests ajoutés : 

Backend: 

tests/application.test.ts, 
http/apllication.http

Frontend: 

test/AppliactionPageTest.tsx


Commandes lancées pour le bon déroulement des tests 

npm test
npm run check


Résultats des tests: 

RUN  v5.0.5 C:/BINV3220-1_IA-developpeurs/Semaine5-9_projet/Projet/BINV3220-3bin1-groupe-16/frontend

 ✓ tests/ApplicationsPage.test.tsx (1 test) 325ms
   ✓ ApplicationsPage (1)
     ✓ affiche les quatre statuts et ne permet de retirer que la candidature en cours 322ms
 ✓ tests/LoginPage.test.tsx (3 tests) 383ms
 ✓ tests/CompaniesPage.test.tsx (6 tests) 680ms
   ✓ CompaniesPage (6)
     ✓ transmet la recherche saisie à l'API 343ms
 ✓ tests/guards.test.ts (22 tests) 14ms
 ✓ tests/HomePage.test.tsx (2 tests) 295ms
 ✓ tests/App.test.tsx (5 tests) 428ms
 ✓ tests/NavBar.test.tsx (4 tests) 278ms
 ✓ tests/OffersPage.test.tsx (5 tests) 427ms

 Test Files  8 passed (8)
      Tests  48 passed (48)
   Start at  15:12:33
   Duration  6.83s (environment 78%, setup 14%, tests 6%, import 1%, transform 1%)


Comportement couvert par un test : 

Un des test permet de tester si le site affiche les quatre statuts et ne permet de retirer que la candidature en cours.