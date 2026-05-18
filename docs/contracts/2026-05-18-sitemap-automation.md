# Technical Contract: Sitemap Automation

**Date:** 2026-05-18
**Status:** Draft
**Scope:** Backend (FastAPI), Infrastructure (Vercel)

## 1. Objective

Ensure the `sitemap.xml` is always up-to-date by generating it dynamically. This is essential for SEO, especially as new blog posts are added via the CMS.

## 2. Technical Requirements

### 2.1 Backend Endpoint

- Implement a new route `@router.get("/sitemap.xml")` in `backend/routers/public.py`.
- The endpoint must return a `Response` with `media_type="application/xml"`.
- It should aggregate:
  - Base URL: `https://acostajs.vercel.app` (get from settings if available).
  - Static Routes: `/`, `/about`, `/experience`, `/projects`, `/contact`, `/blog`.
  - Dynamic Routes: `/blog/{slug}` for every `published` BlogPost in the database.

### 2.2 Infrastructure

- Update `vercel.json` to include a rewrite that maps `/sitemap.xml` to the backend endpoint (e.g., `/api/v1/sitemap.xml`).

## 3. Implementation Details

Example XML Generation:

```python
@router.get("/sitemap.xml")
async def sitemap(session: Session = Depends(get_session)):
    base_url = "https://acostajs.vercel.app"
    static_paths = ["", "/about", "/experience", "/projects", "/contact", "/blog"]

    # Fetch blog posts
    posts = session.exec(select(BlogPost).where(BlogPost.published)).all()

    # Construct XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    for path in static_paths:
        xml_content += f"<url><loc>{base_url}{path}</loc><changefreq>weekly</changefreq></url>"

    for post in posts:
        xml_content += f"<url><loc>{base_url}/blog/{post.slug}</loc><changefreq>monthly</changefreq></url>"

    xml_content += "</urlset>"
    return Response(content=xml_content, media_type="application/xml")
```

## 4. Verification Plan

- [ ] Hit `http://localhost:8000/api/v1/sitemap.xml` and verify valid XML format.
- [ ] Verify that all published blog posts are present in the output.
- [ ] Verify the rewrite in `vercel.json` locally or via documentation review.
