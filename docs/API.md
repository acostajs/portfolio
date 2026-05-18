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

Retrieves the 50 most recent user messages saved to the database. Requires Admin authentication.

**Headers**:

- `X-Admin-Token`: Your admin password/token.

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

## CMS (Admin Only)

All CMS endpoints require the `X-Admin-Token` header.

### Admin Verify

`GET /api/v1/admin/verify`
Check if the provided token is valid.

### CMS Endpoints

The following modules are managed via `/api/v1/admin/`:

- `about`: GET, POST
- `experience`: GET, POST, PUT (/{id}), DELETE (/{id})
- `projects`: GET, POST, PUT (/{id}), DELETE (/{id}), POST (/{id}/upload-image)
- `blog`: GET, POST, PUT (/{id}), DELETE (/{id})
- `chat-triggers`: GET, POST, PUT (/{id}), DELETE (/{id})
  - **Models**: Include `priority` (integer) for manual override control.
- `analytics/messages`: GET
- `analytics/feedback`: GET

## Public CMS Content

### Get About

`GET /api/v1/about`

### Get Experience

`GET /api/v1/experience`

### Get Projects

`GET /api/v1/projects`

### Get Blog Posts

`GET /api/v1/blog`

Returns all blog posts ordered by date descending.

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
