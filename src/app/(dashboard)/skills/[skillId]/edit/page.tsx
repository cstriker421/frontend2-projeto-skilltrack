"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Skill } from "@/lib/api/skills";
import { fetchSkill, updateSkill } from "@/lib/api/skills";

const fieldCls =
  "w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors";

const selectCls =
  "rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-2 " +
  "focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors";

export default function EditSkillPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: skill, isLoading, isError } = useQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkill(skillId),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<Skill["level"]>("BEGINNER");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!skill) return;
    setTitle(skill.title);
    setDescription(skill.description ?? "");
    setLevel(skill.level);
    setProgress(skill.progress);
  }, [skill]);

  const mutation = useMutation({
    mutationFn: async () =>
      updateSkill(skillId, { title, description: description || null, level, progress }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
      await qc.invalidateQueries({ queryKey: ["skill", skillId] });
      router.push("/skills");
    },
  });

  if (isLoading) return <p className="p-4 text-gray-500 dark:text-zinc-400">Loading…</p>;
  if (isError)   return <p className="p-4 text-red-600 dark:text-red-400">Failed to load skill.</p>;
  if (!skill)    return <p className="p-4 text-gray-500 dark:text-zinc-400">Skill not found.</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Edit skill</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Update details for <strong>{skill.title}</strong>.
        </p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      >
        <input
          className={fieldCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className={fieldCls}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className={selectCls}
            value={level}
            onChange={(e) => setLevel(e.target.value as Skill["level"])}
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
          <p className="text-sm text-red-600 dark:text-red-400">Failed to update skill.</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-200 dark:border-zinc-700 px-4 py-2 text-sm
              text-gray-900 dark:text-zinc-50
              hover:border-orange-300 dark:hover:border-orange-700
              hover:text-orange-600 dark:hover:text-orange-400
              transition-colors duration-150"
            onClick={() => router.push("/skills")}
          >
            Cancel
          </button>

          <button
            className="rounded-md px-4 py-2 text-sm btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}