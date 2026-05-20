# Chatbot Portfolio - Project Instructions

## Project Overview

This project is a multilingual interactive portfolio (English, French, Spanish) where the Home page features a Chatbot Assistant. The chatbot is designed to answer questions about the developer's background, while other sections (About, Experience, Projects, Contact) provide traditional portfolio information.

### Tech Stack

- **Frontend:** React (TypeScript), Bun, Tailwind CSS.
- **Backend:** Python (3.11+), FastAPI, **uv** (for package management and virtualenvs).
- **Analytics:** Silent visitor tracking via FastAPI `BackgroundTasks`.
- **Contact:** Web3Forms integration.
- **Deployment:** Vercel (Monorepo setup).

### Architecture

- **Monorepo Structure:**
  - `/frontend`: React application.
  - `/backend`: FastAPI service.
  - `/docs`: Project documentation (CONTEXT.md, API.md, TODO.md).
- **Home (Chatbot):** Primary interaction point.
- **Sidebar:** Navigation, Bio, and Availability status.

## Building and Running

The project is currently in **Version 0.2.5: Architectural Refinement & Real-time Sync**.

### Major Milestones Completed

- **Version 0.0.1-2**: Infrastructure, i18n engine, and core UI shell (Header/Sidebar).
- **Version 0.0.3-4**: FastAPI backend with telemetry, SQLModel integration, and Vercel deployment readiness.
- **Version 0.0.5-8**: Web3Forms integration, mobile UX refinements, a localized trigger-based chatbot persona, and final polish/optimization.
- **Version 0.0.9-0.1.0**: AI persona expansion (Technical & HR), Markdown support, Blog module, and Motion/Visual polish.
- **Version 0.1.1**: Global Command Palette (Cmd+K), Haptic feedback, accessibility (a11y) improvements, and SEO optimization.
- **Version 0.1.2-3**: Platform & Analytics, Vercel services integration, and UX refinement.
- **Version 0.1.4**: Chatbot Intelligence & Voice Interaction (PTT, Fuzzy Matching).
- **Version 0.1.5**: Lightweight CMS & Content Management.
- **Version 0.1.6**: SEO, Performance & Social.
- **Version 0.1.7-8**: Security Hardening & Cloud Storage (Google Drive Integration).
- **Version 0.1.9**: Advanced Architecture (NLU Optimization, Lazy Loading).
- **Version 0.2.0**: System Hardening (Dependency Injection, Router Modularization).
- **Version 0.2.1**: Post-Audit Refinements (Asset cleanup, Dependency sync).
- **Version 0.2.2**: Stability & Final Polish (Sitemap, Rate-limiting, Validation).
- **Version 0.2.3**: Notifications & Connectivity (Telegram Bridge, Smart Escalation).
- **Version 0.2.4**: Advanced Observability (Real-time Tracking, Health Telemetry).
- **Version 0.2.5**: Architectural Refinement (SSE Chat, Task Queues, Modular UI).

## Building and Running

...

### Chat & Real-time

- **SSE Stream**: Live chat synchronization uses Server-Sent Events via `/api/v1/chat/stream/{session_id}`. Avoid polling.
- **Global State**: Use `ChatContext` for all chat-related state. Do not maintain local message history in page components.
- **Task Queues**: Use `background_task_queue` in `backend/middleware.py` for non-critical side effects like logging to keep the event loop responsive.

### Root-Level Orchestration

The project uses a monorepo structure with root-level scripts for ease of use:

#### Initial Setup

```bash
# Setup both frontend and backend
bun install
npm run setup:backend
```

#### Development

```bash
# Run frontend and backend in separate terminals
bun run dev:frontend
bun run dev:backend
```

#### Quality Control

```bash
# Linting and Type-checking
bun run lint

# Testing
bun run test

# Formatting
bun run format
```

## Development Conventions

### Semantic HTML & Styling

- **Strict Semantic Tags:** Use `<main>`, `<section>`, `<aside>`, `<nav>`, `<header>`, and `<footer>` instead of generic `<div>`s where possible.
- **Design Tokens:** CSS variables are defined in `frontend/src/styles/globals.css` and mapped in `tailwind.config.js`. Use semantic names (e.g., `--color-sidebar-bg`).
- **Theming:** Support system-level dark/light mode via the `.dark` class strategy.

### Internationalization (i18n)

- **Zero Static Text:** All UI strings must be stored in `frontend/lib/locales/` as typed TypeScript objects for EN, FR, and ES.
- **Access:** Components must import text via translation hooks/utilities (e.g., `t.home.welcomeMessage`).

### Data Strategy

- **Contract-First:** Implement typed mock objects in `frontend/lib/mocks.ts` before creating actual API calls.
- **Backend Telemetry:** Use `BackgroundTasks` for non-blocking visitor analytics (IP, User-Agent, Path).
- **Chat Logging:** All AI interactions and user feedback signals must be logged.

### Git & Workflow

- **Conventional Commits:** Follow the standard format.
- **Commit Body:** Must explain the "Why" and link to the relevant Version in `TODO.md`.
- **Scopes:** `[frontend]`, `[backend]`, `[monorepo]`, `[infra]`, `[i18n]`.

## Key Resources

- `docs/CONTEXT.md`: Detailed vision and design goals.
- `docs/TODO.md`: Roadmap and task tracking.
- `.ai-rules`: Strict coding standards and architectural requirements.
- `docs/API.md`: API specifications and data models.
