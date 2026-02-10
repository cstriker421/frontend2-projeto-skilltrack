"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Demo login (email only). We’ll secure it later if needed.
      </p>

      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", { email, callbackUrl: "/dashboard" });
        }}
      >
        <input
          className="w-full rounded-md border p-2"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button className="w-full rounded-md bg-black px-4 py-2 text-white">
          Sign in
        </button>
      </form>
    </main>
  );
}
