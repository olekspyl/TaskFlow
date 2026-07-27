# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev              # start Vite dev server
npm run build             # type-check (vue-tsc --build) then build
npm run type-check        # vue-tsc --build only
npm run lint               # runs lint:oxlint then lint:eslint (both --fix)
npm run lint:oxlint        # oxlint . --fix
npm run lint:eslint        # eslint . --fix --cache
npm run format             # oxfmt src/
npm run test                # vitest (watch mode)
npm run preview             # preview production build
npm run deploy               # build-only + gh-pages -d dist
```

Run a single test file: `npx vitest run path/to/file.test.ts`
Run tests matching a name: `npx vitest run -t "test name"`

Test environment is `jsdom` with `globals: true` (configured directly in `vite.config.ts` via `defineConfig` from `vitest/config`, not a separate vitest config file).

Formatting/linting is oxc-based (`oxlint`, `oxfmt`), layered under a full ESLint + Stylistic config (`eslint.config.mjs`) — both run in `npm run lint`. oxfmt config: no semicolons, single quotes.

## Architecture

Vue 3 + TypeScript + Vite SPA, deployed to GitHub Pages under base path `/TaskFlow/` (see `vite.config.ts`). State via Pinia, i18n via vue-i18n, styling via Tailwind, icons via `unplugin-icons` (auto-imported with `Icon` prefix), components auto-imported via `unplugin-vue-components` (see generated `components.d.ts`).

### Feature-based structure (`src/`)

- **`app/`** — application shell: `main.ts` bootstrap, `router/` (routes, navigation guard, route meta), `layout/` (Auth/Default/Master layouts), `auth.ts` (the authenticated axios client instance).
- **`features/`** — self-contained feature modules (`auth`, `listsManager`, `locale`, `theme`, `users`). Each exposes its public surface through an `index.ts` barrel (typically Vue components + select composables), and internally follows `components/`, `composables/`, `api/`, `utils/`, `types/` subfolders as needed. `listsManager` bundles two sub-domains: `lists/` and `tasks/`.
- **`pages/`** — route-level view components, one folder per route (`Analytics`, `Auth`, `Dashboard`, `Lists`, `NotFound`, `Profile`, `Users`), composed from `features/`.
- **`shared/`** — cross-feature code: `api/` (shared API composables), `stores/` (Pinia, e.g. `useUserStore`), `ui/` (`common/`, `sidebar/`, `table/` design-system components), `composables/`, `constants/`, `types/`, `utils/`.
- **`widgets/`** — larger composed UI blocks used across pages (e.g. `Dashboard.vue`, `DefaultHeader.vue`).
- **`i18n/`** — vue-i18n setup; locale JSON files in `i18n/locales/` (`uk` is the default locale, `en` is the fallback; `pl` exists but is currently commented out of the loaded messages in `i18n/index.ts`).

### Path alias

`@/*` maps to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Types convention

Feature/shared type modules are re-exported as namespaces from barrel files, e.g. `src/shared/types/index.ts`:
```ts
export * as routerTypes from './router'
export * as PermsTypes from './permissions'
export * as selectTypes from './select'
```
Consumers import and use them as `PermsTypes.PermissionRow`, `routerTypes.RouteNames`, etc., rather than importing individual type names directly. Follow this pattern for new type modules.

### Data fetching

All HTTP/data-fetching goes through `@ametie/vue-muza-use` (an internal composable library wrapping axios), not raw `fetch`/`axios` calls in components:
- `useApi`, `useApiGet`, `useApiPost`, `useApiPut`, `useApiPatch`, `useApiDelete` — reactive request composables returning `{ data, loading, error, execute, ... }`.
- Feature `api/` modules (e.g. `src/features/users/api/usersApi.ts`) wrap these into named functions like `fetchUserById`, `getPermissionsList`, and are consumed from feature composables (e.g. `usePermissions.ts`), not directly from components.
- Options support `immediate`, `onSuccess`/`onError`, and `cache: { id, staleTime, swr }` for request caching/dedup; global cache defaults (`swr`, `staleTime`, `freshFor`) and the global error handler (toast on error) are set once in `app/main.ts` via `createApi(...)`.
- The authenticated axios instance is created in `app/auth.ts` via `createApiClient` with `withAuth: true` and a refresh-token flow (`tokenManager`); on refresh failure it clears the stored token and redirects to the login route.

### Routing & auth guard

`app/router/router.ts` registers a single global `beforeEach` guard (`routesGuard` in `app/router/guard.ts`) that: initializes auth (`userStore.initAuth`), redirects unauthenticated/unauthorized users, checks per-route permission access via `userStore.canRead`, and sets up the page header (title/visibility) from route `meta.header`. Route definitions with their `meta` live in `app/router/routerModules.ts`; route names are the `routerTypes.RouteNames` enum.

### Permissions model

Users have a `role` (`admin` | `user`) plus a flat `permissions: string[]` array of `"action:resource"` strings (e.g. `read:list`). `useUserStore.canRead(permission)` is the primitive access check (admins always pass). The users feature (`features/users/utils/permissions*.ts`) transforms the flat permission list into grouped rows (`PermissionRow`, keyed by module/action) for the permissions-management UI — this transform layer is the non-obvious part when touching permissions code, since the UI never talks in raw permission strings directly.

### TypeScript strictness

`tsconfig.app.json` extends `@vue/tsconfig` which enables `noUncheckedIndexedAccess` — indexed/destructured array access is typed as possibly `undefined`. Provide defaults (e.g. destructuring defaults) rather than non-null assertions when narrowing these.
