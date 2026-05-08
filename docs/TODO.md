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

## Phase 6: UI Refinement, Audit & Groq AI Integration

- [x] **Audit & Optimization**
  - [x] Codebase Audit: Perform a deep dive for semantic HTML improvements and Tailwind CSS consistency.
  - [x] Tree Shaking: Identify and remove unused components, dead types, and redundant Tailwind utility classes.
  - [x] Security & Stability: Scan for logic bugs and potential security risks in both frontend and backend handlers.

- [x] **UI/UX Improvements**
  - [x] Sticky Navigation: Fix the Header position to ensure it remains accessible when the chat or page content extends.
  - [x] Chat Layout: Pin the chatbot input to the bottom of the viewport so it stays visible regardless of message history length.
  - [x] Typography Refresh: Update global CSS variables to implement new font stacks:
    - Sans: Space Grotesk, system fonts.
    - Mono: ui-monospace, SFMono-Regular, and standard fallbacks.

- [ ] **AI Backend & Persona (Trigger-Based Logic)**
  - [x] Restore trigger-based response modules in `backend/responses/`.

Integrating those tips directly into the tasks makes the list much more "dev-ready." It defines the **how** alongside the **what**, which helps prevent technical debt.

Here is the updated **Phase 7** list with the senior engineering insights baked in:

---

## ## Phase 7: Mobile UX Refinement, Messaging Logic & Persona Tuning

### UI / UX (Mobile & Layout)

- [x] **Sticky Layout (Flexbox Strategy):** Implement a `h-screen` flex-col wrapper. Set the Header and Input as fixed-height components and apply `flex-1 overflow-y-auto` to the chat container to ensure the input is always anchored and visible.
- [x] **Header Typography Fix:** Use media queries or fluid typography (e.g., `text-[clamp(...)]`) for the "Portfolio Assistant..." text to prevent breaking on narrow viewports.
- [x] **Input Placeholder Optimization:** Shorten the mobile placeholder text or use a CSS selector to reduce `font-size` specifically for the `::placeholder` on small screens.

### Backend & Integration

- [x] **Backend Initialization Shortcut:** Implement a root-level script (e.g., in `package.json`) to automate the backend environment setup and start the server using `uv`.
- [x] **Database Streamlining:** Modify the POST controller to exclude assistant strings from the `save` logic. **Note:** Ensure the React/Vue state still holds these responses in memory so the user's current session remains coherent.
- [x] **Visit Notifications:** Removed due to Web3Forms server-side restrictions on the free plan. Silent telemetry remains active for analytics.
- [x] **Web3Forms Debugging:** Audit the `form` submission handler. Check the `fetch` response codes and verify that the `access_key` is correctly loaded from environment variables.

### Bot Logic & Localization

- [x] **Persona Update:** Refactor the System Message to enforce a first-person perspective. Update the greeting and fallback phrases to be casual and warm.
- [x] **NLU Refinement:** Review current keyword mapping; implement better regex or fuzzy matching to increase trigger accuracy.
- [x] **Multilingual Expansion (EN/FR/ES):** Scale the content JSON/Object to include full translations for English, French, and Spanish, ensuring the "warm tone" carries across all three cultures.
