# Technical Contract: v0.2.4-proactive-nlu-hints

## Status: Proposed 📝

**Date:** 2026-05-18
**Version:** 0.2.4
**Specialist:** `backend-agent` / `frontend-agent`

---

## 🎯 Objective

Reduce user friction by providing proactive NLU hints (suggested questions) that are relevant to the user's current context in the portfolio.

---

## 🏗️ Architectural Changes

### 1. Backend: New Endpoint `/api/v1/chat/hints`

Location: `backend/routers/chat.py`

- **Request:** `GET /api/v1/chat/hints?page_id=projects&lang=en`
- **Logic:**
  - Map `page_id` to a set of relevant `ChatTriggerResponse` categories.
  - Select 3 random triggers from those categories.
  - Return a list of strings (the triggers themselves).
- **Default:** If `page_id` is unknown or "home", return general introductory hints (e.g., "What projects have you worked on?", "Tell me about your tech stack").

### 2. Frontend: UI Integration

Location: `frontend/src/components/chat/ChatContainer.tsx` (or equivalent).

- **Behavior:**
  - On component mount (or page transition), fetch hints from the API.
  - Display hints as clickable chips/buttons above the chat input field.
  - Clicking a hint populates the input and optionally auto-sends it.
- **Styling:** Use Tailwind for subtle, non-intrusive chip styling.

---

## ✅ Success Criteria

- [ ] Backend returns 3 relevant hints based on `page_id`.
- [ ] Frontend displays hints as interactive chips.
- [ ] Clicking a hint triggers the chat flow correctly.
- [ ] Language selection is respected in the hints returned.
