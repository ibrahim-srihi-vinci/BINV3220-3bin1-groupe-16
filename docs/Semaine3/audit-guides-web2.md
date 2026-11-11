# Audit des guides à la lumière de Web 2

## 1. Périmètre et méthode

Cet audit examine les consignes qui peuvent influencer le travail de l’agent ou des
contributeurs :

- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md), guide destiné
  à Copilot ;
- [`README.md`](../../README.md), [`docs/architecture.md`](../architecture.md) et
  [`backend/API.md`](../../backend/API.md), documentation normative du projet ;
- [`.github/pull_request_template.md`](../../.github/pull_request_template.md), checklist
  appliquée aux contributions.

Les attentes sont comparées aux pages du cours
[`e-vinci.github.io/js2`](https://e-vinci.github.io/js2/) sur les API REST, les services,
React, `fetch`, le routage, l’authentification, l’autorisation et CORS.

**Légende :** **Oui** = couvert ; **Partielle** = présent mais incomplet ;
**Non** = absent ; **Non vérifiable** = aucune source Web 2 précise retrouvée.

## 2. Matrice d’audit

| # | Attente Web 2 et source | Guide du projet | Verdict | Recommandation |
|---:|---|---|---|---|
| 1 | Séparer client et serveur, avec une API REST et du JSON. [Source](https://e-vinci.github.io/js2/part1/express-api/) | [`README.md`](../../README.md#L7-L9) sépare React/Vite et Node/Express ; [`backend/API.md`](../../backend/API.md#L1-L5) documente le JSON. | **Oui** | Documenter chaque nouvelle route : méthode, entrée et réponses. |
| 2 | Organiser le backend avec des services. [Source](https://e-vinci.github.io/js2/part1/refactoring/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L29-L30) impose `controllers → services → repositories → SQLite` ; [`docs/architecture.md`](../architecture.md#L24-L55) précise les rôles. | **Oui** | Conserver ce parcours pour toute nouvelle fonctionnalité. |
| 3 | Découper l’IHM en composants et séparer l’état des appels API. [Source](https://e-vinci.github.io/js2/part2/components/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L33-L35) et [`docs/architecture.md`](../architecture.md#L79-L102) décrivent pages, hooks, services et composants. | **Oui** | Éviter les appels API directs dans les composants si un service existe. |
| 4 | Utiliser un routage adapté à une SPA. [Source](https://e-vinci.github.io/js2/part2/routing/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L33-L35) confie les routes à `App.tsx` ; [`README.md`](../../README.md#L81-L82) mentionne React Router. | **Oui** | Aucun ajout prioritaire. |
| 5 | Valider les paramètres et le corps des requêtes. [Source](https://e-vinci.github.io/js2/part1/express-api/) | [`docs/architecture.md`](../architecture.md#L41-L47) attribue la validation aux contrôleurs ; [`backend/API.md`](../../backend/API.md#L20-L34) décrit les erreurs. | **Partielle** | Exiger la validation de la présence, du type, de la longueur et des valeurs autorisées, avec un test pour chaque erreur. |
| 6 | Utiliser `fetch` de façon asynchrone, vérifier `response.ok` et traiter les erreurs. [Source](https://e-vinci.github.io/js2/part2/fetch/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L45-L47) impose les type guards et la gestion des 401 ; [`docs/architecture.md`](../architecture.md#L89-L96) répartit ces rôles. | **Partielle** | Documenter les états d’interface : chargement, succès, erreur et absence de données. |
| 7 | Distinguer authentification et autorisation et contrôler les droits dans l’API. [Source](https://e-vinci.github.io/js2/part3/auths-api/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L30) impose les middlewares ; les lignes 42 à 46 interdisent de compter uniquement sur l’interface ; [`backend/API.md`](../../backend/API.md#L8-L34) documente 401/403. | **Oui** | Tester chaque route protégée avec un accès anonyme, refusé et autorisé. |
| 8 | Utiliser un token stateless contenant seulement les informations nécessaires. [Source](https://e-vinci.github.io/js2/part3/auths-api/) | [`README.md`](../../README.md#L115-L126) indique que le token ne contient que l’identité ; [`copilot-instructions.md`](../../.github/copilot-instructions.md#L40) fixe l’en-tête. | **Partielle** | Préciser l’expiration, la révocation et l’interdiction d’étendre le mode démo à la production. |
| 9 | Gérer le stockage de session et la déconnexion côté frontend. [Source](https://e-vinci.github.io/js2/part3/auths-hmi/) | [`docs/architecture.md`](../architecture.md#L79-L96) décrit `useAuth` et le callback 401 ; [`copilot-instructions.md`](../../.github/copilot-instructions.md#L46) centralise la session. | **Partielle** | Documenter le stockage choisi, ses risques et la suppression du token au logout. |
| 10 | Configurer explicitement CORS ou un proxy. [Source](https://e-vinci.github.io/js2/part3/cors/) | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L11-L12) et [`README.md`](../../README.md#L42-L43) décrivent le proxy Vite, mais pas les origines de production. | **Partielle** | Décrire les origines autorisées en production et interdire CORS ouvert par défaut. |
| 11 | Vérifier l’accessibilité de l’IHM. | Aucune consigne d’accessibilité n’a été retrouvée dans les guides ni dans les pages Web 2 consultées. | **Non vérifiable** | Ne pas attribuer cette exigence à Web 2 sans source précise. |
| 12 | Tester le comportement et les erreurs. | [`copilot-instructions.md`](../../.github/copilot-instructions.md#L15-L22) et [`pull_request_template.md`](../../.github/pull_request_template.md#L9-L16) imposent tests, build, erreurs HTTP et navigateur. | **Partielle** | Présenter cette checklist comme une convention du projet, pas comme une exigence Web 2 prouvée. |

## 3. Lecture rapide des résultats

### Ce qui correspond

- L’architecture client/serveur et l’organisation par services correspondent clairement au
  cours Web 2.
- Le découpage React, le routage SPA et la séparation pages/hooks/services sont bien couverts.
- L’authentification, l’autorisation côté serveur et les réponses 401/403 sont encadrées.

### Ce qui est partiel

- La validation des entrées est mentionnée, mais les règles minimales à vérifier ne sont pas
  énumérées.
- Les appels `fetch` et la session frontend sont encadrés, mais les états d’erreur,
  l’expiration et le stockage du token sont peu précisés.
- Le proxy de développement est documenté, mais la politique CORS de production ne l’est pas.

### Ce qui ne peut pas être affirmé

L’accessibilité ne doit pas être présentée comme une exigence de Web 2 dans cet audit :
aucune page précise du cours consulté ne permet de l’établir.

## 4. Recommandations prioritaires

1. Ajouter une règle détaillée de validation des entrées et les tests d’erreur associés.
2. Préciser les états de chargement, succès, erreur et absence de données dans l’IHM.
3. Documenter le stockage, l’expiration et la suppression du token.
4. Documenter les origines CORS autorisées en production.
5. Conserver la checklist de tests comme convention du projet, sans la qualifier de règle Web 2.

Ce rapport formule des recommandations uniquement ; aucun guide existant n’a été modifié.
