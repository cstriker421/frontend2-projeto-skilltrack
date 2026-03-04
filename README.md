# 🔥 SkillTrack

A personal learning and certification tracker. Track skills you're learning, attach resources, monitor progress, and build a clear picture of what you've mastered.

> Built with Next.js 16, TypeScript, Prisma, NextAuth, React Query, and Tailwind CSS.

---

## Features

- **Skill tracking** — create skills with a title, description, level (Beginner / Intermediate / Advanced), and a progress slider
- **Resources** — attach articles, videos, books, courses, and certifications to each skill
- **Dashboard** — live progress overview with overall mastery bar and per-level breakdown; 100% completion celebrations
- **Archive / restore** — soft-delete skills out of your active view without losing data
- **Sorting** — sort skills by category, progress, recency, or name
- **Avatar picker** — choose a personal icon from a preset set, persisted per user
- **Light / dark mode** — toggle persisted to `localStorage`, respects OS preference on first load
- **Authentication** — email-based credential login via NextAuth (demo/passwordless)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite (local) via Prisma ORM |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Data fetching | TanStack React Query v5 |
| Styling | Tailwind CSS v4 |
| State | React Context API (theme) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/        # Protected routes: dashboard, skills, resources
│   ├── (public)/           # Public landing page
│   ├── api/                # API routes (skills, resources, profile, auth)
│   └── login/              # Login page
├── components/
│   ├── layout/             # Navbar, Providers
│   └── skills/             # SkillCard
├── context/
│   └── ThemeContext.tsx     # Light/dark mode context
├── lib/
│   ├── api/                # Client-side fetch helpers
│   ├── auth/               # NextAuth config
│   ├── db/                 # Prisma client
│   └── validators/         # Zod schemas
└── types/
```

---

## Deploying to Production

The easiest path is [Vercel](https://vercel.com) with a hosted Postgres database (e.g. Vercel Postgres or Supabase). Steps:

1. Swap the `datasource` block in `prisma/schema.prisma` from `sqlite` to `postgresql`
2. Update `DATABASE_URL` in your environment to the hosted connection string
3. Run `npx prisma migrate deploy`
4. Push to GitHub and import the repo into Vercel

---

## Roadmap

- [ ] Unit tests (Vitest)
- [ ] Public profile page (`/[username]`)
- [ ] Resource status progress surfaced on skill cards
- [ ] Hosted deployment (Vercel + Postgres)