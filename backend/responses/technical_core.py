data = {
    "categories": [
        {
            "triggers": [
                "git",
                "version control",
                "gitflow",
                "trunk",
                "control de versiones",
                "contrôle de version",
            ],
            "answers": {
                "en": [
                    'On version control, I\'m a big fan of **Trunk-based development** for smaller teams or fast-paced projects to keep CI/CD moving. However, I definitely see the value in **Gitflow** for managing complex releases and long-term maintenance.\n\n```bash\n# Example of a simple feature branch flow\ngit checkout -b feature/new-logic\ngit commit -m "Add new logic"\ngit checkout main\ngit merge feature/new-logic\n```',
                ],
                "es": [
                    "Sobre el control de versiones, soy fan del **Trunk-based development** para equipos pequeños o proyectos rápidos para mantener el flujo de CI/CD. Sin embargo, entiendo el valor de **Gitflow** para gestionar lanzamientos complejos y mantenimiento a largo plazo.",
                ],
                "fr": [
                    "Concernant le contrôle de version, je suis un adepte du **Trunk-based development** pour les petites équipes ou les projets rapides afin de maintenir le flux CI/CD. Cependant, je vois tout l'intérêt de **Gitflow** pour gérer des sorties complexes et la maintenance à long terme.",
                ],
            },
        },
        {
            "triggers": [
                "performance",
                "web vitals",
                "lcp",
                "fid",
                "cls",
                "rendimiento",
                "performances",
            ],
            "answers": {
                "en": [
                    "When it comes to performance, I always keep an eye on **Core Web Vitals**. Optimizing **LCP** (Largest Contentful Paint) and keeping **CLS** (Cumulative Layout Shift) low is crucial for a smooth user experience. I usually start with image optimization and code splitting.",
                ],
                "es": [
                    "En cuanto al rendimiento, siempre vigilo las **Core Web Vitals**. Optimizar el **LCP** (Largest Contentful Paint) y mantener bajo el **CLS** (Cumulative Layout Shift) es vital para una buena experiencia. Suelo empezar con optimización de imágenes y code splitting.",
                ],
                "fr": [
                    "Pour la performance, je garde toujours un œil sur les **Core Web Vitals**. Optimiser le **LCP** (Largest Contentful Paint) et maintenir un **CLS** (Cumulative Layout Shift) bas est crucial. Je commence généralement par l'optimisation des images et le fractionnement du code (code splitting).",
                ],
            },
        },
        {
            "triggers": [
                "security",
                "owasp",
                "vulnerability",
                "xss",
                "injection",
                "seguridad",
                "vulnerabilidad",
                "inyección",
                "sécurité",
                "vunérabilité",
                "injection",
            ],
            "answers": {
                "en": [
                    "Security is a priority from day one. I follow **OWASP** best practices, especially around input validation and avoiding common pitfalls like SQL injection or XSS. In this project, for example, I use SQLModel/Pydantic for safe data handling.",
                ],
                "es": [
                    "La seguridad es prioridad desde el primer día. Sigo las mejores prácticas de **OWASP**, especialmente en validación de entradas y evitando fallos comunes como inyección SQL o XSS. En este proyecto, uso SQLModel/Pydantic para un manejo seguro de datos.",
                ],
                "fr": [
                    "La sécurité est une priorité dès le début. Je suis les meilleures pratiques de l'**OWASP**, notamment sur la validation des entrées et l'évitement des pièges courants comme l'injection SQL ou le XSS. Dans ce projet, j'utilise SQLModel/Pydantic pour une manipulation sûre des données.",
                ],
            },
        },
        {
            "triggers": [
                "testing",
                "unit test",
                "integration test",
                "e2e",
                "pyramid",
                "pruebas",
                "test unitario",
                "test de integración",
                "pirámide",
                "test unitaire",
                "test d'intégration",
                "pyramide",
            ],
            "answers": {
                "en": [
                    "My testing philosophy follows the **Testing Pyramid**. I prioritize a solid base of unit tests for business logic, followed by integration tests for API contracts, and a few key E2E tests for critical user paths. It's about finding that sweet spot between confidence and speed.",
                ],
                "es": [
                    "Mi filosofía de pruebas sigue la **Pirámide de Pruebas**. Priorizo una base sólida de pruebas unitarias para la lógica de negocio, seguida de pruebas de integración para contratos de API y algunas pruebas E2E clave. Se trata de encontrar el equilibrio entre confianza y velocidad.",
                ],
                "fr": [
                    "Ma philosophie de test suit la **Pyramide des Tests**. Je privilégie une base solide de tests unitaires pour la logique métier, suivis de tests d'intégration pour les contrats d'API, et quelques tests E2E clés pour les parcours utilisateurs critiques. L'objectif est de trouver le juste milieu entre confiance et rapidité.",
                ],
            },
        },
    ]
}
