"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Skill } from "@/lib/api/skills";
import { deleteSkill } from "@/lib/api/skills";

export default function SkillCard({ skill }: { skill: Skill }) {
  const qc = useQueryClient();

  const del = useMutation({
    mutationFn: async () => deleteSkill(skill.id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const onDelete = useCallback(() => {
    if (del.isPending) return;
    if (
      confirm(
        `Archive "${skill.title}"?\n\nThis will hide it from your active skills.`
      )
)
  del.mutate();

  }, [del, skill.title]);

  return (
    <li className="rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-medium">{skill.title}</h2>
          {skill.description ? (
            <p className="mt-1 text-sm text-neutral-600">{skill.description}</p>
          ) : null}
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-600">{skill.level}</div>
          <div className="mt-1 text-sm">{skill.progress}%</div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-3">
        <Link
          className="text-sm hover:underline"
          href={`/skills/${skill.id}/resources`}
        >
          Resources
        </Link>

        <Link
          className="text-sm hover:underline"
          href={`/skills/${skill.id}/edit`}
        >
          Edit
        </Link>

        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
          disabled={del.isPending}
        >
          {del.isPending ? "Archiving…" : "Archive"}
        </button>
      </div>
    </li>
  );
}
