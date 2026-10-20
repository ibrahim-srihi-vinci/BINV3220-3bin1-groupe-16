# Project Guidelines

## Build, Test, and Lint

Use Node.js 22.14 or newer (Node 24 LTS is recommended) and run commands from the repository root.

```bash
npm ci
npm run setup
npm run dev
```

- `npm run dev` starts the Express API on `http://localhost:3000` and the Vite frontend on `http://localhost:5173`.
- `npm run check` runs lint, TypeScript checks, all tests, and both builds. Run it before substantial commits.
- Individual workspace commands are available with `npm run <script> -w backend` or `npm run <script> -w frontend`.
- Run one backend test with `npm test -w backend -- tests/offers.test.ts`; run one frontend test with `npm test -w frontend -- tests/OffersPage.test.tsx`.
- Filter to one Vitest test with `npm test -w backend -- tests/offers.test.ts -t "test name"` (or use the equivalent frontend workspace command).
- Useful database commands are `npm run db:init` and `npm run db:reset`; stop the dev server before resetting.

The root scripts are `dev`, `setup`, `db:init`, `db:reset`, `lint`, `typecheck`, `test`, `build`, and `check`. Both workspaces use Oxlint with warnings denied, TypeScript, and Vitest.

## Architecture

This is an npm-workspaces monorepo for Gesta, a stage-management application:

- `backend/` is an Express 5 API backed by SQLite via `better-sqlite3`. `main.ts` loads configuration, initializes the database, and starts the server; `app.ts` assembles routes and middleware.
- Backend request flow is `controllers -> services -> repositories -> SQLite`, with mappers converting database rows to domain objects and API DTOs. Controllers validate HTTP input, services contain business rules, repositories contain SQL, and `services/permissions.ts` centralizes access rules.
- Authentication middleware reconstructs the current user, roles, and companies from the database on every protected request. Authorization is enforced server-side with named permission predicates. Errors should be raised as `HttpError` and converted by the central error handler to `{ "error": { "code", "message" } }`.
- SQL migrations live in `backend/src/db/migrations/` and seed data in `backend/src/db/seed/`. The database is local and created under `backend/data/`; tests use an in-memory SQLite database.
- `frontend/` is a React 19 + TypeScript + Vite application. Its flow is `pages -> hooks -> services/utils -> models`, with reusable UI in `components/`. `App.tsx` owns the single `useAuth` session and passes the token and logout behavior down to pages.
- In development, frontend requests use `/api/...`; Vite rewrites and proxies them to the backend without the `/api` prefix. The backend routes themselves do not include `/api`.

See [`docs/architecture.md`](../docs/architecture.md), [`backend/API.md`](../backend/API.md), and [`README.md`](../README.md) for the detailed route and layer references.

## Conventions

- Backend relative imports include the `.ts` extension because TypeScript rewrites them to `.js` during compilation.
- The `Authorization` header contains the session token directly; do not add a `Bearer` prefix.
- Demo authentication is for local development only. It is enabled with `DEMO_AUTH_ENABLED=true` and must not run with `NODE_ENV=production`; it is deliberately not real authentication.
- Keep authorization in the backend even when the frontend hides navigation or controls. Services must filter data by the current user's profile.
- Add schema changes as a new ordered migration such as `002_description.sql`; never edit an already-applied migration.
- Store status values in English database/API codes (for example `PUBLISHED`) and translate them to French labels in the frontend.
- Keep backend layers independent: services do not receive Express `Request` or `Response`, repositories return database-row data, and controllers own HTTP validation and response status.
- Frontend services validate API JSON with the existing type guards/utilities. Hooks expose display-ready state and handle 401 responses through the session callback; do not call `useAuth` from individual pages or hooks.
- Follow the existing feature path when adding behavior: backend route/controller, service and permission rule, repository/model/mapper, API tests; then frontend service, hook/page/components, and UI tests as applicable.
- Update `backend/API.md` and the relevant `backend/http/*.http` examples when changing the API. Keep the pull request checklist in `.github/pull_request_template.md` aligned with the change.
