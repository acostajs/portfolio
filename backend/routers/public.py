import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, Response
from sqlmodel import Session, select, desc, col
from database import get_session
from models import About, Experience, Project, BlogPost

logger = logging.getLogger("backend")

router = APIRouter(prefix="/api/v1", tags=["public"])


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
        xml_content += (
            f"<url><loc>{base_url}{path}</loc><changefreq>weekly</changefreq></url>"
        )

    for post in posts:
        xml_content += f"<url><loc>{base_url}/blog/{post.slug}</loc><changefreq>monthly</changefreq></url>"

    xml_content += "</urlset>"
    return Response(content=xml_content, media_type="application/xml")


@router.get("/about", response_model=Optional[About])
async def get_public_about(session: Session = Depends(get_session)):
    return session.exec(select(About)).first()


@router.get("/experience", response_model=List[Experience])
async def get_public_experience(session: Session = Depends(get_session)):
    return session.exec(select(Experience).order_by(col(Experience.order))).all()


@router.get("/projects", response_model=List[Project])
async def get_public_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project).order_by(col(Project.order))).all()


@router.get("/blog", response_model=List[BlogPost])
async def get_public_blog(session: Session = Depends(get_session)):
    return session.exec(
        select(BlogPost).where(BlogPost.published).order_by(desc(BlogPost.date))
    ).all()


# Note: /chat, /chat/feedback, /chat/history involve more logic (NLU, background tasks).
# I'll move them as well, but I need to ensure find_trigger_match and background tasks are accessible.
