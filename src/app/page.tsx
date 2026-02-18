import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          SkillTrack
        </h1>
        <p className="max-w-2xl text-neutral-600">
          Track the skills you’re learning, the resources you use, and your progress over time.
          Built with Next.js, TypeScript, Prisma, NextAuth, and React Query.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            Open dashboard
          </Link>
          <Link
            href="/skills"
            className="rounded-md border px-4 py-2"
          >
            View skills
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Plan</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Create skills and attach learning resources.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Practice</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Update your progress as you learn—keep it lightweight.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Prove</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Build a clear portfolio of what you've learned.
          </p>
        </div>
      </section>
    </main>
  );
}
