# Project Roadmap (TODO.md)

## ✅ Version 0.2.3: Notifications & Connectivity

- (All tasks completed)

## ✅ Version 0.2.4: Advanced Observability & Intelligent Context

- (All tasks completed)

## 🎯 Current Version: Version 0.2.5: Architectural Refinement & Real-time Sync

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
- [x] **Codebase Hygiene & Audit Resolution**:
  - [x] **Dead Code Cleanup (Frontend)**: Remove `fetchCMS` and `updateCMS` from `frontend/lib/api.ts`.
  - [x] **Middleware Optimization (Backend)**: Remove the redundant `if hasattr(response, "background")` block in `backend/middleware.py`.
  - [x] **Dependency Hardening**: Prune `google-auth-oauthlib` and explicit `requests` from `backend/pyproject.toml`.
  - [x] **Test Cleanup**: Remove the boilerplate math test from `frontend/src/App.test.ts`.
  - [x] **Data Decoupling Strategy**: Refactor the hardcoded dictionaries in `backend/responses/*.py` into separate JSON or YAML fixtures.
