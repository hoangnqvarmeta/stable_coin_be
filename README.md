# Installation
---

## Table of Contents <!-- omit in toc -->

- [Environment set up](#environment-set-up)
- [Comfortable development](#comfortable-development)

---

## Environment set up

- Docker
- Node.js v20


## Comfortable development

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/hoangnqvarmeta/stable_coin_be.git my-app
   ```

1. Go to folder, and copy `env-example-relational` as `.env`.

   ```bash
   cd my-app/
   cp env-example-relational .env
   ```

    Ensure to edit the .env file to set up your database credentials and other configuration parameters according to your environment.

1. Run additional container:

   ```bash
   docker compose up -d
   ```

    This command will build and start your containers as defined in your docker-compose.yml file.

1. Install dependency

   ```bash
   npm install
   ```

1. Run migrations

   ```bash
   npm run migration:run
   ```

1. Run seeds

   ```bash
   npm run seed:run:relational
   ```

1. Run app in dev mode

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000/docs>

    This URL will lead you to the API documentation, where you can explore the available endpoints and their usage.

    Feel free to copy and use this Markdown content as needed! Let me know if you would like any further modifications or additions.

---
