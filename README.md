# 🔥 SkillTrack

A personal learning and certification tracker. Track skills you're learning, attach resources, monitor progress, and build a clear picture of what you've mastered.

> Built with Next.js 16, TypeScript, Prisma, NextAuth, React Query, and Tailwind CSS.

🌐 **Live at:** [frontend2-projeto-skilltrack.vercel.app](https://frontend2-projeto-skilltrack.vercel.app)

---

## Features

- **Skill tracking** — create skills with a title, description, level (Beginner / Intermediate / Advanced), and a progress slider
- **Resources** — attach articles, videos, books, courses, and certifications to each skill
- **Dashboard** — live progress overview with overall mastery bar and per-level breakdown; 100% completion celebrations
- **Archive / restore** — soft-delete skills out of your active view without losing data
- **Sorting** — sort skills by category, progress, recency, or name
- **Avatar picker** — choose a personal icon from a preset set, persisted per user
- **Light / dark mode** — toggle persisted to `localStorage`, respects OS preference on first load
- **Authentication** — email-based credential login via NextAuth (passwordless)
- **Unit tests** — pure function test coverage via Vitest across sort logic and Zod validators

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Data fetching | TanStack React Query v5 |
| Styling | Tailwind CSS v4 |
| State | React Context API (theme) |
| Testing | Vitest |
| Hosting | Vercel + Neon |

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

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests cover:
- `src/lib/utils/sortSkills.ts` — all 8 sort modes including edge cases and stable tiebreakers
- `src/lib/validators/skill.ts` — skill create and update schema validation
- `src/lib/validators/resource.ts` — resource create schema validation

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/        # Protected routes: dashboard, skills, resources
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
│   ├── utils/              # sortSkills utility
│   └── validators/         # Zod schemas + colocated tests
└── types/
```

---

## Deployment

Hosted on [Vercel](https://vercel.com) with [Neon](https://neon.tech) as the PostgreSQL provider.

### Environment Variables (Production)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth JWT signing |
| `NEXTAUTH_URL` | Full URL of the deployed app |