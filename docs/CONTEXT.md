# Project Context: Chatbot Portfolio

## The Vision

A multilingual (EN, FR, ES) interactive portfolio where the "Home" page is a Chatbot Assistant capable of answering questions about the developer's professional background.

## Layout & Design

- **Sidebar:** Contains Bio, Nav Links (Home, About, Experience, Projects, Contact), and a "Current Availability" indicator at the bottom.
- **Header:** Fixed global header present on all views.
- **Main Content:** Home (Chatbot) is the default view. Content switches based on navigation.
- **Theming:** Automatic system-level dark/light mode detection with manual override.

## Data Strategy

- **Frontend:** High-performance UI using Bun and React. Web3Forms handles contact logic.
- **Backend:** FastAPI service with a SQLModel (SQLAlchemy) data layer. It manages both visitor analytics and a lightweight CMS for Chatbot responses and Blog content.
- **CMS:** An Admin Dashboard (/admin) allows for real-time updates to the portfolio's knowledge base and technical notes without redeploying code.
