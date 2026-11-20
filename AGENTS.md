# Dockseal frontend — shared agent instructions

This file is the shared entry point for coding agents (Cursor, Codex, Claude Code, and others that read `AGENTS.md`). It is an operational index and a compatibility layer. The canonical technical rules remain in `.cursor/rules/*.mdc`. Those files are not rewritten here.

If this file and a `.mdc` disagree, follow the `.mdc` and say so. Do not edit `.cursor/rules/` as part of feature work.

Codex and Claude Code do not load `.cursor/rules/` automatically. The normative text below is therefore included here, with the same obligations, exceptions, and examples. Cursor does load `.cursor/rules/` in addition to this file.

## How each tool loads instructions

Confirmed behavior:

- **Cursor** loads every `.cursor/rules/*.mdc` with `alwaysApply: true` in every conversation. Per [Cursor Rules](https://cursor.com/docs/rules), when `alwaysApply` is true, `globs` and `description` are ignored and the rule is always included. Cursor also loads this root `AGENTS.md` for the whole workspace, and loads a root `CLAUDE.md` the same way it loads `AGENTS.md`. Cursor docs do not confirm that `@path` imports inside `CLAUDE.md` are expanded.
- **Codex** reads `AGENTS.md` before work. It does not read `.cursor/rules/`. The default combined limit is 32 KiB (`project_doc_max_bytes`); content past that limit is dropped. Nested `AGENTS.md` files closer to the working directory are concatenated after this file and appear later.
- **Claude Code** does not load `.cursor/rules/`. With the default Project instructions value `claude-md-or-agents-md`, a `CLAUDE.md` in the working directory or above it is read instead of `AGENTS.md`. Root `CLAUDE.md` imports this file with `@AGENTS.md` (see [Claude Code memory](https://code.claude.com/docs/en/memory)). Direct `AGENTS.md` loading requires Claude Code v2.1.277 or later and is skipped when `CLAUDE.md` or `CLAUDE.local.md` is present, unless Project instructions is `claude-md-and-agents-md`. An `AGENTS.md` already imported is not read twice.

Do not assume another agent reads a file unless that tool's own discovery loads it. When a more specific instruction file applies in that tool (nested `AGENTS.md`, a closer `.mdc`, a user or managed `CLAUDE.md`), follow that tool's precedence. This repository has no nested `AGENTS.md`.

## Which rules apply

All eleven rules have `alwaysApply: true`. In Cursor they are obligations in every session, not optional file-scoped hints. Agents that only have this file must follow every section below for the whole repository.

The `globs` below are the focus declared in each source file. They do not waive `alwaysApply`. Re-read the source file when the change touches those paths, because the `.mdc` stays canonical.

| Source | Declared globs |
| --- | --- |
| `.cursor/rules/frontend-architecture.mdc` | none |
| `.cursor/rules/frontend-security-language.mdc` | none |
| `.cursor/rules/frontend-structure.mdc` | `src/**/*` |
| `.cursor/rules/frontend-anti-patterns.mdc` | `src/**/*` |
| `.cursor/rules/frontend-typescript.mdc` | `src/**/*.{ts,tsx}` |
| `.cursor/rules/frontend-react.mdc` | `src/**/*.{tsx,ts}` |
| `.cursor/rules/frontend-routing.mdc` | `src/pages/**/*` |
| `.cursor/rules/frontend-forms.mdc` | `src/{pages,components,schemas}/**/*` |
| `.cursor/rules/frontend-state.mdc` | `src/stores/**/*` |
| `.cursor/rules/frontend-api-query.mdc` | `src/{api,queries,mutations,components,hooks,pages}/**/*` |
| `.cursor/rules/backend-api-contract.mdc` | `src/{api,queries,mutations,@types,env.ts,lib/axios.ts}/**/*` |

There are no rule subdirectories.

## What to read before a task

Technical development rules and business rules are different. Do not copy business docs into code comments or into this file.

- **Any implementation:** this file, then the `.mdc` files whose globs match the files you will touch. `.cursor/rules/frontend-architecture.mdc` overrides legacy code and any conflicting older frontend convention. Existing code is not an architecture reference: when touching legacy code, keep behavior and move the touched code toward the official architecture.
- **UI, components, pages:** `frontend-react.mdc`, `frontend-structure.mdc`, `frontend-security-language.mdc`. Routes: also `frontend-routing.mdc`.
- **Forms:** `frontend-forms.mdc` and `frontend-security-language.mdc` (validation and display text in pt-BR).
- **Client state:** `frontend-state.mdc`. Server state stays in TanStack Query (`frontend-api-query.mdc`).
- **`src/api`, `src/api/mocks`, `src/queries`, `src/mutations`, API types in `src/@types`, `src/env.ts`, `src/lib/axios.ts`:** read the live spec before creating or changing anything there:

```bash
curl -s http://localhost:8000/openapi.json
```

  Then follow `backend-api-contract.mdc` and `frontend-api-query.mdc`.
- **Product behavior that is not an HTTP contract:** read the relevant document in `docs/` before implementing or changing related behavior. Do not invent product rules from the technical rules, and do not treat `docs/` as the HTTP contract.

### Business documents (do not rewrite, move, rename, or delete)

- `docs/especifica_o_t_cnica_e_backlog_dockseal.md` — product specification and backlog.
- `docs/2026-06-13 0000 documentacao_dockseal.pdf` — 75-page product document. Its text was not extracted when these instructions were written, so it has not been compared with the markdown spec or with `.cursor/rules/`. Consult it when the task depends on product behavior.

### Precedence

1. For the HTTP contract (path, method, parameters, body, response schema, status codes): the live OpenAPI document is the source of truth. `../dockseal-api/docs/API.md` is the human guide (the rule file cites it as `../../../dockseal-api/docs/API.md` relative to `.cursor/rules/`). If the guide and the live spec disagree, follow the live spec and say so.
2. If `openapi.json` is unreachable, say so and use the shapes already written in `../dockseal-api/docs/API.md`. Do not add a request or MSW handler that is absent from both.
3. `frontend-architecture.mdc` overrides legacy code and older frontend conventions.
4. Product behavior that is not an HTTP contract belongs in `docs/`, not in `.cursor/rules`.
5. When business docs and technical rules conflict, do not resolve the conflict by assumption. Record it. For the HTTP contract, the precedence in items 1–2 still applies.

### Recorded conflicts (unresolved)

`docs/especifica_o_t_cnica_e_backlog_dockseal.md` describes a Django backend, an `/api/v1` prefix, JSON login with `email` and `password`, a `refresh_token`, and a numeric `user.id`. That diverges from `backend-api-contract.mdc` (FastAPI sibling `dockseal-api`, `POST /auth/login` as `application/x-www-form-urlencoded` with `username` and `password`, response `access_token` and `token_type`, UUID ids) and from the stack in `frontend-architecture.mdc`. The same markdown also cites Recharts or Chart.js, which are not in the official stack.

`tsconfig.app.json` does not set `strict`, while `frontend-typescript.mdc` requires `strict: true`. `erasableSyntaxOnly: true` is present. Do not "fix" that by assumption during unrelated work; the rule remains the requirement when TypeScript configuration is in scope.

`package.json` script `test` is written as `vistest run --coverage`. That string is recorded as it exists. Do not treat it as a renamed command and do not add scripts to correct it unless the task is to change scripts (the architecture rule forbids new `package.json` scripts for local run or CI).

## Commands and tools already defined

- Package manager: **pnpm only**.
- Linter: **Biome**. Existing script: `pnpm lint` (`biome check .`).
- Existing scripts in `package.json` (do not add new ones for running the app locally or for CI/pipelines): `dev`, `dev:test`, `test`, `test:e2e`, `test:e2e:ui`, `build`, `build:test`, `preview`, `preview:test`, `lint`. These scripts are not an extra required gate beyond the checklist below.
- Backend origin: `VITE_API_URL` in `src/env.ts`, `.env.local`, `.env.example`. Local FastAPI default in the rules: `http://localhost:8000`. Never hardcode the host or port. Call the backend through `api` from `src/lib/axios.ts`.
- OpenAPI JSON: `http://localhost:8000/openapi.json`. Swagger UI: `http://localhost:8000/docs`.
- Tests live in the root `test` folder, never inside `src`. Unit tests are `*.spec.ts`. End-to-end tests are `*.e2e-spec.ts`. Stack: Vitest, Playwright, Testing Library, and MSW.

Official `src` folders, including ones that may not exist until the first file is added: `components`, `components/ui`, `pages`, `api`, `api/mocks`, `queries`, `mutations`, `hooks`, `utils`, `stores`, `schemas`, `constants`, `lib`, `assets`, and `@types`. `src/env.ts` stays inside `src`. Present today: `src/pages` (`_auth`, `_app`), `src/components`, `src/components/ui`, `src/api`, `src/api/mocks`, `src/mutations`, `src/hooks`, `src/stores`, `src/schemas`, `src/@types`, `src/lib`, `src/env.ts`, and `test/`.

## Architecture

Source: `.cursor/rules/frontend-architecture.mdc` (`alwaysApply: true`, no globs). This document overrides legacy code and any conflicting older frontend convention.

- Official stack: React, Vite, TypeScript, TanStack Router, TanStack Query, TanStack Devtools, React Hook Form, Zod, Zustand, Axios, Tailwind CSS v4, shadcn/ui, sonner, GSAP, Motion, Lenis, next-themes, and Biome.
- Tests use Vitest, Playwright, Testing Library, and MSW. Unit tests are `*.spec.ts`. End-to-end tests are `*.e2e-spec.ts`. Tests live in the root `test` folder, never inside `src`.
- Every request, mock, and API type follows the OpenAPI contract (`backend-api-contract.mdc`).
- Global constants use `ALWAYS_UPPERCASE`; enum-like objects use the `E` prefix and `as const`.
- Mocks live in `src/api/mocks`, with `index.ts` wiring the MSW worker, one handler per request, on the same routes as the real API when it exists.
- Pages in `src/pages` stay thin; UI lives in `src/components` (kebab-case, one component per file, named exports).
- New files use kebab-case; exported components stay PascalCase.
- Named exports only. Do not introduce `export default` in app code.
- One responsibility per file. Do not mix components, requests, mocks, schemas, constants, hooks, business rules, and utilities in the same file.
- Boy Scout rule: when editing a section, fix nearby small architecture inconsistencies without opening large unrelated refactors.

### Required checklist

Before finishing an implementation, confirm:

- No duplicated JSX that should be a component.
- No oversized component or one with multiple responsibilities.
- No API logic, Axios, mocks, large schemas, or complex business rules inside a component.
- No remote state duplicated in Zustand.
- No internal navigation via local state or `window.location`.
- No request grouped with another request in the same file.
- No hook, utility, or file accumulating responsibilities.
- No hardcoded global constant outside `src/constants`.
- No `export default`, `export enum`, or `any`.
- New server state uses the query-key factory in its query hook file, not a global `*_QUERY_KEYS` object.
- The touched code fully follows this architecture.

## Structure

Source: `.cursor/rules/frontend-structure.mdc` (`alwaysApply: true`, globs `src/**/*`).

- Tests live in the root `test` folder, never inside `src`. Unit tests are `*.spec.ts`. End-to-end tests are `*.e2e-spec.ts`.
- `src/pages` contains TanStack Router file routes only; keep route files thin.
- `src/components` contains reusable application components with UI logic only.
- `src/components/ui` contains only shadcn/ui primitives. Do not place business components there and avoid modifying these files.
- `src/api` contains one request per file. `src/api/mocks` is reserved for MSW mocks.
- `src/queries` contains query groups and query hooks (`updateCache`, `invalidate`).
- `src/mutations` contains write hooks. Do not add new domain TanStack Query/mutation modules under `src/hooks` when `src/queries` / `src/mutations` exist.
- `src/lib` contains library configuration only, for example `axios.ts`, `query-client.ts`, `i18n.ts`.
- `src/utils` contains reusable utilities organized by domain, for example `currency.ts`, `date.ts`, `number.ts`, `string.ts`, `array.ts`, `object.ts`. Avoid `helpers.ts`, `misc.ts`, `common.ts` and `generic.ts`.
- `cn()` stays in `src/lib/utils.ts`, which is the shadcn alias. Do not add another `src/utils.ts`.
- `src/hooks` contains reusable hooks organized by domain. Do not create context-free generic hooks.
- `src/schemas` contains large Zod schemas named like `login.schema.ts` and `user-form.schema.ts`.
- `src/constants` contains global constants in `ALWAYS_UPPERCASE` and enum-like `E*` objects with `as const`.
- `src/@types` contains types reused by multiple contexts.
- New app files must use kebab-case. Exported components use PascalCase. Use named exports only.

Valid:

```ts
// src/hooks/use-auth-session.ts
export function useAuthSession() {}

// src/constants/upload.ts
export const MAX_UPLOAD_SIZE = 10
```

Invalid:

```ts
// src/pages/_app/dashboard.tsx
export default function Dashboard() {}
const data = await fetch('/shipments')

// src/utils/helpers.ts
export function formatAnything() {}
```

## Anti-patterns

Source: `.cursor/rules/frontend-anti-patterns.mdc` (`alwaysApply: true`, globs `src/**/*`). Do not introduce:

- TypeScript `enum`; use `E*` `as const` objects instead.
- `any`.
- Interfaces without `I` prefix or type aliases without `T` prefix.
- `export default` in app code, except generated files or tool-required config files.
- Direct `fetch` or `axios` in pages, components or hooks.
- Multiple API requests in the same `src/api` file.
- Mocks inside React components. Use `src/api/mocks` for MSW.
- Server state without TanStack Query.
- Zustand as a remote cache.
- React Context API for global state without a documented technical justification.
- Internal navigation via `window.location`, `setView`, `activeTab` or other state-based view switching.
- JSX duplication that a reusable component would remove.
- Large schemas, global constants, business rules or reusable utilities inside components.
- Dead code left in `src`.
- English UI strings.
- Utility files named `helpers.ts`, `misc.ts`, `common.ts` or `generic.ts`.
- New `*Resource` objects grouping multiple HTTP methods.
- New global `*_QUERY_KEYS` objects. Each query hook file owns its query-key factory.
- `invalidateQueries` / `setQueryData` inside pages or feature components.
- Duplicating server lists in Zustand when a query cache exists.

When touching legacy code that violates these rules, improve the affected area without changing functional behavior or opening unrelated large refactors.

## TypeScript

Source: `.cursor/rules/frontend-typescript.mdc` (`alwaysApply: true`, globs `src/**/*.{ts,tsx}`).

- Use `strict: true` and `erasableSyntaxOnly: true`.
- Every interface must use the `I` prefix, for example `IUser`, `ILoginForm`, `IButtonProps`.
- Every type alias must use the `T` prefix, for example `TUserRole`, `TLoginInput`.
- Enum-like objects must use the `E` prefix, for example `EUserRole`.
- Use `interface` for objects and props.
- Use `type` for unions, intersections, aliases, `z.infer`, `Awaited`, `ReturnType` and primitive aliases.
- Never use TypeScript `enum`; use `as const` objects plus a derived union type.
- Never use `any`. Use `unknown` only when necessary, preferably at external boundaries, and narrow it before use.
- Reusable cross-context types belong in `src/@types/*.d.ts`. Always `export` them. Use the `I` prefix for interfaces even when the name already starts with I (`IInfo`) and the `T` prefix for types (`TTable`).
- Component-exclusive props interfaces may stay colocated only when they are not reused. They still use the `I` prefix.

Valid:

```ts
export const EUserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

export type TUserRole =
  | typeof EUserRole.ADMIN
  | typeof EUserRole.USER

export interface IUser {
  id: string
  name: string
}
```

Invalid:

```ts
export enum ResourceStatus { Active = 'active' }
interface User {}
type UserRole = 'ADMIN' | 'USER'
function parse(data: any) {}
```

## React

Source: `.cursor/rules/frontend-react.mdc` (`alwaysApply: true`, globs `src/**/*.{tsx,ts}`).

- Functional components and hooks only; respect Rules of Hooks.
- UI event handlers use `handle` prefix (`handleSubmit`, `handleClose`).
- Components are presentation-focused. Do not put requests, Axios, mocks, large schemas, constants or complex business rules inside components.
- Split components that exceed about 250-300 lines, have multiple responsibilities, or mix rendering with business rules and data transformation.
- Extract components, hooks, utils and schemas when a file starts accumulating responsibilities.
- Do not duplicate JSX when a reusable component can solve the repetition.
- Avoid derived state when values can be computed from props/query data.
- Use `@/` imports.

Valid:

```tsx
function handleOpenDetails() {
  openDetails()
}
```

Invalid:

```tsx
function openChat() {
  axios.get('/chat')
}
```

## Routing

Source: `.cursor/rules/frontend-routing.mdc` (`alwaysApply: true`, globs `src/pages/**/*`).

- Use TanStack Router exclusively.
- Use `createFileRoute` in `src/pages`; never edit generated route trees manually.
- `layout.tsx` files represent route wrappers.
- Folders starting with `_` represent contextual route groups, for example `_auth` and `_app`.
- Navigate with `Link`, `Navigate`, `useNavigate`; no `window.location` for internal routes.
- Do not use `setView`, `activeTab` or state-based view switching for product navigation.
- Route files should stay thin and delegate UI, data access and business logic to components, hooks and API request files.

Valid:

```ts
export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInPage,
})

navigate({ to: '/dashboard' })
```

Invalid:

```ts
setView('home')
window.location.href = '/dashboard'
```

## Forms

Source: `.cursor/rules/frontend-forms.mdc` (`alwaysApply: true`, globs `src/{pages,components,schemas}/**/*`).

- All forms use `react-hook-form`, `zod`, and `zodResolver`.
- Large schemas live in `src/schemas` and use names like `login.schema.ts` or `user-form.schema.ts`.
- Small component-exclusive schemas may stay close to the component only when they are not reusable and do not make the component large.
- Submit handlers receive a prefixed inferred type, for example `TLoginInput = z.infer<typeof loginSchema>`.
- Validation messages and all display text must be in pt-BR.
- Wizards may persist data in Zustand between steps; validate each step with Zod.

Valid:

```ts
type TSignInFormValues = z.infer<typeof signInSchema>

const form = useForm<TSignInFormValues>({
  resolver: zodResolver(signInSchema),
})

function handleSignInSubmit(data: TSignInFormValues) {}
```

Invalid:

```ts
const [email, setEmail] = useState('')
if (!email.includes('@')) return

function onSubmit(data: { email: string }) {}
```

## Client state (Zustand)

Source: `.cursor/rules/frontend-state.mdc` (`alwaysApply: true`, globs `src/stores/**/*`).

- Remote/server state belongs to TanStack Query.
- Global client state belongs to Zustand.
- Allowed Zustand state: authentication session, persisted multi-step wizards and global user preferences.
- Do not duplicate remote API data in Zustand.
- Do not store page-local UI state or transient modal flags in Zustand when component state is sufficient.
- Do not use React Context API for global state without a documented technical justification.

Valid:

```ts
// src/stores/auth/sign-up.ts
export const useSignUpStore = create(persist(...))
```

Invalid:

```ts
// Caching remote users from API in Zustand
set({ users: await getUsers() })
```

## Security and language

Source: `.cursor/rules/frontend-security-language.mdc` (`alwaysApply: true`, no globs).

- All UI text (labels, errors, toasts, placeholders) in **pt-BR**.
- Validate and sanitize external input; no raw HTML injection (`dangerouslySetInnerHTML` without sanitization).
- Do not put sensitive data in query params or persist beyond need (GDPR/LGPD).
- Clear persisted auth and client state on sign-out.
- Keep secrets and credentials out of source code and client-side persistence.

Valid: `setError('Senha obrigatória')`. Invalid: `setError('Password is required')`.

## API and TanStack Query

Source: `.cursor/rules/frontend-api-query.mdc` (`alwaysApply: true`, globs `src/{api,queries,mutations,components,hooks,pages}/**/*`). Request paths, params, bodies, content types, timeouts, and response types must follow `backend-api-contract.mdc`.

- All backend communication follows this flow: Component → query/mutation hook in `src/queries` or `src/mutations` → `src/api/<domain>/<verb>-<resource>.ts` → `src/lib/axios.ts` → Backend.
- Each file in `src/api` represents exactly one request, for example `get-shipments.ts`, `get-shipment.ts`, `create-shipment.ts`, `update-alert.ts`.
- Do not group multiple requests in a resource/client object file. When touching legacy grouped requests, migrate only the affected request when practical.
- Pages, components, and hooks must not call `fetch`, call `axios`, or build API URLs inline.
- Axios configuration belongs in `src/lib/axios.ts`.
- Server state must use TanStack Query: `useQuery` for reads and `useMutation` for writes.
- Each query hook file owns a query-key factory for its resource. Compose keys from a root tuple. Do not add `*QueryGroup`, `toTanStackKey`, or a global `*_QUERY_KEYS` object.
- Query hooks accept filters when the request has them. They export `updateCache` and `invalidate` for that hook's key.
- Prefer `setQueryData` / `setQueriesData` when the cache already exists. Call `invalidateQueries` on that resource's key prefix only when a patch is impossible.
- Query results must use descriptive aliases, for example `data: shipments`, `isLoading: isLoadingShipments`, `error: shipmentsError`.
- Mutations live in `src/mutations`. They must use `mutateAsync` aliased with the `Fn` suffix, for example `mutateAsync: createShipmentFn`.
- Mutation hooks are typed with `UseMutationOptions` minus `mutationFn`. Default `onSuccess` and `onError` run first; custom `onSuccess` / `onError` run after. Do not spread options on top of those handlers.
- Zustand must never cache API responses or duplicate remote state.
- `invalidateQueries` / `setQueryData` do not belong inside pages or feature components (see anti-patterns).

Valid:

```ts
export const shipmentsQueryKeys = {
  all: ['shipments'] as const,
  list: (filters: IGetShipmentsFilters) =>
    [...shipmentsQueryKeys.all, 'list', filters] as const,
  detail: (shipmentId: string) =>
    [...shipmentsQueryKeys.all, 'detail', shipmentId] as const,
}

const {
  data: shipments,
  isLoading: isLoadingShipments,
  error: shipmentsError,
} = useShipments(filters)

const { mutateAsync: createShipmentFn } = useCreateShipment({
  onSuccess: (shipment) => {
    navigate({ to: '/shipments/$shipmentId', params: { shipmentId: shipment.id } })
  },
})
```

Invalid:

```ts
useEffect(() => {
  axios.get('/shipments')
}, [])

export const shipmentsResource = {
  getShipments,
  createShipment,
}

queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEYS.list(filters) })
```

## Backend API contract

Source: `.cursor/rules/backend-api-contract.mdc` (`alwaysApply: true`, globs `src/{api,queries,mutations,@types,env.ts,lib/axios.ts}/**/*`).

- The backend is the FastAPI app in the sibling repository `dockseal-api`. Locally it runs at `http://localhost:8000` and the frontend reads that origin from `VITE_API_URL` (`src/env.ts`, `.env.local`, `.env.example`). Never hardcode the host or port. Always call the backend through `api` from `src/lib/axios.ts`.
- Re-check these wire constraints against the live spec before coding:
  - IDs are UUID strings.
  - Dates travel as ISO 8601 UTC with `Z`. Format them only for display.
  - Lists are raw JSON arrays. Existing collection filters use `limit` and `offset`, not `page`.
  - Error bodies use `detail`.
  - `POST /auth/login` is `application/x-www-form-urlencoded` with `username` (the e-mail) and `password`. The response is `access_token` and `token_type`. Load the user with `GET /auth/me`.
  - Authenticated requests send `Authorization: Bearer <access_token>`.
  - File uploads and `POST /analysis` use `multipart/form-data`.
  - `POST /analysis` and `POST /shipments/{id}/validate` are slow. Set the request timeout to at least 90 seconds and show a loading state.
- Types in `src/@types` mirror OpenAPI `components.schemas`: `Shipment` becomes `IShipment`; a request body schema becomes `ICreateShipmentInput` or the equivalent `I*Input`. Keep names, optionality, and formats identical to the spec.
- MSW handlers mirror the real routes and response shapes.
- Do not invent endpoints, fields, pagination envelopes, or status codes.

Valid:

```ts
// src/api/shipments/get-shipments.ts — GET /shipments?limit&offset
export async function getShipments(filters: IGetShipmentsFilters) {
  const response = await api.get<IShipment[]>('/shipments', { params: filters })

  return response.data
}
```

Invalid:

```ts
axios.get('http://localhost:3000/api/v1/shipments/')
```
