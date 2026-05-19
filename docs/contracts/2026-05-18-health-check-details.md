# Technical Contract: v0.2.4-health-check-details

## Status: Proposed 📝

**Date:** 2026-05-18
**Version:** 0.2.4
**Specialist:** `backend-agent`

---

## 🎯 Objective

Create a detailed health check endpoint (`/api/v1/health/details`) that provides diagnostic information about the backend services, connectivity, and resource usage. This is for administrative and monitoring purposes.

---

## 🏗️ Architectural Changes

### 1. New Endpoint: `/api/v1/health/details`

Location: `backend/routers/public.py` or a dedicated `backend/routers/admin/monitoring.py`.

- **Access:** Should be protected by the admin password (re-use `verify_admin_password`).
- **Response Format:**

```json
{
  "status": "healthy | degraded | down",
  "timestamp": "ISO-8601",
  "version": "0.2.4",
  "components": {
    "database": {
      "status": "up | down",
      "latency_ms": 12.5,
      "message": null
    },
    "cache": {
      "status": "up | down",
      "size": 42
    },
    "telegram_bridge": {
      "status": "up | down | disabled",
      "message": "Token missing"
    },
    "system": {
      "memory_usage": "256MB / 1024MB",
      "disk_usage": "15% used"
    }
  }
}
```

### 2. Logic Implementation

- **Database:** Perform a simple `SELECT 1` query and measure duration.
- **Cache:** Check the size of the `get_cached_triggers` result.
- **Telegram:** Attempt a basic connectivity test to the Telegram API (e.g., `getMe` if safe/fast) or just verify configuration presence.
- **System:** Use `psutil` (if available) or basic `os` calls to get resource trends.

---

## 🔒 Security

- **Authentication:** This endpoint MUST require the admin password via the `x-admin-password` header.
- **Privacy:** Do not expose sensitive environment variables (keys, tokens) directly; only their status.

---

## ✅ Success Criteria

- [ ] Endpoint returns a 200 OK with the full diagnostic JSON.
- [ ] Database latency is accurately reported.
- [ ] Endpoint is inaccessible without the correct admin password.
- [ ] Integration tests verify both success (with auth) and failure (without auth).
