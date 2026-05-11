import pytest
from httpx import AsyncClient
from sqlmodel import Session
from models import About, Experience, Project, BlogPost


@pytest.mark.asyncio
async def test_get_about(client: AsyncClient, db_session: Session):
    about = About(
        p1_en="P1 EN",
        p1_es="P1 ES",
        p1_fr="P1 FR",
        p2_en="P2 EN",
        p2_es="P2 ES",
        p2_fr="P2 FR",
        skills=["React"],
    )
    db_session.add(about)
    db_session.commit()

    response = await client.get("/api/v1/about")
    assert response.status_code == 200
    data = response.json()
    assert data["p1_en"] == "P1 EN"


@pytest.mark.asyncio
async def test_get_experience(client: AsyncClient, db_session: Session):
    exp = Experience(
        company="Tech Corp",
        role="Dev",
        period="2020",
        description_en=["desc"],
        description_es=["desc"],
        description_fr=["desc"],
        tech=["React"],
        order=1,
    )
    db_session.add(exp)
    db_session.commit()

    response = await client.get("/api/v1/experience")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == "Tech Corp"


@pytest.mark.asyncio
async def test_get_projects(client: AsyncClient, db_session: Session):
    project = Project(
        title="My Project",
        description_en="desc",
        description_es="desc",
        description_fr="desc",
        tech=["React"],
        github="http://github",
        order=1,
    )
    db_session.add(project)
    db_session.commit()

    response = await client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "My Project"


@pytest.mark.asyncio
async def test_get_blog(client: AsyncClient, db_session: Session):
    post = BlogPost(
        title_en="Post 1",
        title_es="Post 1",
        title_fr="Post 1",
        slug="post-1",
        date="2026-05-10",
        category="Tech",
        excerpt_en="excerpt",
        excerpt_es="excerpt",
        excerpt_fr="excerpt",
        content_en="content",
        content_es="content",
        content_fr="content",
        published=True,
    )
    db_session.add(post)
    db_session.commit()

    response = await client.get("/api/v1/blog")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title_en"] == "Post 1"
