"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fieldCls =
  "w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors";

const selectCls =
  "rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-2 " +
  "focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors";

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
    <div className="mx-auto max-w-lg space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Create skill</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Add a new skill to track.</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      >
        <input
          className={fieldCls}
          placeholder="Skill title (e.g., TypeScript)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className={fieldCls}
          placeholder="Description (optional)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className={selectCls}
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <div className="flex-1 flex items-center gap-2">
            <input
              className={fieldCls}
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 w-10 text-right shrink-0">
              {progress}%
            </span>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">Failed to create skill.</p>
        )}

        <button
          className="rounded-md px-4 py-2 text-sm btn-primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving…" : "Create"}
        </button>
      </form>
    </div>
  );
}