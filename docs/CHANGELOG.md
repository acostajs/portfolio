# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.4] - 2026-05-18

### Added

- **Alembic Migrations**: Transitioned from manual SQLAlchemy `inspect` logic to structured Alembic migrations for robust schema management.
- **Visitor Analytics Middleware**: Implemented asynchronous tracking for IP, User-Agent, and navigation paths using `BackgroundTasks`.
- **System Health Monitoring**: Added detailed `/health/details` endpoint providing telemetry on database latency and environment health.
- **Admin Analytics Overhaul**: Introduced new "Activity" and "Health" tabs in the Admin dashboard for real-time system monitoring.
- **Portfolio CLI**: Added a hidden "Command Center" (`Ctrl + \``) for keyboard-driven navigation and diagnostics.
- **Contextual Chat Hints**: Implemented proactive, page-aware chatbot suggestions based on navigation history.

### Changed

- **Structured Session Metadata**: Migrated from flat dictionary metadata to a Pydantic-backed `SessionMetadata` model for consistent tracking of visitor behavior.
- **Frontend Quality Control**: Improved type safety and resolved TypeScript path errors in locale and CLI components.
- **Backend Hardening**: Optimized DDL operations and connection strings for production Postgres compatibility.

## [0.2.3] - 2026-05-18

### Added

- **Telegram Chat Bridge**: Real-time bidirectional communication between visitors and the developer via the Telegram Bot API.
- **Smart Escalation**: Intelligent UI flow that proactively offers a "Talk to developer" button when the AI provides a fallback response.
- **Live Chat UI**: Seamless transition mode with dynamic placeholders, an inline exit button, and suppressed AI suggestions for a clean typing experience.
- **Webhook Security**: Implemented Secret Token verification for the Telegram Webhook to prevent unauthorized message injection.
- **Session Management**: Native `crypto.randomUUID()` based session tracking for consistent visitor identification across reloads.
- **Database Migrations**: Manual migration logic to safely update existing tables (e.g., adding `session_id` to `chatmessage`).

### Changed

- **UX Refinement**: Optimized the chat interface to hide irrelevant AI suggestions during active live sessions.
- **Robust Sync**: Refactored frontend synchronization to use ID-based message merging, eliminating duplication and handling initial state mismatches.
- **Testing Expansion**: Added a comprehensive test suite for the Telegram bridge, covering lifecycle, security, and real-time syncing.

## [0.2.2] - 2026-05-18

### Added

- **Security Hardening**: Implemented rate-limiting on all admin endpoints using `slowapi` to prevent brute-force attacks.
- **Sitemap Automation**: Dynamic XML sitemap generation endpoint (`/sitemap.xml`) aggregating static routes and dynamic blog posts.
- **Enhanced Testing**: Dedicated rate-limiting verification and expanded validation tests for schemas and partial updates.
- Production health check endpoint (`/health`).
- **NLU Priority**: Explicit `priority` field in `ChatTriggerResponse` for manual override control.

### Changed

- **Request Validation Refactor**: Separated API schemas (`Create`/`Update`) from database models for all CMS entities, improving security and architectural separation.
- **Image Optimization Audit**: Verified all static assets are under 100KB for optimal performance.
- **Quality Assurance**: Enforced project-wide formatting standards using Ruff and performed a comprehensive security audit.
- Neo-brutalism UI Overhaul: Transitioned from Glassmorphism to a high-contrast system with hard shadows and thick borders.
- Color Palette Migration: Adopted Cobalt Blue (#1055C9) as the primary accent color project-wide.
- **Type Parity**: Synchronized TypeScript interfaces (`cms.ts`) strictly with backend SQLModel schemas.
- **Refactored Naming**: Renamed `ChatbotResponse` to `ChatTriggerResponse` in frontend for architectural alignment.
- Updated documentation to reflect Version 0.2.2 as current.

## [0.2.1] - 2026-05-13

### Added

- `TagInput` component for modern chip/tag management in Admin CMS.
- Re-implemented `Typewriter` component for dynamic chatbot feel.
- Toast notifications for Admin logout and other UI actions.

### Fixed

- Admin Analytics: Missing translation strings.
- Chatbot Welcome: Consolidated into a single engagement message.

### Removed

- Unused assets: `hero.png`, `Typewriter.tsx` (old version).
- `google-cloud-storage` backend dependency (now using standard Google API client).
- `useSpeech.ts` and associated UI logic for legacy speech recognition.

### Performance

- Refactored `MeshBackground.tsx` to use CSS animations.
- Lazy loading for `@codesandbox/sandpack-react` in Blog.

## [0.2.0] - 2026-05-11

### Added

- Modular router structure in `backend/routers/admin/`.
- Enhanced feedback tracking linked to specific assistant responses.

### Changed

- Refactored backend to use Dependency Injection (`Depends(get_session)`).
- Updated Admin Analytics dashboard with feedback trends.

## [0.1.9] - 2026-05-11

### Added

- Two-Tier Matching System for chatbot triggers (Exact match + RapidFuzz).
- Frontend lazy loading for `BotMessage`, `MarkdownRenderer`, and `SyntaxHighlighter`.
- `SharedMarkdown` component for unified rendering.

### Changed

- Refactored `seed.py` to use Upsert pattern.
- Unified data fetching via `fetchPublic` utility.

## [0.1.8] - 2026-05-11

### Added

- Google Cloud Storage (Google Drive API) integration for project images.
- Encrypted environment variables for Google credentials on Vercel.

### Changed

- Migrated local filesystem storage to GCS buckets.

## [0.1.7] - 2026-05-11

### Added

- Interactive Code Playgrounds in blog posts.
- Detailed visualizations for visitor paths and chat feedback.

### Fixed

- Security: Secured `/api/v1/chat/history` and moved credentials to `.env`.
- Monolith: Modularized `Admin.tsx`.

## [0.1.6] - 2026-05-11

### Added

- Full CRUD capabilities for About, Experience, Projects, Blog, and Chatbot triggers.
- Dynamic Open Graph and Twitter Card meta tags.
- Automated sitemap and `robots.txt` generation.

### Changed

- Chatbot persona shift to first-person ("I'm Juan").

## [0.1.5] - 2026-05-10

### Added

- Hidden, password-protected `/admin` route.
- Database-driven CMS foundation.

## [0.1.4] - 2026-05-09

### Added

- Push-to-Talk (PTT) microphone support.
- Chat suggestions and inline dropdown.
- "New Chat" functionality.

## [0.1.3] - 2026-05-08

### Added

- Vercel Analytics and Speed Insights integration.
- `react-router-dom` for real URL routing.
- Toast notifications via `sonner`.

## [0.1.2] - 2026-05-07

### Added

- Simple analytics dashboard.
- PWA support with service workers.
- Web Speech API integration (STT & TTS).

## [0.1.1] - 2026-05-06

### Added

- Command Palette (Cmd+K).
- Haptic feedback for mobile.
- "Skip to Content" link for accessibility.

## [0.1.0] - 2026-05-05

### Added

- Motion animations via `framer-motion`.
- Glassmorphism and Mesh Gradient background.

## [0.0.1-0.0.9] - 2026-05-01 to 2026-05-04

### Added

- Core infrastructure, i18n engine, and UI shell.
- FastAPI backend with telemetry and SQLModel.
- AI persona expansion (Technical & HR).
- Blog module.
