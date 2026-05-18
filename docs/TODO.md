# Project Roadmap (TODO.md)

## 🎯 Current Version: Stability & Final Polish (0.2.2)

- [x] **Infrastructure**:
  - [x] **Sitemap Automation**: Ensure the sitemap is correctly generated for all dynamic blog posts.
  - [x] **Security Hardening**: Implement rate-limiting on admin endpoints to prevent brute-force attacks.
- [x] **Backend Architecture & NLU**:
  - [x] **Request Validation**: Implement dedicated `Create`/`Update` Pydantic models for CMS endpoints to separate API schemas from DB models.
  - [x] **NLU Priority**: Add an explicit `priority` field to `ChatTriggerResponse` for manual override control.
- [x] **Frontend & DX**:
  - [x] **Image Optimization**: Audit all remaining static assets for size and format. Verified: all assets < 100KB.
  - [x] **Type Parity**: Synchronize TypeScript interfaces strictly with backend models to ensure perfect contract safety.
  - [x] **UX Audit**: Enforce Zero Static Text and WCAG AA accessibility standards.

## 🚀 Next Version: Notifications & Connectivity (0.3.0)

- [ ] **Telegram Chat Bridge**:
  - [ ] **Real-time Chat**: Implement a bridge using Telegram Bot API to enable live chatting between portfolio visitors and the developer.
  - [ ] **Secure Config**: Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to the Pydantic `Settings` model.
  - [ ] **Bidirectional Flow**: Research and implement a mechanism (Webhooks or Polling) to relay Telegram replies back to the frontend chat UI.
  - [ ] **Async Delivery**: Use `BackgroundTasks` for non-blocking message relaying.
