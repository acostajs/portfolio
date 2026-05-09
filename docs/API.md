# API Documentation

## Base URL

- **Local Development**: `http://localhost:8000`
- **Production (Vercel)**: `https://<your-vercel-domain>`

> **Note**: All production API routes are prefixed with `/api` via the Vercel monorepo configuration (see `vercel.json`).

## Chat & Assistant

### Send Message

`POST /api/v1/chat`

Interacts with the portfolio assistant. Responses are determined by a trigger-based NLU system.

**Request Body**:

```json
{
  "message": "Tell me about your projects",
  "language": "en",
  "history": [{ "role": "assistant", "content": "Hi! I'm Juan..." }]
}
```

**Response Body**:

```json
{
  "reply": "I've built several interesting projects using React and FastAPI..."
}
```

### Get Chat History

`GET /api/v1/chat/history`

Retrieves the 50 most recent user messages saved to the database.

**Response Body**:

```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Tell me about your projects",
    "timestamp": "2026-05-08T12:00:00Z"
  }
]
```

## System

### Root

`GET /`

Returns a simple JSON welcome message.

### Health Check

`GET /health`

Used for monitoring the service status.

## Contact (External Integration)

The "Contact" page does not use the local backend. It integrates directly with **Web3Forms**.

- **Endpoint**: `https://api.web3forms.com/submit`
- **Submission Type**: JSON POST.
- **Public Key**: `ac899b83-2b9a-4333-afac-7c0048e1782d`
