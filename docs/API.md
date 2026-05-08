# API Documentation

## Base URL

`http://localhost:8000` (Local)
`https://<your-vercel-domain>/api/v1` (Production)

## Chat & Assistant

| Method | Endpoint               | Description                                                                           |
| :----- | :--------------------- | :------------------------------------------------------------------------------------ |
| `POST` | `/api/v1/chat`         | Send a message to the chatbot. Includes background telemetry and interaction logging. |
| `GET`  | `/api/v1/chat/history` | Retrieve the last 50 chat messages from the database.                                 |

### Chat Request Schema

```json
{
  "message": "Hello",
  "language": "en",
  "history": []
}
```

## System & Analytics

| Method | Endpoint  | Description                                         |
| :----- | :-------- | :-------------------------------------------------- |
| `GET`  | `/`       | Root health check / Welcome message.                |
| `GET`  | `/health` | Simple health status check for monitoring services. |

### Telemetry (Automated)

All requests to the backend (except `/health`) are automatically captured via middleware:

- **Captured Data**: IP Address, User-Agent, Request Path, and Method.
- **Storage**: Non-blocking `BackgroundTasks` save data to `portfolio.db`.

## Contact (External)

- **Service**: Web3Forms
- **Endpoint**: `https://api.web3forms.com/submit`
- **Key**: `ac899b83-2b9a-4333-afac-7c0048e1782d` (Handled via Frontend)
