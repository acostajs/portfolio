# Technical Contract: Backend Request Validation Refactoring

**Date:** 2026-05-18
**Status:** Draft
**Scope:** Backend (FastAPI, SQLModel)

## 1. Objective

Refactor the backend to separate API request/response schemas from database models. This ensures better security, prevents accidental exposure of internal fields (like IDs or internal timestamps during creation), and allows for more flexible API evolution.

## 2. Technical Requirements

### 2.1 Schema Definition

- Create `backend/schemas.py` (or keep in `models.py` but as non-table classes).
- For each CMS entity, define:
  - `Base`: Shared fields.
  - `Create`: Fields required for creation (excludes `id`).
  - `Update`: All fields optional (for partial updates).
  - `Read` (optional, can use the DB model if it matches).

### 2.2 Target Entities

- `About`
- `Experience`
- `Project`
- `BlogPost`
- `ChatTriggerResponse`

### 2.3 Router Updates

Modify the following admin routers to use the new schemas for request bodies:

- `backend/routers/admin/about.py`
- `backend/routers/admin/blog.py`
- `backend/routers/admin/experience.py`
- `backend/routers/admin/projects.py`
- `backend/routers/admin/chat.py` (for triggers)

## 3. Implementation Details

Example for `Project`:

```python
# Proposed in backend/models.py or schemas.py
class ProjectBase(SQLModel):
    title: str
    description_en: str = ""
    description_es: str = ""
    description_fr: str = ""
    tech: List[str] = []
    link: Optional[str] = None
    github: Optional[str] = None
    image: Optional[str] = None
    order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(SQLModel):
    title: Optional[str] = None
    description_en: Optional[str] = None
    # ... other fields as optional ...

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
```

## 4. Verification Plan

- [ ] Run existing tests in `backend/tests/test_admin.py` and `backend/tests/test_public_cms.py`.
- [ ] Ensure no regressions in the Admin UI interaction (manual check or automated if available).
- [ ] Verify that Swagger UI (`/docs`) correctly reflects the new schemas (no `id` in POST bodies).
