"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Skill } from "@/lib/api/skills";
import { fetchSkill, updateSkill } from "@/lib/api/skills";

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
      updateSkill(skillId, {
        title,
        description: description || null,
        level,
        progress,
      }),
    onSuccess: async () => {
      // refresh lists + this skill
      await qc.invalidateQueries({ queryKey: ["skills"] }); // ok to be broad
      await qc.invalidateQueries({ queryKey: ["skill", skillId] });
      router.push("/skills");
    },
  });

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (isError) return <p className="p-4 text-red-600">Failed to load skill.</p>;
  if (!skill) return <p className="p-4">Skill not found.</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Edit skill</h1>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <input
          className="w-full rounded-md border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full rounded-md border p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className="rounded-md border p-2"
            value={level}
            onChange={(e) => setLevel(e.target.value as Skill["level"])}
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
          <p className="text-sm text-red-600">Failed to update skill.</p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => router.push("/skills")}
          >
            Cancel
          </button>

          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
