# Technical Contract: v0.2.4-session-metadata-persistence

## Status: Proposed 📝

**Date:** 2026-05-18
**Version:** 0.2.4
**Specialist:** `backend-agent`

---

## 🎯 Objective

Enhance the `LiveChatSession` model to support arbitrary JSON metadata. This will enable the chatbot to store transient facts (e.g., user name, preferred tech, current intent) to improve conversation continuity.

---

## 🏗️ Architectural Changes

### 1. Data Model Update: `LiveChatSession`

Update `backend/models.py`:

```python
class LiveChatSession(SQLModel, table=True):
    # ... existing fields ...
    metadata: Optional[dict] = Field(default={}, sa_column=Column(JSON))
```

### 2. Implementation logic

- **Middleware/Router Integration:** Ensure the metadata can be updated during a chat turn.
- **Utility Methods:** Add a method to `LiveChatSession` (if possible/idiomatic) or a helper in `chat.py` to `update_metadata(session_id, updates: dict)`.
- **NLU Integration:** The `chat` endpoint should check for existing metadata to influence the response (e.g., if `metadata['is_recruiter']` is true, use more professional tones).

### 3. Database Migration

Update `backend/database.py` to include the migration for adding the `metadata` column to `livechatsession`.

---

## ✅ Success Criteria

- [ ] `livechatsession` table includes a `metadata` column of type JSON.
- [ ] API can read/write to the `metadata` field during a session.
- [ ] Chatbot logic can successfully extract a value from metadata to change its behavior (verified via tests).
- [ ] Migrations run cleanly on both SQLite and Postgres.
