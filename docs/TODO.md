# Project Roadmap (TODO.md)

## 🎯 Current Version: Post-Audit Refinements (0.2.1)

- [x] **Technical Implementation**:
  - [x] **Global Admin Security**: Apply `verify_admin_password` as a global dependency in the parent admin router to secure all admin endpoints.
  - [x] **Unified Loading State Migration**: Remove local `isLoading` states in `Blog.tsx` and `Projects.tsx` to leverage global `Suspense` fallbacks.
  - [x] **Admin API Consolidation**: Evaluate and remove redundant `GET` endpoints in the admin routers that duplicate public API functionality.

## ✅ Archive (Completed)

### Version 0.2.1: Initial Audit & Cleanup

- [x] **Technical Audit & Cleanup**:
  - [x] **Unused Asset Removal**: Deleted `Typewriter.tsx` component and `hero.png` asset.
  - [x] **Dependency Cleanup**: Removed `google-cloud-storage` from backend.
  - [x] **Requirements Sync**: Updated `requirements.txt` to match `pyproject.toml`.
  - [x] **Performance Optimization**: Refactored `MeshBackground.tsx` to use CSS animations.
- [x] **Bug Fixes**:
  - [x] **Admin Analytics**: Added missing `refresh` translation string to prevent build failure.
- [x] **Post-Audit Refinements (Initial)**:
  - [x] **Blog Playground Optimization**: Investigate code-splitting for `@codesandbox/sandpack-react`.
  - [x] **Speech Recognition Removal**: Eliminated `useSpeech.ts` and associated UI logic to resolve mobile compatibility issues.
  - [x] **Admin Logout UX**: Add hover states, click feedback, and a toast message for the admin logout action.
- [x] **UI/UX Refinements**:
  - [x] **TagInput Component**: Replaced comma-separated text fields with a modern chip/tag input for managing tech stacks, skills, and chatbot triggers in the Admin CMS.
  - [x] **Unified Loading**: Replace specific skeleton loaders with a simplified generic loading state for all pages.
  - [x] **Typewriter Integration**: Re-implement the `Typewriter` component and integrate it into the chatbot for a more dynamic feel.
  - [x] **Chatbot Welcome Simplification**: Consolidate the initial chatbot welcome into a single message containing all necessary information and remove the "subwelcome" component/string.

### Version 0.2.0: System Hardening & Final Polish

- [x] **FastAPI Architectural Refactoring**:
  - [x] **Dependency Injection**: Refactor all routes to use `Depends(get_session)` for database sessions instead of manual context managers.
  - [x] **Modular Routers**: Split the monolith `admin.py` into a modular structure: `backend/routers/admin/` (e.g., `projects.py`, `blog.py`, `chat.py`).
- [x] **Feedback & Analytics Expansion**:
  - [x] **Enhanced Feedback Tracking**: Ensure `ChatFeedback` records are fully linked to specific assistant responses and categorized by "Negative" vs "Positive".
  - [x] **Analytics Visualization**: Update the Admin Analytics dashboard to display trends for negative feedback to identify weak NLU triggers.

### Version 0.1.9: Advanced Architecture & Scalability

- [x] **Robust Data Seeding**:
  - [x] Refactor `seed.py` to use an **Upsert (Update-or-Insert)** pattern.
  - [x] Enable updating existing CMS records via seed script without wiping the database.
- [x] **Backend NLU Optimization**:
  - [x] Implement a **Two-Tier Matching System** for chatbot triggers.
  - [x] Use a hash-map for exact keyword matches before falling back to `rapidfuzz`.
- [x] **Frontend Lazy Loading**:
  - [x] Migrate `BotMessage.tsx` and `MarkdownRenderer.tsx` to lazy load `SyntaxHighlighter` and `ReactMarkdown`.
  - [x] Implement skeleton loaders for CMS-driven sections (Projects, Experience).
- [x] **Architecture Refactoring & Consolidation**:
  - [x] **Unified Data Fetching**: Migrate all page-level `fetch()` calls to use the `fetchPublic` utility in `lib/api.ts`.
  - [x] **Consolidated Markdown Rendering**: Create a `SharedMarkdown` component in `components/ui` to unify rendering between Chat and Blog and handle lazy-loaded `SyntaxHighlighter`.
  - [x] **Unified Skeleton Loaders**: Standardize loading states by leveraging `Suspense` fallbacks in `App.tsx` and removing local `isLoading` states across components.
  - [x] **Debug Cleanup**: Remove all remaining `console.log` statements and debug artifacts from the production codebase.
  - [x] **Code Quality**: Fixed `ProgressiveImage` hook dependency and unused vars in `useSpeech`.
  - [x] **Backend Formatting**: Standardized codebase with Ruff.

### Version 0.1.8: Cloud Infrastructure & Storage

- [x] **Google Cloud Storage Integration**:
  - [x] Setup Google Cloud Project and Service Account.
  - [x] Integrate **Google API Client** in backend to handle project image uploads.
  - [x] Replace local filesystem storage in `admin.py` with GCS buckets to bypass Vercel's read-only FS.
  - [x] Update frontend to fetch images from GCS signed URLs or public buckets.
- [x] **Environment Hardening**:
  - [x] Migrate all Google credentials to Vercel encrypted environment variables.
  - [x] Implement secret rotation policy for Admin passwords. (Renamed `password` to `admin_token`, moved to `.env`).
- [x] [Contract: 2026-05-11-v0.1.8-cloud-storage.md](contracts/2026-05-11-v0.1.8-cloud-storage.md)

### Version 0.1.7: Performance & Security Hardening

- [x] **Audit Remediation: Security & Architecture**:
  - [x] Secure public `/api/v1/chat/history` endpoint.
  - [x] Move hardcoded credentials to `.env`.
  - [x] Modularize `Admin.tsx` (1500+ line monolith).
  - [x] Fix `seed.py` destructive update pattern.
- [x] **Audit Remediation: Cleanup & i18n**:
  - [x] Remove `mocks.ts` and unused `PageContent` models.
  - [x] Centralize `Project` and `Experience` types in `types/cms.ts`.
  - [x] Fix i18n violations in Admin section (ZERO Static Text).
- [x] **Interactive Code Playgrounds**: Embed interactive snippets in blog posts.
- [x] **Analytics Dashboard Expansion**: Add more detailed visualizations for visitor paths and chat feedback.
- [x] **Performance Optimization (Target 95+)**:
  - [x] **Code Splitting**: Implement `React.lazy()` for `BlogManager` and `BotMessage` to reduce 1.9MB bundle.
  - [x] **Dependency Audit**: Analyze bundle with `rollup-plugin-visualizer`.
  - [x] **Asset Compression**: Optimize `hero.png` and PDF resumes.
  - [x] **Resource Priority**: Preload critical fonts and the `hero.png` asset.
- [x] **Security & DX Hardening**:
  - [x] Rename `password` parameter to `admin_token` in `main.py` and `auth.py`.
  - [x] Implement `prefers-reduced-motion` in `MeshBackground.tsx`.
  - [x] [Contract: 2026-05-11-v0.1.7-hardening.md](contracts/2026-05-11-v0.1.7-hardening.md)

### Version 0.1.6: SEO, Performance & Social

- [x] **CMS CRUD: Content Management**: Implement full add/modify/delete capabilities for:
  - [x] **About**: Manage bio and personal information.
  - [x] **Experience**: Manage professional history entries.
  - [x] **Projects**: Manage portfolio project details and links.
- [x] **CMS CRUD: Blog**: Implement full lifecycle management (Create/Edit/Delete) for blog posts.
- [x] **CMS CRUD: Chatbot**: Manage chatbot triggers and their corresponding responses via the admin interface.
- [x] **Persona & Tone Refinement**: Shift chatbot persona to a warmer, first-person perspective ("I'm Juan").
  - [x] Update Header title to "Juan Acosta, ask me anything".
  - [x] Revamp initial welcome message: change "Juan's virtual assistant" to first-person, remove bullet points, and maintain a warm tone while keeping the core introductory information.
- [x] **Open Graph & Twitter Cards**: Implement dynamic meta tags for better social sharing.
- [x] **Sitemap & robots.txt**: Generate automated sitemap and robots.txt for search engines.
- [x] **Project Image Management**: Support uploading and displaying project-specific images via the CMS.

### Version 0.1.5: Lightweight CMS & Content Management

- [x] **Admin Section Foundation**: Created a hidden, password-protected `/admin` route with a secure login dashboard.
- [x] **Lightweight CMS Features**: Built a user-friendly interface within the Admin section to manage:
  - Chatbot Responses and Triggers (Database-driven).
  - Blog Posts (Database-driven).
- [x] **Content Migration**: Migrated hardcoded chatbot responses and blog posts to the database using a custom seed script.
- [x] **CMS API Integration**: Refactored the chatbot logic and Blog page to fetch data from the newly implemented CMS endpoints.

### Version 0.1.4: Chatbot Intelligence & Voice Interaction

- [x] **Revamp Initial Chat Message**: Updated the translation files to provide a clearer, more engaging initial message explaining the chatbot's capabilities.
- [x] **Add Chat Suggestions**: Implemented clickable suggestion chips above the chat input to guide users on what to ask.
- [x] **"New Chat" Functionality**: Added a dedicated UI button to start a fresh chat session, ensuring session history is cleared properly.
- [x] **Push-to-Talk Microphone (Desktop & Mobile)**: Refactored the voice input to require the user to press and hold the button to speak, ensuring robust support across mobile devices.
- [x] **Fuzzy Trigger Matching**: Upgraded backend logic using `rapidfuzz` to handle typos and varied phrasing when matching user questions. Refined priority and triggers to avoid false positives from common words like "about".
- [x] **Chatbot Feedback Loop**: Added "Helpful/Not Helpful" buttons to assistant messages and a backend tracking endpoint to monitor response quality.
- [x] **Inline Chat Suggestions**: Moved suggestions from static buttons to a dynamic inline dropdown that appears when the input is focused, unified with the slash command system.
- [x] **Hardened Pre-commit Hooks**: Configured Husky and `lint-staged` to enforce auto-formatting (Prettier/Ruff) and mandatory type-checking (TSC/Pyright) before every commit.

### Version 0.1.3: Core Architecture & UX Refinement

- [x] **Remove Local Analytics**: Carefully remove the VisitorSession model, decouple it from ChatMessage, and delete the local /analytics page and backend endpoints.
- [x] **Integrate Vercel Services**: Install and configure @vercel/analytics and @vercel/speed-insights in the frontend application.
- [x] **Fix Deprecated UTC**: Update `backend/models.py` and `backend/main.py` to use Python 3.12+ compliant timezone-aware datetimes.
- [x] **Implement react-router-dom**: Replace custom navigation with real URL routing to support direct links (e.g., /contact) and browser history.
- [x] **Implement Toast Notifications**: Integrated `sonner`. Replaced the inline success/error messages on the Contact form and used it for UI feedback (e.g., copying emails).

### Version 0.1.2: Platform & Analytics

- [x] **Analytics Dashboard**: Create a simple password-protected view to visualize visitor telemetry and common chat queries.
- [x] **PWA Support**: Configure service workers for offline availability and "Add to Home Screen" support.
- [x] **Voice Interaction**: Implemented Web Speech API for hands-free chatbot interaction (STT & TTS).

### Version 0.1.1: Professional UX & Accessibility

- [x] **Command Palette (Cmd+K)**: Implement a global search/navigation menu for keyboard-first efficiency.
- [x] **Advanced UX Enhancements**:
  - [x] **Header Navigation**: Clicking the Header logo/title returns the user to the Home (Chat) view.
  - [x] **Haptic Feedback**: Add subtle vibrations for mobile interactions.
  - [x] **Copy-to-Clipboard**: Quick copy for email/socials in Sidebar/Contact.
- [x] **Accessibility (a11y) & SEO**:
  - [x] Add a "Skip to Content" link for screen readers.
  - [x] Implement high-visibility `:focus-visible` rings for keyboard navigation.

### Version 0.1.0: Motion & High-End Visuals

- [x] **Motion & Micro-interactions**: Integrated `framer-motion` for:
  - Staggered chat bubble entry animations.
  - Smooth page transitions between navigation links.
  - "Thinking" pulse animation for the chatbot avatar.
- [x] **Modern Visual Polish**:
  - Applied **Glassmorphism** (`backdrop-blur`) to Sidebar and Header.
  - Implemented a subtle, animated **Mesh Gradient** background.
  - Added blur-up placeholders for progressive image loading.

### Version 0.0.9: AI Intelligence & Deep Content

- [x] **Advanced Technical Persona Expansion**: Expand chatbot triggers and logic to provide expert-level answers from a junior full-stack perspective on:
  - **Core Foundations**: Version Control (Gitflow/Trunk), Performance (Web Vitals), Security (OWASP), and Testing Philosophy.
  - **Frontend Specialization**: State Management, Accessibility (WCAG 2.2), Rendering Patterns (SSR/SSG), and CSS Architecture.
  - **Backend Specialization**: API Design (REST/GraphQL), Database Mastery (Indexing, NoSQL), System Architecture, and Auth (OAuth2/JWT).
  - **Full Stack & DevOps**: Infrastructure as Code (Docker/Terraform), CI/CD (GitHub Actions), and Monitoring (Sentry).
  - **Behavioral**: Technical Conflict Resolution, Tool Selection Justification, AI-Assisted Workflow, and Stakeholder Communication.
- [x] **HR & Personality Assessment**: Enable the chatbot to simulate HR screenings by addressing:
  - **Soft Skills**: Handling constructive feedback, ownership of mistakes, and prioritization under pressure.
  - **Work Style**: Remote communication preferences and professional growth motivations.
  - **Evaluation**: Implement logic to evaluate the balance between "technical ego" and team collaboration.
- [x] **Markdown Chat Support**: Render markdown in chat responses with syntax highlighting for code blocks.
- [x] **Blog Module**: Add a lightweight, markdown-based blog section for technical notes and articles.

### Version 0.0.8: Final Polish & Optimization

- [x] **Trigger Refinement**: Expanded greeting, fallback, and "fun" responses for a more varied and natural persona.
- [x] **Chat Commands**: Implemented local slash commands (/clear, /help, /about, /experience, /projects, /contact).
- [x] **Session Persistence**: Implemented `localStorage` to preserve chat history across refreshes.
- [x] **API Documentation Sync**: Synchronized `docs/API.md` with FastAPI implementation and telemetry logic.
- [x] **Strengthen Pre-commit Hooks**: Updated Husky/root configuration to run a full validation suite (Ruff, Pyright, Pytest, TSC, ESLint, Bun test).
- [x] **Mobile Viewport & Technical Fixes**: Implemented `100dvh`, safe area insets, and robust flexbox anchoring.
- [x] **Mobile UI Refinement (Visual Audit)**: Optimized header spacing, fixed i18n remounting bug, and shortened placeholders.

### Version 0.0.7: Mobile UX, Messaging & Persona

- [x] **Sticky Layout**: Implemented `h-screen` flex-col strategy for fixed header/input.
- [x] **Header Typography**: Fixed text breaking on mobile using fluid sizing.
- [x] **Input Optimization**: Shortened mobile placeholders for better fit.
- [x] **Backend Automation**: Created root-level scripts for `uv` environment setup.
- [x] **Database Optimization**: Excluded assistant messages from DB to save space.
- [x] **Persona Tuning**: Updated system responses to a warm, first-person perspective.
- [x] **NLU Refinement**: Improved trigger matching with regex/word boundaries.
- [x] **i18n Expansion**: Completed full translation sets for EN, FR, and ES.

### Version 0.0.6: UI Refinement & Audit

- [x] **Codebase Audit**: Semantic HTML and Tailwind consistency check.
- [x] **Tree Shaking**: Removed unused components and dead types.
- [x] **Security Scan**: Audited backend handlers and frontend forms.
- [x] **Sticky Navigation**: Pinned Header for persistent access.
- [x] **Chat Layout**: Pinned input field to the bottom of the viewport.
- [x] **Typography Refresh**: Implemented Space Grotesk and SFMono stacks.
- [x] **Trigger Logic**: Restored modular trigger responses in `backend/responses/`.

### Version 0.0.5: Contact & Cleanup

- [x] **Web3Forms Integration**: Connected Contact page to the external service.
- [x] **Validation**: Final audit for semantic HTML and accessibility.

### Version 0.0.4: Deployment Readiness

- [x] **Vercel Config**: Root-level `vercel.json` for monorepo routing.
- [x] **Env Variables**: Configured keys in Vercel dashboard.
- [x] **Build Optimization**: Tuned Bun build scripts for production.
- [x] **CORS Policy**: Set up production-ready origins in FastAPI.

### Version 0.0.3: Backend Implementation

- [x] **Telemetry**: FastAPI `BackgroundTasks` for silent tracking.
- [x] **Database**: SQLModel schema for Analytics and Chat history.
- [x] **Mock Chat**: Initial randomized response logic.
- [x] **Tooling**: Updated to Python 3.12 and configured CI workflows.

### Version 0.0.2: Layout & Navigation

- [x] **Shell Components**: Built Header, Sidebar, and Mobile Overlay.
- [x] **Theming**: System-first dark/light mode detection.
- [x] **Routing**: Client-side navigation with persistent shell.
- [x] **Data Mocks**: Populated `lib/mocks.ts` with developer data.

### Version 0.0.1: Infrastructure & i18n

- [x] **Monorepo**: Initialized React (Bun) + FastAPI (Python) structure.
- [x] **Automation**: Setup Husky, commitlint, and lint-staged.
- [x] **i18n Engine**: Custom TypeScript-based translation system.
- [x] **Vercel Prep**: Initial monorepo routing configuration.
