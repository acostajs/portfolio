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
