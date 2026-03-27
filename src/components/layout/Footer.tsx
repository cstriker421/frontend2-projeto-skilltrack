export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-zinc-800
      bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col sm:flex-row
        items-center justify-between gap-2">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          © {year} SkillTrack. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Built with Next.js, Prisma, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}