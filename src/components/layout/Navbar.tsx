"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect, useCallback } from "react";

const AVATARS = ["🔥","🚀","⚡","🎯","📚","🧠","💡","🌱","🏆","⭐","🎓","🦉","🥇"];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150
        ${active
          ? "bg-orange-500 text-white"
          : "text-gray-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400"
        }`}
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

function AvatarPicker({
  currentAvatar,
  onSelect,
  onClose,
  email,
}: {
  currentAvatar: string;
  onSelect: (a: string) => void;
  onClose: () => void;
  email?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Closes on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Closes on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 z-50 rounded-xl
        border border-gray-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-900/60
        animate-fade-up p-3"
    >
      {/* Email label */}
      {email && (
        <p className="mb-2 truncate text-xs text-gray-400 dark:text-zinc-500 px-1">
          {email}
        </p>
      )}

      <p className="mb-2 text-xs font-medium text-gray-500 dark:text-zinc-400 px-1">
        Choose your icon
      </p>

      {/* Icon grid */}
      <div className="grid grid-cols-7 gap-1">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => { onSelect(a); onClose(); }}
            className={`flex items-center justify-center rounded-lg p-1.5 text-lg
              transition-all duration-150 hover:scale-110
              ${a === currentAvatar
                ? "bg-orange-100 dark:bg-orange-900/40 ring-2 ring-orange-400"
                : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            aria-label={`Select ${a}`}
          >
            {a}
          </button>
        ))}
      </div>

      <hr className="my-3 border-gray-100 dark:border-zinc-800" />

      <button
        onClick={() => { onClose(); signOut({ callbackUrl: "/" }); }}
        className="w-full rounded-lg px-3 py-2 text-left text-sm
          text-red-600 dark:text-red-400
          hover:bg-red-50 dark:hover:bg-red-950/30
          transition-colors duration-150"
      >
        Sign out
      </button>
    </div>
  );
}

export default function Navbar() {
  const { data, status, update } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentAvatar = (data?.user as any)?.avatar ?? "🔥";

  const handleSelectAvatar = useCallback(async (avatar: string) => {
    if (saving || avatar === currentAvatar) return;
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      });
      // Updates the session so the new avatar reflects immediately without reload
      await update({ avatar });
    } finally {
      setSaving(false);
    }
  }, [saving, currentAvatar, update]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">

        {/* Logo */}
        <Link href="/" className="font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-1.5">
          <img src="/icon.svg" className="w-5 h-5" alt="" />
          Skill<span className="text-orange-500">Track</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/skills" label="Skills" />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md border border-gray-200 dark:border-zinc-700 p-2
              text-gray-600 dark:text-zinc-400
              hover:border-orange-300 dark:hover:border-orange-700
              hover:text-orange-500 dark:hover:text-orange-400
              transition-colors duration-150"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {status === "loading" ? (
            <span className="text-sm text-gray-400 dark:text-zinc-500">…</span>
          ) : data?.user ? (
            /* Avatar button + picker */
            <div className="relative">
              <button
                onClick={() => setPickerOpen((o) => !o)}
                aria-label="Profile"
                className={`flex items-center justify-center w-9 h-9 rounded-full text-xl
                  border-2 transition-all duration-150 select-none
                  ${pickerOpen
                    ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30 scale-105"
                    : "border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700"
                  }
                  ${saving ? "opacity-60" : ""}`}
              >
                {currentAvatar}
              </button>

              {pickerOpen && (
                <AvatarPicker
                  currentAvatar={currentAvatar}
                  onSelect={handleSelectAvatar}
                  onClose={() => setPickerOpen(false)}
                  email={data.user.email ?? undefined}
                />
              )}
            </div>
          ) : (
            <Link className="rounded-md px-3 py-2 text-sm btn-primary" href="/login">
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}