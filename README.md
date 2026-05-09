# Multilingual Chatbot Portfolio

An interactive, multilingual (EN, ES, FR) portfolio featuring an AI-driven (trigger-based) chatbot assistant.

## Tech Stack

- **Frontend**: React, TypeScript, Bun, Tailwind CSS v4.
- **Backend**: FastAPI (Python 3.12), SQLModel, UV.
- **Deployment**: Vercel (Monorepo).
- **Contact**: Web3Forms integration.

## Key Features

- **Lightweight CMS**: Fully custom, database-driven content management system to update Chatbot responses and Blog posts in real-time.
- **Admin Dashboard**: Secure, password-protected `/admin` panel (password: `admin123` by default) for content and chatbot management.
- **Advanced AI Persona**: Modular technical expertise and HR screening simulation with 20+ specialized categories, powered by a database-driven trigger system.
- **Lightweight Blog Module**: Multi-language technical notes and articles section, managed via the CMS.
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
