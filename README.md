# EmailApp

A full-stack application for discovering remote programming and IT employers across Europe, built with **Next.js, React, TypeScript, PostgreSQL, Prisma, and Tailwind CSS**.

> 🚧 **Work in Progress**
>
> This project is under active development. Features, UI, and architecture may change as development continues.

## About the Project

EmailApp helps developers filter a shared company directory by specialization and region, then access relevant company contact information after creating and verifying an account.

The project is developed incrementally with a focus on:

- Clean and maintainable code
- Clear separation of UI, business, and database logic
- Secure authentication and account recovery
- Database design and migrations
- Server-side validation and authorization
- Reusable components and responsive UI
- Production-minded development practices

## Tech Stack

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript** with strict mode
- **Tailwind CSS**
- **PostgreSQL**
- **Prisma ORM**
- **Zod**
- **Nodemailer**
- **bcryptjs**
- **ESLint**
- **Prettier**

## Current Features

- Shared remote-company directory
- Filtering by programming specialization and European region or country
- Email and password registration
- Email verification and verification-email resend
- Login, logout, and database-backed sessions
- Account overview with email, verification status, and current plan
- Protected company contact details for verified users
- Secure password reset by email

## Planned Features

- A free contact allowance for each specialization
- A one-time paid Contact Pack with access to a larger contact catalog
- Application history for tracking contacted companies
- Email templates and a prompt builder for personalized messages
- CSV export

Planned limits, pricing, and feature details are not final and may change during development.

## Development Approach

- Server Components by default
- Client Components only for browser interactivity
- API Route Handlers for backend endpoints
- TypeScript strict mode
- Zod validation for input and environment variables
- Database logic kept outside routes and components
- Prisma migrations for versioned database changes
- Simple, readable architecture without unnecessary abstractions

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd email-app
```

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and configure these variables with your own values:

```ini
DATABASE_URL=your_postgresql_connection_string
APP_URL=http://localhost:3000
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SECURE=true_or_false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=your_sender_address
```

Apply the existing migrations to a new local database:

```bash
npx prisma migrate deploy
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Checks

```bash
npm run lint
npx tsc --noEmit
npx prettier --check . --end-of-line auto
npm run build
```

## Status

🚧 **In Development**

This repository is actively developed and is not yet considered production-ready.

## Author

**Srdjan Vasic**

Frontend / Full Stack Developer

- Portfolio: [srdjan-vasic.vercel.app](https://srdjan-vasic.vercel.app/)
- LinkedIn: [linkedin.com/in/srdjanvasic-dev](https://www.linkedin.com/in/srdjanvasic-dev/)
