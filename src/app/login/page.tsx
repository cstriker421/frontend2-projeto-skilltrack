"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <main className="mx-auto max-w-md px-4 py-16 animate-fade-up">
      <div className="rounded-lg border border-gray-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Sign in</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Enter your email to access your skills.
          </p>
        </div>

        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await signIn("credentials", { email, callbackUrl: "/dashboard" });
          }}
        >
          <input
            className="w-full rounded-md border border-gray-200 dark:border-zinc-700
              bg-white dark:bg-zinc-800 p-2.5
              text-gray-900 dark:text-zinc-50
              placeholder:text-gray-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500
              transition-colors"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button className="w-full rounded-md px-4 py-2.5 text-sm btn-primary">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}