"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm hover:bg-neutral-100 ${
        active ? "bg-neutral-100 font-medium" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data, status } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-semibold">
          SkillTrack
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/skills" label="Skills" />
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="text-sm text-neutral-500">…</span>
          ) : data?.user ? (
            <>
              <span className="hidden text-sm text-neutral-600 sm:inline">
                {data.user.email}
              </span>
              <button
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
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
