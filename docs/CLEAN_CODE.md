# Project Standards: CLEAN_CODE.md

## 1. Type Safety & Integrity

- **No `any` Policy**: The use of `any` or `as any` is strictly prohibited. All data structures must be explicitly typed.
- **Unknown over Any**: If a type cannot be determined at compile time, use `unknown` combined with a type guard or Zod schema validation.
- **Type over interface**: Use `type` for public APIs, component props, and database models to support better IDE performance and declaration merging.
- **Explicit Returns**: All functions, API routes, and React components must define explicit return types to ensure predictable data flow.

## 2. Modularity & Architecture

- **Single Responsibility Principle (SRP)**: Each component or function should do exactly one thing. If a file exceeds 200 lines (especially React components), it must be refactored into smaller sub-components.
- **Centralized Types**: Shared models (e.g., `Project`, `Experience`) must be centralized in `types/cms.ts`. Avoid local re-definitions to prevent redundancy.
- **DRY (Don't Repeat Yourself)**: Abstract recurring logic into custom hooks (frontend) or utility decorators (backend).

## 3. Readability & Maintainability

- **Self-Documenting Code**: Use descriptive, semantic naming (e.g., `isUserAuthenticated` instead of `auth`). Avoid cryptic abbreviations.
- **Deprecation Watch**: Do not use legacy patterns. Specifically, ensure all backend datetime logic uses Python 3.12+ timezone-aware standards.
- **Code Flow**: Prioritize "Early Returns" to reduce nested logic and improve readability.

## 4. Internationalization (i18n)

- **Zero Static Text**: No hardcoded UI strings are permitted in `.tsx` files. All text must be retrieved via the i18n engine from `lib/locales/`.
- **Semantic Keys**: Use contextual keys (e.g., `t.home.welcomeMessage`) rather than general keys like `t.general.text1`.

## 5. Security & Quality Gate

- **Secret Management**: Never hardcode credentials. Use `.env` and ensure the **Security Agent** validates secret isolation.
- **A11y Compliance**: Use semantic HTML (`<main>`, `<nav>`, `<button>`) and ensure all interactive elements have high-visibility focus states.
- **Reviewer Approval**: No code is "Done" until the **Reviewer Agent** confirms a successful audit:
  - **Frontend**: `bun run lint`, `bun tsc --noEmit` (Typecheck), `bun test`, and `prettier --check .`.
  - **Backend**: `uv run ruff check .`, `uv run ruff format --check .`, and `uv run pytest`.
