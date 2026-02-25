import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="space-y-4 animate-fade-up">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
          Skill<span className="text-orange-500">Track</span>
        </h1>
        <p className="max-w-2xl text-gray-500 dark:text-zinc-400">
          Track the skills you're learning, the resources you use, and your progress over time.
          Built with Next.js, TypeScript, Prisma, NextAuth, and React Query.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/dashboard" className="rounded-md px-4 py-2 text-sm btn-primary">
            Open dashboard
          </Link>
          <Link
            href="/skills"
            className="rounded-md border border-gray-200 dark:border-zinc-700 px-4 py-2 text-sm
              text-gray-900 dark:text-zinc-50
              hover:border-orange-300 dark:hover:border-orange-700
              hover:text-orange-600 dark:hover:text-orange-400
              transition-colors duration-150"
          >
            View skills
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3 animate-fade-up-delay">
        {[
          { title: "Plan",     body: "Create skills and attach learning resources." },
          { title: "Practice", body: "Update your progress as you learn—keep it lightweight." },
          { title: "Prove",    body: "Build a clear portfolio of what you've learned." },
        ].map(({ title, body }) => (
          <div
            key={title}
            className="rounded-lg border border-gray-200 dark:border-zinc-700
              bg-white dark:bg-zinc-900 p-4
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
              hover:border-orange-200 dark:hover:border-orange-900/50
              dark:hover:shadow-zinc-800/50"
          >
            <h2 className="font-medium text-gray-900 dark:text-zinc-50">{title}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}