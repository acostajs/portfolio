# Technical Contract: v0.2.4-visitor-tracking-middleware

## Status: Proposed 📝

**Date:** 2026-05-18
**Version:** 0.2.4
**Specialist:** `backend-agent`

---

## 🎯 Objective

Implement a robust, non-blocking middleware in FastAPI to track visitor activity across the portfolio. This data will eventually power the Admin Analytics Dashboard.

---

## 🏗️ Architectural Changes

### 1. Data Model: `VisitorLog`

Add a new model to `backend/models.py`:

```python
class VisitorLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    path: str = Field(index=True)
    method: str
    locale: str = Field(default="en")
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    ip_hash: str  # SHA-256 hash of the IP for privacy
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

### 2. Middleware Implementation

Location: `backend/main.py` or a new `backend/middleware.py`.

- **Logic:**
  1. Extract `path`, `method`, `user-agent`, and `referrer` from the request.
  2. Extract the `Accept-Language` header or a custom `x-portfolio-locale` header.
  3. Hash the client IP using a salt (stored in `settings`).
  4. Use `BackgroundTasks` to persist the data to the database after the response is sent.
- **Exclusions:** Do NOT track requests to:
  - `/api/v1/admin/*` (Privacy & Noise reduction).
  - `/docs`, `/openapi.json`, `/favicon.ico`, `/sitemap.xml`, `/robots.txt`.
  - Static assets (if served by FastAPI, though they shouldn't be).

### 3. Database Migrations

Update `backend/database.py` to include `SQLModel.metadata.create_all(engine)` (already exists) and any specific migration logic if needed for the new table.

---

## 🔒 Security & Privacy

- **IP Anonymization:** Use `hashlib.sha256(ip + salt).hexdigest()` to store an irreversible hash of the IP address.
- **Selective Tracking:** Avoid tracking sensitive admin routes or health checks.

---

## ✅ Success Criteria

- [ ] Every valid public request is logged to the `VisitorLog` table.
- [ ] Tracking does not increase the response latency of public endpoints.
- [ ] Admin routes and static files are excluded from logging.
- [ ] Tests verify that `VisitorLog` entries are correctly created with hashed IPs.
