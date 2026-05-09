import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import ChatbotResponseModel, BlogPostModel
from responses import (
    about,
    experience,
    projects,
    contact,
    fallback,
    greetings,
    thanks,
    fun,
    technical_core,
    technical_frontend,
    technical_backend,
    technical_devops,
    technical_behavioral,
    hr_assessment,
)

# Mock data for blog posts (copied from frontend/lib/mocks.ts manually for simplicity in this seed script)
BLOG_POSTS = [
    {
        "slug": "mastering-react-19",
        "date": "2026-05-10",
        "category": "Frontend",
        "title": {
            "en": "Mastering React 19: What You Need to Know",
            "es": "Dominando React 19: Lo que necesitas saber",
            "fr": "Maîtriser React 19 : ce que vous devez savoir",
        },
        "excerpt": {
            "en": "A deep dive into the new features of React 19, from Actions to the new compiler.",
            "es": "Una inmersión profunda en las nuevas características de React 19, desde Actions hasta el nuevo compilador.",
            "fr": "Une plongée profonde dans les nouvelles fonctionnalités de React 19, des Actions au nouveau compilateur.",
        },
        "content": {
            "en": "# React 19 is here...\n\nReact 19 brings a lot of improvements...",
            "es": "# React 19 ya está aquí...\n\nReact 19 trae muchas mejoras...",
            "fr": "# React 19 est là...\n\nReact 19 apporte de nombreuses améliorations...",
        },
    }
]


def seed_chatbot_responses():
    with Session(engine) as session:
        # Check if already seeded
        if session.exec(select(ChatbotResponseModel)).first():
            print("Chatbot responses already seeded.")
            return

        modules = [
            ("about", about),
            ("experience", experience),
            ("projects", projects),
            ("contact", contact),
            ("fallback", fallback),
            ("greetings", greetings),
            ("thanks", thanks),
            ("fun", fun),
            ("technical_core", technical_core),
            ("technical_frontend", technical_frontend),
            ("technical_backend", technical_backend),
            ("technical_devops", technical_devops),
            ("technical_behavioral", technical_behavioral),
            ("hr_assessment", hr_assessment),
        ]

        for name, module in modules:
            data = module.data
            if "categories" in data:
                for cat in data["categories"]:
                    resp = ChatbotResponseModel(
                        module=name,
                        category=cat.get("name") or cat.get("triggers")[0],
                        triggers=cat["triggers"],
                        answers_en=cat["answers"].get("en", []),
                        answers_es=cat["answers"].get("es", []),
                        answers_fr=cat["answers"].get("fr", []),
                    )
                    session.add(resp)
            else:
                resp = ChatbotResponseModel(
                    module=name,
                    triggers=data.get("triggers", []),
                    answers_en=data["answers"].get("en", []),
                    answers_es=data["answers"].get("es", []),
                    answers_fr=data["answers"].get("fr", []),
                )
                session.add(resp)

        session.commit()
        print("Chatbot responses seeded successfully.")


def seed_blog_posts():
    with Session(engine) as session:
        if session.exec(select(BlogPostModel)).first():
            print("Blog posts already seeded.")
            return

        for post in BLOG_POSTS:
            db_post = BlogPostModel(
                slug=post["slug"],
                date=post["date"],
                category=post["category"],
                title_en=post["title"]["en"],
                title_es=post["title"]["es"],
                title_fr=post["title"]["fr"],
                excerpt_en=post["excerpt"]["en"],
                excerpt_es=post["excerpt"]["es"],
                excerpt_fr=post["excerpt"]["fr"],
                content_en=post["content"]["en"],
                content_es=post["content"]["es"],
                content_fr=post["content"]["fr"],
            )
            session.add(db_post)

        session.commit()
        print("Blog posts seeded successfully.")


if __name__ == "__main__":
    create_db_and_tables()
    seed_chatbot_responses()
    seed_blog_posts()
