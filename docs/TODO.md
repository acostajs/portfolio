# Project Roadmap (TODO.md)

## 🎯 Current Phase: Final Polish & Optimization

- [ ] **API Documentation Sync**: Align `docs/API.md` with the actual implementation (Middleware-based telemetry, etc.).
- [ ] **Session Persistence**: Implement `localStorage` in the frontend to keep chat history across page refreshes.
- [ ] **Lighthouse Optimization**: Conduct a final performance audit to ensure 90+ scores across the board.
- [ ] **Trigger Refinement**: Expand the fallback and greeting responses to feel more natural within the existing logic.

## ⏳ Backlog & Future Ideas

- [ ] **Motion & Micro-interactions**: Integrate `framer-motion` for:
  - Staggered chat bubble entry animations.
  - Smooth page transitions between navigation links.
  - "Thinking" pulse animation for the chatbot avatar.
- [ ] **Modern Visual Polish**:
  - Apply **Glassmorphism** (`backdrop-blur`) to Sidebar and Header.
  - Implement a subtle, animated **Mesh Gradient** background.
  - Add blur-up placeholders for progressive image loading.
- [ ] **Command Palette (Cmd+K)**: Implement a global search/navigation menu.
- [ ] **Markdown Chat Support**: Render markdown in chat responses with syntax highlighting.
- [ ] **Advanced UX**:
  - **Haptic Feedback**: Add subtle vibrations for mobile interactions.
  - **Copy-to-Clipboard**: Quick copy for email/socials in Sidebar/Contact.
- [ ] **Accessibility (a11y) & SEO**:
  - Add a "Skip to Content" link for screen readers.
  - Implement high-visibility `:focus-visible` rings for keyboard navigation.
- [ ] **Analytics Dashboard**: Create a simple password-protected view to visualize visitor telemetry and common chat queries.
- [ ] **Blog Module**: Add a lightweight, markdown-based blog section for technical notes.
- [ ] **Voice Interaction**: Explore Web Speech API for hands-free chatbot interaction.
- [ ] **PWA Support**: Configure service workers for offline availability and "Add to Home Screen" support.

### Phase 8: Final Polish & Optimization

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
