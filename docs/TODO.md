# TODO.md

## Phase 1: Infrastructure & i18n

- [x] **Monorepo Initialization**
  - [x] Initialize git and root `package.json`.
  - [x] Setup `.gitignore` (Root, Frontend, Backend specifics).
  - [x] Create `frontend/` (React + Bun + Tailwind).
  - [x] Create `backend/` (FastAPI + Python + Virtualenv).
- [x] **Enforcement & Automation (Gemini CLI Prep)**
  - [x] Install `husky` and `lint-staged` at the root.
  - [x] Configure `commit-msg` hook to enforce Conventional Commits.
  - [x] Configure `pre-commit` hook to run `prettier` and `eslint` on staged files.
  - [x] Create `.clisettings.json` (or equivalent) to point Gemini CLI to `.ai-rules`.
- [x] **Styling & Core Config**
  - [x] Define CSS Design Tokens in `frontend/src/styles/globals.css`.
  - [x] Setup `frontend/lib/locales/` with base TS objects for EN, FR, ES.
- [x] **Vercel Orchestration**
  - [x] Create `vercel.json` with rewrites for `/api/*` to the Python backend.
- [x] Setup `frontend/lib/locales/` with EN, FR, and ES objects.
- [x] Implement ThemeProvider (System/Light/Dark).
- [x] **DUMMY DATA:** Populate translation objects with placeholder strings for all views.

## Phase 2: Layout & Navigation

- [ ] Create Semantic Sidebar (Bio, Nav, Availability Status).
- [ ] Implement Fixed Header and Main Content routing (Home as default).
- [ ] Build "Home" Chatbot Interface shell.
- [ ] **DUMMY DATA:** Create typed mock objects for "Projects" and "Experience" in `frontend/lib/mocks.ts`.

## Phase 3: Backend Implementation

- [ ] Setup FastAPI `BackgroundTasks` for silent visitor tracking.
- [ ] Create database schema (Visitor Analytics & Chat History).
- [ ] Build Chatbot logic (LLM integration).
- [ ] **DUMMY DATA:** Implement mock API response to simulate chatbot interaction.

## Phase 4: Deployment Readiness (Vercel focus)

- [ ] Create `vercel.json` at root for monorepo routing.
- [ ] Configure Environment Variables in Vercel (Web3Forms, Backend URL).
- [ ] Optimize Bun build script for Vercel.
- [ ] Set up production-ready CORS policy in FastAPI.

## Phase 5: Contact & Cleanup

- [ ] Connect Contact page to Web3Forms using the public key.
- [ ] Final audit for semantic HTML and Tailwind consistency.
