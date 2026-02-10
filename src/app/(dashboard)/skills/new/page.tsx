"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSkillPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: description || undefined, level, progress }),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
      router.push("/skills");
    },
  });

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Create skill</h1>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <input
          className="w-full rounded-md border p-2"
          placeholder="Skill title (e.g., TypeScript)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full rounded-md border p-2"
          placeholder="Description (optional)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className="rounded-md border p-2"
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <input
            className="flex-1 rounded-md border p-2"
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </div>

        {mutation.isError ? (
          <p className="text-sm text-red-600">Failed to create skill.</p>
        ) : null}

        <button
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving…" : "Create"}
        </button>
      </form>
    </div>
  );
}
