# Multilingual Chatbot Portfolio

An interactive, multilingual (EN, ES, FR) portfolio featuring an AI-driven (trigger-based) chatbot assistant.

## Tech Stack

- **Frontend**: React, TypeScript, Bun, Tailwind CSS v4.
- **Backend**: FastAPI (Python 3.12), SQLModel, UV.
- **Deployment**: Vercel (Monorepo).
- **Contact**: Web3Forms integration.

## Key Features

- **Analytics Dashboard**: Secure, password-protected dashboard to visualize visitor telemetry and chat query statistics.
- **Lightweight CMS**: Secure Admin section to manage content, blog posts, and chatbot triggers without code changes.
- **Progressive Web App (PWA)**: Offline availability and "Add to Home Screen" support via `vite-plugin-pwa`.
- **Hands-Free Voice Interaction**: Integrated Web Speech API for speech-to-text input and text-to-speech chatbot responses.
- **Markdown Chat Support**: Formatted responses with syntax highlighting for code blocks.
- **Silent Telemetry**: Visitor tracking and interaction logging via FastAPI background tasks.
- **Fully Localized**: Zero static text architecture supporting English, Spanish, and French.
- **Responsive Design**: Mobile-first layout with a pinned chat interface and persistent navigation.
- **Session Persistence**: LocalStorage-based chat history preservation.

## Documentation

- [Project Roadmap (TODO.md)](docs/TODO.md)
- [API Reference](docs/API.md)
- [Project Instructions (GEMINI.md)](GEMINI.md)
- [Vision & Design (CONTEXT.md)](docs/CONTEXT.md)

## Development

### Backend

From the root directory:

```bash
npm run setup:backend
npm run dev:backend
```

Or manually from the `backend` folder:

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

### Frontend

From the root directory:

```bash
npm run dev:frontend
```

Or manually from the `frontend` folder:

```bash
cd frontend
bun install
bun run dev
```
