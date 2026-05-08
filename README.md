# Multilingual Chatbot Portfolio

An interactive, multilingual (EN, ES, FR) portfolio featuring an AI-driven (trigger-based) chatbot assistant.

## Tech Stack

- **Frontend**: React, TypeScript, Bun, Tailwind CSS v4.
- **Backend**: FastAPI (Python 3.12), SQLModel, UV.
- **Deployment**: Vercel (Monorepo).
- **Contact**: Web3Forms integration.

## Key Features

- **Interactive Chatbot**: Rule-based persona that answers questions about background, projects, and contact info.
- **Silent Telemetry**: Visitor tracking and interaction logging via FastAPI background tasks.
- **Fully Localized**: Zero static text architecture supporting English, Spanish, and French.
- **Responsive Design**: Mobile-first layout with a pinned chat interface and persistent navigation.

## Documentation

- [Project Roadmap (TODO.md)](docs/TODO.md)
- [API Reference](docs/API.md)
- [Project Instructions (GEMINI.md)](GEMINI.md)
- [Vision & Design (CONTEXT.md)](docs/CONTEXT.md)

## Development

### Backend

```bash
cd backend
npm run setup:backend # Or use uv directly
uv run uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
bun install
bun run dev
```
