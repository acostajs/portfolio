# Portfolio Backend

FastAPI-powered backend for visitor analytics and chatbot trigger logic.

## Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Package Management**: [uv](https://github.com/astral-sh/uv)
- **Database**: [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/latest/)
- **Linting/Formatting**: [Ruff](https://github.com/astral-sh/ruff)
- **Type Checking**: [Pyright](https://github.com/microsoft/pyright)

## Getting Started

### Prerequisites

- Python 3.12+
- `uv` installed (`curl -LsSf https://astral-sh/uv/install.sh | sh`)

### Setup

```bash
uv sync
```

### Running the server

```bash
uv run uvicorn main:app --reload
```

## Features

- **Trigger-based Chatbot**: Modular response system in `responses/`.
- **Silent Telemetry**: Background tasks for logging visitor data (IP, User-Agent, Path).
- **SQLModel Integration**: Simple and type-safe database interactions.
- **Auto-generated API Docs**: Available at `/docs` when running locally.
