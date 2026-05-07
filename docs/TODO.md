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

## Phase 2: Layout, Navigation & i18n

- [x] **Infrastructure: Assets & Metadata**
  - [x] Configure `favicon.ico` and `site.webmanifest` in the HTML head.
  - [x] Move and link `public/avatar.jpeg` for the Sidebar profile and Header logo.
- [x] **Core Components: The Shell**
  - [x] Build **Header**: Include Sidebar toggle, Theme toggle, and Language toggle (EN/FR/ES).
  - [x] Build **Sidebar (<aside>)**:
    - [x] Profile: Name, Title (Full-Stack Developer), Location (Montréal).
    - [x] Links: Home, About, Experience, Projects, Contact.
    - [x] Status: "Open to full-time opportunities".
  - [x] Build **Mobile Overlay**: Sidebar should slide over content on small screens.
- [x] **i18n & Theming Engine**
  - [x] Implement System-first Theme detection (Default: Dark).
  - [x] Implement Browser-first Language detection (Default: EN).
  - [x] Map all UI strings to `frontend/lib/locales/` (Zero Static Text Rule).
- [x] **Content & Routing**
  - [x] Setup routing where Main content changes but Header/Sidebar persist.
  - [x] Create **Home View**: Interactive chatbot shell with welcome message.
  - [x] **DUMMY DATA**: Populate `frontend/lib/mocks.ts` with your specific tech stack (TypeScript, React, Bun, FastAPI) and past experience.

## Phase 3: Backend Implementation

- [x] Setup FastAPI `BackgroundTasks` for silent visitor tracking.
- [x] Create database schema (Visitor Analytics & Chat History).
- [x] Build Chatbot logic (Mock with randomized multilingual responses).
- [x] **DUMMY DATA:** Implement mock API response to simulate chatbot interaction.
- [x] Correct Python version to 3.12.
- [x] Setup GitHub CI workflows for frontend and backend.

## Phase 4: Deployment Readiness (Vercel focus)

- [x] Create `vercel.json` at root for monorepo routing.
- [x] Configure Environment Variables in Vercel (Web3Forms, Backend URL).
- [x] Optimize Bun build script for Vercel.
- [x] Set up production-ready CORS policy in FastAPI.

## Phase 5: Contact & Cleanup

- [x] Connect Contact page to Web3Forms using the public key.
- [x] Final audit for semantic HTML and Tailwind consistency.
