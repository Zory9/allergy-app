# Allergen Free App

[![Main Pipeline](https://github.com/Zory9/allergy-app/actions/workflows/ci-cd-main.yml/badge.svg)](https://github.com/Zory9/allergy-app/actions/workflows/ci-cd-main.yml)
[![PR Checks](https://github.com/Zory9/allergy-app/actions/workflows/pull-request.yml/badge.svg)](https://github.com/Zory9/allergy-app/actions/workflows/pull-request.yml)

## About the Project

Allergen Free is a smart assistant, powered by OpenAI, which is designed to help users with food allergies make safer and more informed choices. 

The app allows users to:

- Ask questions about food safety using natural language.
-  Upload or take pictures of food to get allergy advice.
- Generate safe personalized recipes based on desired ingredients, cuisine, cooking time and mealtype.
- Modify existing recipes by suggesting safe replacements for allergens.

## Used Technologies

This project is a full-stack application built with:

- **Angular**&mdash;frontend;
- **Node.js**&mdash;backend;
- **PostgreSQL**&mdash;database;
- **Docker Compose**&mdash;for easy container orchestration, allowing to start the application and its services with a single command.

---

## Quick Start (Using Docker)

### Prerequisites

- Install [Docker](https://www.docker.com/get-started);
- Create an `.env` file with required secrets (see below).

---

### Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/Zory9/allergy-app.git
    cd allergy-app
    ```

2. Create an `.env` file with the required environment variables:
    ```bash
    cp .env.example .env
    ```

3. Edit the `.env` file and provide your actual secret values.

4. Start the app with Docker Compose:
    ```bash
    docker-compose up --build
    ```

5. Navigate to http://localhost:8080 to open the app in your browser.

## Database Info

The database is pre-populated from the `init.sql` database dump on first launch.

If you get a version mismatch error (e.g. “database files are incompatible”), run:
```bash
docker-compose down -v
docker-compose up --build
```

## Environment Variables

The app relies on several environment variables, which should be provided in an `.env` file:

- `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`&mdash;PostgreSQL credentials;
- `TELERIK_LICENSE`&mdash;Kendo UI for Angular license key;
- `OPENAI_API_KEY`&mdash;API key for accessing OpenAI services;
- `JWT_SECRET`&mdash;Secret used for JWT token signing.

## Useful Commands

```bash
# Rebuild and restart all services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove all volumes (will reset DB)
docker-compose down -v
```