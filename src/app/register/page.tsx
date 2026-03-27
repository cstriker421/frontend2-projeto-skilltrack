"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const fieldCls =
  "w-full rounded-md border border-gray-200 dark:border-zinc-700 " +
  "bg-white dark:bg-zinc-800 p-2.5 " +
  "text-gray-900 dark:text-zinc-50 " +
  "placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 " +
  "transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 animate-fade-up">
      <div className="rounded-lg border border-gray-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 p-8 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login"
              className="text-orange-600 dark:text-orange-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className={fieldCls}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <input
            className={fieldCls}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 8 characters)"
            autoComplete="new-password"
          />
          <input
            className={fieldCls}
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            className="w-full rounded-md px-4 py-2.5 text-sm btn-primary"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}