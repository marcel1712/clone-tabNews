# clone-tabNews

> A full-stack clone of [TabNews](https://www.tabnews.com.br/) — built from scratch as part of [curso.dev](https://curso.dev) by Felipe Deschamps.

[![CI](https://github.com/marcel1712/clone-tabNews/actions/workflows/ci.yaml/badge.svg)](https://github.com/marcel1712/clone-tabNews/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-24-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://clone-tab-news-ashen.vercel.app)

**Live demo → [clone-tab-news-ashen.vercel.app](https://clone-tab-news-ashen.vercel.app)**

---

## About

This project is a production-grade clone of TabNews, a Brazilian developer community platform. It was built incrementally throughout **curso.dev**, a course focused on learning software engineering the right way, by building real things, making real mistakes, and understanding every layer of the stack.

The goal was never just to copy features. It was to deeply understand how a modern full-stack web application works end-to-end: from database migrations and REST API design to CI/CD pipelines, authentication, and deployment.

---

## Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| **Frontend**  | Next.js 16, React 19, SWR                  |
| **Backend**   | Next.js API Routes, next-connect           |
| **Database**  | PostgreSQL + node-pg-migrate               |
| **Auth**      | bcryptjs, cookie, UUID-based sessions      |
| **Email**     | Nodemailer                                 |
| **Testing**   | Jest (integration + unit), @faker-js/faker |
| **Linting**   | ESLint, Prettier                           |
| **Git Hooks** | Husky, Commitlint, Commitizen              |
| **Infra**     | Docker Compose                             |
| **CI/CD**     | GitHub Actions                             |
| **Deploy**    | Vercel                                     |

---

## Key Engineering Decisions

- **Database migrations** managed with `node-pg-migrate` — every schema change is versioned and reproducible.
- **Integration tests run against a real database** spun up via Docker, not mocks — ensuring tests reflect production behavior.
- **CI pipeline** on GitHub Actions runs linting, secret detection, and the full test suite on every push.
- **Conventional commits** enforced with Commitlint + Commitizen to keep git history readable and meaningful.
- **`async-retry`** used for resilient service startup — the app waits for Postgres to be ready before running migrations.

---

## Getting Started

### Prerequisites

- [Node.js 24](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/marcel1712/clone-tabNews.git
cd clone-tabNews

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

This single command:

1. Starts PostgreSQL via Docker Compose
2. Waits for the database to be ready
3. Runs pending migrations
4. Starts the Next.js dev server at [http://localhost:3000](http://localhost:3000)

### Running tests

```bash
# Run the full test suite (integration + unit)
npm test

# Watch mode for development
npm run test:watch
```

---

## Project Structure

```
clone-tabNews/
├── .github/
│   └── workflows/        # CI/CD pipeline (GitHub Actions)
├── .husky/               # Git hooks (pre-commit, commit-msg)
├── infra/
│   ├── compose.yaml      # Docker Compose for local PostgreSQL
│   ├── migrations/       # node-pg-migrate migration files
│   └── scripts/          # Utility scripts (e.g. wait-for-postgres)
├── models/               # Business logic / data access layer
├── pages/
│   ├── api/v1/           # REST API endpoints
│   └── ...               # Next.js pages
└── test/                 # Integration and unit tests
```

---

## Available Scripts

| Command                       | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `npm run dev`                 | Start development server (with DB + migrations) |
| `npm test`                    | Run full test suite                             |
| `npm run test:watch`          | Run tests in watch mode                         |
| `npm run migrations:create`   | Create a new migration file                     |
| `npm run migrations:up`       | Apply pending migrations                        |
| `npm run migrations:up:dry`   | Preview migrations without applying             |
| `npm run lint:prettier:check` | Check code formatting                           |
| `npm run lint:prettier:fix`   | Auto-fix formatting                             |
| `npm run lint:eslint:check`   | Run ESLint                                      |
| `npm run services:up`         | Start Docker services                           |
| `npm run services:stop`       | Stop Docker services                            |
| `npm run commit`              | Interactive conventional commit prompt          |

---

## CI/CD

Every push triggers a GitHub Actions workflow that:

1. Checks out the code and sets up Node.js 24
2. Installs dependencies
3. Runs ESLint and Prettier checks
4. Spins up PostgreSQL via Docker
5. Runs the full integration test suite

This ensures the `main` branch is always in a deployable state. Successful builds on `main` are automatically deployed to Vercel.

---

## What I Learned

This project was built over many months and covered far more than just "writing code":

- How to design a REST API with versioning (`/api/v1/...`)
- Database schema design and migration strategies
- Writing meaningful integration tests against real infrastructure
- Debugging CI failures (race conditions, environment differences)
- Secure authentication with hashed passwords and session cookies
- Git discipline: conventional commits, branch strategy, PR reviews

---

## Acknowledgements

Built following [curso.dev](https://curso.dev) by [Felipe Deschamps](https://github.com/filipedeschamps). The course teaches software engineering through deliberate practice on a real project, this repo is the result of that process.

---

## License

[MIT](./LICENSE)
