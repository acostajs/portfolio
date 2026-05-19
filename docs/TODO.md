# Project Roadmap (TODO.md)

## 🎯 Current Version: Notifications & Connectivity (0.2.3)

- (All tasks completed)

## 🎯 Current Version: Advanced Observability & Intelligent Context (0.2.4)

- [x] **Infrastructure & CI/CD**:
  - [x] Implement Real-time Visitor Tracking middleware.
  - [x] Create detailed Health Check (`/health/details`) endpoint.
- [x] **Chatbot & Intelligence**:
  - [x] Add `session_metadata` JSON persistence to `LiveChatSession`.
  - [x] Implement Proactive NLU Hints endpoint (`/chat/hints`).
- [x] **Frontend & DX**:
  - [x] Build Admin Analytics Dashboard view (Activity & Health tabs).
  - [x] Implement Portfolio CLI "Command Center" (Hidden: `Ctrl + \``).

## 🎯 Upcoming Version: Architectural Refinement & Real-time Sync (0.2.5)

- [ ] **Real-time Engine Upgrade**:
  - [ ] Transition Live Chat from 3s Polling to **Server-Sent Events (SSE)**.
  - [ ] Implement a robust `ChatContext` to persist live sessions across navigation.
- [ ] **Backend Hardening**:
  - [ ] Implement an In-Memory Task Queue for `VisitorTrackingMiddleware` to optimize the event loop.
  - [ ] Sanitize CORS configuration to use environment-driven origins only.
- [ ] **Frontend Refactoring**:
  - [ ] Decompose `Home.tsx` into modular components (`ChatWindow`, `ChatInputContainer`).
  - [ ] Encapsulate live chat logic into a custom `useLiveChat` hook.
  - [ ] Enhance API layer type safety to eliminate `unknown` assertions in suspense cache.
- [ ] **Codebase Hygiene & Audit Resolution**:
  - [ ] **Dead Code Cleanup (Frontend)**: Remove `fetchCMS` and `updateCMS` from `frontend/lib/api.ts`. These functions were intended for unified Admin API access but were bypassed by individual admin components using direct `fetch()` calls.
  - [ ] **Middleware Optimization (Backend)**: Remove the redundant `if hasattr(response, "background")` block in `backend/middleware.py`. This block currently contains only comments and a `pass` statement, adding unnecessary visual noise to the tracking logic.
  - [ ] **Dependency Hardening**: Prune `google-auth-oauthlib` and explicit `requests` from `backend/pyproject.toml`.
    - `google-auth-oauthlib` is unused as the Drive integration uses a pure refresh token flow.
    - `requests` is an implicit dependency of the Google libraries and doesn't need explicit top-level tracking.
  - [ ] **Test Cleanup**: Remove the boilerplate math test from `frontend/src/App.test.ts` to prepare for meaningful UI component testing.
  - [ ] **Data Decoupling Strategy**: Refactor the hardcoded dictionaries in `backend/responses/*.py` into separate JSON or YAML fixtures. This improves maintainability by separating static persona data from application logic and simplifies the `seed.py` orchestration.
