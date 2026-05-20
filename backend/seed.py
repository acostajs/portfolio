import json
from pathlib import Path
from sqlalchemy.exc import OperationalError
from sqlmodel import Session, select
from database import engine
from models import About, Experience, Project, BlogPost, ChatTriggerResponse

FIXTURES_DIR = Path(__file__).parent / "responses" / "fixtures"


def load_fixture(filename: str):
    with open(FIXTURES_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def upsert_about(session: Session):
    print("Upserting About...")
    existing = session.exec(select(About)).first()
    about_data = load_fixture("content_about.json")

    if existing:
        for key, value in about_data.items():
            setattr(existing, key, value)
        session.add(existing)
    else:
        session.add(About.model_validate(about_data))


def upsert_experience(session: Session):
    print("Upserting Experience...")
    experiences = load_fixture("content_experience.json")

    for exp_data in experiences:
        existing = session.exec(
            select(Experience).where(
                Experience.company == exp_data["company"],
                Experience.role == exp_data["role"],
            )
        ).first()
        if existing:
            for key, value in exp_data.items():
                setattr(existing, key, value)
            session.add(existing)
        else:
            session.add(Experience.model_validate(exp_data))


def upsert_projects(session: Session):
    print("Upserting Projects...")
    projects = load_fixture("content_projects.json")

    for proj_data in projects:
        existing = session.exec(
            select(Project).where(Project.title == proj_data["title"])
        ).first()
        if existing:
            for key, value in proj_data.items():
                setattr(existing, key, value)
            session.add(existing)
        else:
            session.add(Project.model_validate(proj_data))


def upsert_blog(session: Session):
    print("Upserting Blog...")
    posts = load_fixture("content_blog.json")

    for post_data in posts:
        existing = session.exec(
            select(BlogPost).where(BlogPost.slug == post_data["slug"])
        ).first()
        if existing:
            for key, value in post_data.items():
                setattr(existing, key, value)
            session.add(existing)
        else:
            session.add(BlogPost.model_validate(post_data))


def upsert_chat_triggers(session: Session):
    print("Upserting Chat Triggers...")
    modules = [
        "technical_behavioral",
        "hr_assessment",
        "projects",
        "experience",
        "technical_frontend",
        "technical_backend",
        "technical_devops",
        "technical_core",
        "contact",
        "about",
        "greetings",
        "thanks",
        "fun",
        "fallback",
    ]

    for mod_name in modules:
        try:
            mod_data = load_fixture(f"{mod_name}.json")
        except FileNotFoundError:
            print(f"Skipping missing fixture: {mod_name}.json")
            continue

        if "categories" in mod_data:
            for idx, cat in enumerate(mod_data["categories"]):
                cat_name = cat.get("name") or (
                    cat["triggers"][0] if cat["triggers"] else f"{mod_name}_{idx}"
                )
                existing = session.exec(
                    select(ChatTriggerResponse).where(
                        ChatTriggerResponse.module == mod_name,
                        ChatTriggerResponse.category == cat_name,
                    )
                ).first()
                trigger_data = {
                    "module": mod_name,
                    "category": cat_name,
                    "triggers": cat["triggers"],
                    "answers_en": cat["answers"]["en"],
                    "answers_es": cat["answers"]["es"],
                    "answers_fr": cat["answers"]["fr"],
                }
                if existing:
                    for key, value in trigger_data.items():
                        setattr(existing, key, value)
                    session.add(existing)
                else:
                    session.add(ChatTriggerResponse.model_validate(trigger_data))
        else:
            existing = session.exec(
                select(ChatTriggerResponse).where(
                    ChatTriggerResponse.module == mod_name,
                    ChatTriggerResponse.category == None,  # noqa: E711
                )
            ).first()
            trigger_data = {
                "module": mod_name,
                "category": None,
                "triggers": mod_data.get("triggers", []),
                "answers_en": mod_data.get("answers", {}).get("en", []),
                "answers_es": mod_data.get("answers", {}).get("es", []),
                "answers_fr": mod_data.get("answers", {}).get("fr", []),
            }
            if existing:
                for key, value in trigger_data.items():
                    setattr(existing, key, value)
                session.add(existing)
            else:
                session.add(ChatTriggerResponse.model_validate(trigger_data))


def seed():
    with Session(engine) as session:
        try:
            session.exec(select(About)).first()
        except OperationalError:
            print("WARNING: Database tables do not exist yet. Skipping seeding.")
            return

        upsert_about(session)
        upsert_experience(session)
        upsert_projects(session)
        upsert_blog(session)
        upsert_chat_triggers(session)
        session.commit()
        print("Database seeded successfully from JSON fixtures!")


if __name__ == "__main__":
    seed()
