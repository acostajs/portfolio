# Technical Contract: Security Hardening (Rate-Limiting)

**Date:** 2026-05-18
**Status:** Draft
**Scope:** Backend (FastAPI, Security)

## 1. Objective

Protect administrative endpoints from brute-force attacks by implementing rate-limiting. This is specifically critical for the `/admin` routes which rely on a static (but environment-configured) token.

## 2. Technical Requirements

### 2.1 Dependencies

- Add `slowapi` to the backend dependencies.
- Ensure it's installed using `uv add slowapi`.

### 2.2 Configuration

- Initialize `Limiter` in `backend/main.py` or a dedicated `backend/security.py`.
- Use the client's IP address (`get_remote_address`) as the key for rate-limiting.
- Configure a default limit for admin routes: e.g., `5 requests per minute` for sensitive write operations, and `20 per minute` for reads.

### 2.3 Application

- Integrate `SlowAPI` middleware into the FastAPI app.
- Apply the `@limiter.limit("5/minute")` decorator (or similar) to all endpoints in the following routers:
  - `backend/routers/admin/about.py`
  - `backend/routers/admin/blog.py`
  - `backend/routers/admin/experience.py`
  - `backend/routers/admin/projects.py`
  - `backend/routers/admin/chat.py`
  - `backend/routers/admin/uploads.py`

## 3. Implementation Details

Example integration in `main.py`:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

## 4. Verification Plan

- [ ] Verify `slowapi` is added to `pyproject.toml`.
- [ ] Perform a manual test using `curl` or a script to trigger the 429 "Too Many Requests" response on an admin endpoint.
- [ ] Ensure public endpoints (greetings, projects list) remain unaffected by the admin rate limits.
