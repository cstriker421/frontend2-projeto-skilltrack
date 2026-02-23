"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm transition-colors duration-150
        hover:bg-gray-100 dark:hover:bg-zinc-800
        ${active ? "bg-gray-100 dark:bg-zinc-800 font-medium" : ""}
      `}
    >
      {label}
    </Link>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

export default function Navbar() {
  const { data, status } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-semibold text-gray-900 dark:text-zinc-50">
          SkillTrack
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/skills" label="Skills" />
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md border border-gray-200 dark:border-zinc-700 p-2 text-gray-600 dark:text-zinc-400
              hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {status === "loading" ? (
            <span className="text-sm text-gray-400 dark:text-zinc-500">…</span>
          ) : data?.user ? (
            <>
              <span className="hidden text-sm text-gray-500 dark:text-zinc-400 sm:inline">
                {data.user.email}
              </span>
              <button
                className="rounded-md border border-gray-200 dark:border-zinc-700 px-3 py-2 text-sm
                  hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150
                  text-gray-900 dark:text-zinc-50"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="rounded-md border border-gray-200 dark:border-zinc-700 px-3 py-2 text-sm
                hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150
                text-gray-900 dark:text-zinc-50"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}