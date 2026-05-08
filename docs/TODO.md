# Project Roadmap (TODO.md)

## 🎯 Current Phase: AI Intelligence & Deep Content

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
- [ ] **Blog Module**: Add a lightweight, markdown-based blog section for technical notes and articles.

## ⏳ Backlog & Future Ideas

### Phase 10: Motion & High-End Visuals

- [ ] **Motion & Micro-interactions**: Integrate `framer-motion` for:
  - Staggered chat bubble entry animations.
  - Smooth page transitions between navigation links.
  - "Thinking" pulse animation for the chatbot avatar.
- [ ] **Modern Visual Polish**:
  - Apply **Glassmorphism** (`backdrop-blur`) to Sidebar and Header.
  - Implement a subtle, animated **Mesh Gradient** background.
  - Add blur-up placeholders for progressive image loading.

### Phase 11: Professional UX & Accessibility

- [ ] **Command Palette (Cmd+K)**: Implement a global search/navigation menu for keyboard-first efficiency.
- [ ] **Advanced UX Enhancements**:
  - **Header Navigation**: Clicking the Header logo/title should return the user to the Home (Chat) view.
  - **Haptic Feedback**: Add subtle vibrations for mobile interactions.
  - **Copy-to-Clipboard**: Quick copy for email/socials in Sidebar/Contact.
- [ ] **Accessibility (a11y) & SEO**:
  - Add a "Skip to Content" link for screen readers.
  - Implement high-visibility `:focus-visible` rings for keyboard navigation.

### Phase 12: Platform & Analytics

- [ ] **Analytics Dashboard**: Create a simple password-protected view to visualize visitor telemetry and common chat queries.
- [ ] **PWA Support**: Configure service workers for offline availability and "Add to Home Screen" support.
- [ ] **Voice Interaction**: Explore Web Speech API for hands-free chatbot interaction.

## ✅ Archive (Completed)

### Phase 8: Final Polish & Optimization

- [x] **Trigger Refinement**: Expanded greeting, fallback, and "fun" responses for a more varied and natural persona.
- [x] **Lighthouse Optimization**: Implemented SEO metadata, accessibility (ARIA), and performance (lazy-loading) best practices.
- [x] **Chat Commands**: Implemented local slash commands (/clear, /help, /about, /experience, /projects, /contact).
- [x] **Session Persistence**: Implemented `localStorage` to preserve chat history across refreshes.
- [x] **API Documentation Sync**: Synchronized `docs/API.md` with FastAPI implementation and telemetry logic.
- [x] **Strengthen Pre-commit Hooks**: Updated Husky/root configuration to run a full validation suite (Ruff, Pyright, Pytest, TSC, ESLint, Bun test).
- [x] **Mobile Viewport & Technical Fixes**: Implemented `100dvh`, safe area insets, and robust flexbox anchoring.
- [x] **Mobile UI Refinement (Visual Audit)**: Optimized header spacing, fixed i18n remounting bug, and shortened placeholders.

### Phase 7: Mobile UX, Messaging & Persona

- [x] **Sticky Layout**: Implemented `h-screen` flex-col strategy for fixed header/input.
- [x] **Header Typography**: Fixed text breaking on mobile using fluid sizing.
- [x] **Input Optimization**: Shortened mobile placeholders for better fit.
- [x] **Backend Automation**: Created root-level scripts for `uv` environment setup.
- [x] **Database Optimization**: Excluded assistant messages from DB to save space.
- [x] **Persona Tuning**: Updated system responses to a warm, first-person perspective.
- [x] **NLU Refinement**: Improved trigger matching with regex/word boundaries.
- [x] **i18n Expansion**: Completed full translation sets for EN, FR, and ES.

### Phase 6: UI Refinement & Audit

- [x] **Codebase Audit**: Semantic HTML and Tailwind consistency check.
- [x] **Tree Shaking**: Removed unused components and dead types.
- [x] **Security Scan**: Audited backend handlers and frontend forms.
- [x] **Sticky Navigation**: Pinned Header for persistent access.
- [x] **Chat Layout**: Pinned input field to the bottom of the viewport.
- [x] **Typography Refresh**: Implemented Space Grotesk and SFMono stacks.
- [x] **Trigger Logic**: Restored modular trigger responses in `backend/responses/`.

### Phase 5: Contact & Cleanup

- [x] **Web3Forms Integration**: Connected Contact page to the external service.
- [x] **Validation**: Final audit for semantic HTML and accessibility.

### Phase 4: Deployment Readiness

- [x] **Vercel Config**: Root-level `vercel.json` for monorepo routing.
- [x] **Env Variables**: Configured keys in Vercel dashboard.
- [x] **Build Optimization**: Tuned Bun build scripts for production.
- [x] **CORS Policy**: Set up production-ready origins in FastAPI.

### Phase 3: Backend Implementation

- [x] **Telemetry**: FastAPI `BackgroundTasks` for silent tracking.
- [x] **Database**: SQLModel schema for Analytics and Chat history.
- [x] **Mock Chat**: Initial randomized response logic.
- [x] **Tooling**: Updated to Python 3.12 and configured CI workflows.

### Phase 2: Layout & Navigation

- [x] **Shell Components**: Built Header, Sidebar, and Mobile Overlay.
- [x] **Theming**: System-first dark/light mode detection.
- [x] **Routing**: Client-side navigation with persistent shell.
- [x] **Data Mocks**: Populated `lib/mocks.ts` with developer data.

### Phase 1: Infrastructure & i18n

- [x] **Monorepo**: Initialized React (Bun) + FastAPI (Python) structure.
- [x] **Automation**: Setup Husky, commitlint, and lint-staged.
- [x] **i18n Engine**: Custom TypeScript-based translation system.
- [x] **Vercel Prep**: Initial monorepo routing configuration.
