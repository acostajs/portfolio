# API Documentation

## Base URL

`http://localhost:8000/api/v1`

## Analytics & Telemetry

| Method | Endpoint        | Description                                                       |
| :----- | :-------------- | :---------------------------------------------------------------- |
| `POST` | `/sessions`     | Initialize a visitor session (captures IP, User-Agent, Language). |
| `POST` | `/events`       | Log page views or button clicks.                                  |
| `POST` | `/chat/history` | Save chatbot prompts and AI responses for analysis.               |

## Contact (External)

- **Service:** Web3Forms
- **Endpoint:** `https://api.web3forms.com/submit`
- **Key:** `ac899b83-2b9a-4333-afac-7c0048e1782d`
