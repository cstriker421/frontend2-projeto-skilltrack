"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data } = useSession();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          SkillTrack
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/skills">Skills</Link>

          {data?.user ? (
            <button
              className="rounded-md border px-3 py-1.5"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </button>
          ) : (
            <Link className="rounded-md border px-3 py-1.5" href="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
