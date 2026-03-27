"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const fieldCls =
  "w-full rounded-md border border-gray-200 dark:border-zinc-700 " +
  "bg-white dark:bg-zinc-800 p-2.5 " +
  "text-gray-900 dark:text-zinc-50 " +
  "placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 " +
  "transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 animate-fade-up">
      <div className="rounded-lg border border-gray-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 p-8 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register"
              className="text-orange-600 dark:text-orange-400 hover:underline">
              Register
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

          <div className="relative">
            <input
              className={fieldCls}
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300
                transition-colors text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            className="w-full rounded-md px-4 py-2.5 text-sm btn-primary"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}