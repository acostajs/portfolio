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

The project is currently in **Phase 8: Final Polish & Optimization**.

### Major Milestones Completed

- **Phase 1-2**: Infrastructure, i18n engine, and core UI shell (Header/Sidebar).
- **Phase 3-4**: FastAPI backend with telemetry, SQLModel integration, and Vercel deployment readiness.
- **Phase 5-7**: Web3Forms integration, mobile UX refinements, and a localized trigger-based chatbot persona.

### TODO: Establish Build/Run Scripts

As the infrastructure is still being set up, the following commands are anticipated:

#### Frontend (Planned)

```bash
cd frontend
bun install
bun run dev
```

#### Backend (Planned)

Using **uv** for fast package management:

```bash
# Initialize backend environment (Recommended)
npm run setup:backend

# Or manually:
cd backend
uv venv
source .venv/bin/activate
uv sync
uv run uvicorn main:app --reload
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
- **Commit Body:** Must explain the "Why" and link to the relevant Phase in `TODO.md`.
- **Scopes:** `[frontend]`, `[backend]`, `[monorepo]`, `[infra]`, `[i18n]`.

## Key Resources

- `docs/CONTEXT.md`: Detailed vision and design goals.
- `docs/TODO.md`: Roadmap and task tracking.
- `.ai-rules`: Strict coding standards and architectural requirements.
- `docs/API.md`: API specifications and data models.
