from sqlmodel import Session, select
from database import engine
from models import About, Experience, Project, BlogPost, ChatTriggerResponse
import responses.about as about_resp
import responses.experience as exp_resp
import responses.projects as proj_resp
import responses.contact as contact_resp
import responses.greetings as greetings_resp
import responses.thanks as thanks_resp
import responses.fun as fun_resp
import responses.technical_core as tech_core
import responses.technical_frontend as tech_fe
import responses.technical_backend as tech_be
import responses.technical_devops as tech_dev
import responses.technical_behavioral as tech_beh
import responses.hr_assessment as hr_ass


def upsert_about(session: Session):
    print("Upserting About...")
    existing = session.exec(select(About)).first()
    about_data = {
        "p1_en": "I'm a passionate Web Developer based in Montréal, dedicated to building clean, efficient, and user-centric web applications.",
        "p1_es": "Soy un apasionado Desarrollador Web con sede en Montréal, dedicado a construir aplicaciones web limpias, eficientes y centradas en el usuario.",
        "p1_fr": "Je suis un développeur web passionné basé à Montréal, dédié à la création d' applications web propres, efficaces et centrées sur l'utilisateur.",
        "p2_en": "My journey in tech is driven by a curiosity for solving complex problems and a desire to create digital experiences that make a difference.",
        "p2_es": "Mi viaje en la tecnología está impulsado por la curiosidad de resolver problemas complejos y el deseo de crear experiencias digitales que marquen la diferencia.",
        "p2_fr": "Mon parcours dans la technologie est guidé par une curiosité pour la résolution de problèmes complexes et un désir de créer des expériences numériques qui font la différence.",
        "skills": [
            "TypeScript",
            "React",
            "Bun",
            "Tailwind CSS",
            "FastAPI",
            "Python",
            "PostgreSQL",
            "Docker",
        ],
    }

    if existing:
        for key, value in about_data.items():
            setattr(existing, key, value)
        session.add(existing)
    else:
        session.add(About.model_validate(about_data))


def upsert_experience(session: Session):
    print("Upserting Experience...")
    experiences = [
        {
            "company": "Freelance",
            "role": "Full-Stack Developer",
            "period": "2023 - Present",
            "description_en": [
                "Building high-performance web applications using React and FastAPI.",
                "Optimizing frontend performance with Bun and Vite.",
                "Implementing AI-driven features and chatbots.",
            ],
            "description_es": [
                "Construyendo aplicaciones web de alto rendimiento utilizando React y FastAPI.",
                "Optimizando el rendimiento del frontend con Bun y Vite.",
                "Implementando funciones impulsadas por IA y chatbots.",
            ],
            "description_fr": [
                "Construction d'applications web performantes avec React et FastAPI.",
                "Optimisation des performances frontend avec Bun et Vite.",
                "Mise en œuvre de fonctionnalités pilotées par l'IA et de chatbots.",
            ],
            "tech": ["React", "FastAPI", "Bun", "OpenAI"],
            "order": 1,
        }
    ]

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
    projects = [
        {
            "title": "AI Portfolio",
            "description_en": "A multilingual interactive portfolio with an AI chatbot assistant.",
            "description_es": "Un portafolio interactivo multilingüe con un asistente de chatbot de IA.",
            "description_fr": "Un portfolio interactif multilingue avec un assistant chatbot IA.",
            "tech": ["React", "FastAPI", "Tailwind CSS", "Bun"],
            "github": "https://github.com/juan/portfolio",
            "order": 1,
        }
    ]

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
    posts = [
        {
            "slug": "mastering-react-19",
            "date": "2026-05-01",
            "category": "Frontend",
            "title_en": "Mastering React 19 Features",
            "title_es": "Dominando las funciones de React 19",
            "title_fr": "Maîtriser les fonctionnalités de React 19",
            "excerpt_en": "A deep dive into the latest features of React 19 and how they improve performance.",
            "excerpt_es": "Una inmersión profunda en las últimas funciones de React 19 y cómo mejoran el rendimiento.",
            "excerpt_fr": "Une plongée profonde dans les dernières fonctionnalités de React 19 et comment elles améliorent les performances.",
            "content_en": "React 19 introduces several game-changing features like **Actions**, **Optimistic Updates**, and improved support for **Server Components**. \n\n```tsx\n// Example of a basic Action\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nThese features simplify state management and improve the developer experience significantly.",
            "content_es": "React 19 presenta varias funciones revolucionarias como **Actions**, **Actualizaciones optimistas** y un soporte mejorado para **Server Components**. \n\n```tsx\n// Ejemplo de una Acción básica\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nEstas funciones simplifican la gestión del estado y mejoran significativamente la experiencia del desarrollador.",
            "content_fr": "React 19 introduit plusieurs fonctionnalités révolutionnaires telles que les **Actions**, les **mises à jour optimistes** et un support amélioré pour les **composants serveur**. \n\n```tsx\n// Exemple d'une Action de base\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nCes fonctionnalités simplifient la gestion de l'état et améliorent considérablement l'expérience du développeur.",
        }
    ]

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
        ("technical_behavioral", tech_beh.data),
        ("hr_assessment", hr_ass.data),
        ("projects", proj_resp.data),
        ("experience", exp_resp.data),
        ("technical_frontend", tech_fe.data),
        ("technical_backend", tech_be.data),
        ("technical_devops", tech_dev.data),
        ("technical_core", tech_core.data),
        ("contact", contact_resp.data),
        ("about", about_resp.data),
        ("greetings", greetings_resp.data),
        ("thanks", thanks_resp.data),
        ("fun", fun_resp.data),
    ]

    for mod_name, mod_data in modules:
        if "categories" in mod_data:
            for idx, cat in enumerate(mod_data["categories"]):
                # Use provided name, or fallback to first trigger, or module_index
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
                "triggers": mod_data["triggers"],
                "answers_en": mod_data["answers"]["en"],
                "answers_es": mod_data["answers"]["es"],
                "answers_fr": mod_data["answers"]["fr"],
            }
            if existing:
                for key, value in trigger_data.items():
                    setattr(existing, key, value)
                session.add(existing)
            else:
                session.add(ChatTriggerResponse.model_validate(trigger_data))


def seed():
    with Session(engine) as session:
        upsert_about(session)
        upsert_experience(session)
        upsert_projects(session)
        upsert_blog(session)
        upsert_chat_triggers(session)
        session.commit()
        print("Database seeded successfully with Upsert pattern!")


if __name__ == "__main__":
    seed()
