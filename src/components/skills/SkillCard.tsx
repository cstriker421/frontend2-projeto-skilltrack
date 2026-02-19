"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Skill } from "@/lib/api/skills";
import { deleteSkill, purgeSkill, restoreSkill } from "@/lib/api/skills";

export default function SkillCard({
  skill,
  archived,
}: {
  skill: Skill;
  archived: boolean;
}) {
  const qc = useQueryClient();

  const archiveMut = useMutation({
    mutationFn: async () => deleteSkill(skill.id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const restoreMut = useMutation({
    mutationFn: async () => restoreSkill(skill.id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const purgeMut = useMutation({
    mutationFn: async () => purgeSkill(skill.id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const onArchive = useCallback(() => {
    if (archiveMut.isPending) return;
    if (
      confirm(
        `Archive "${skill.title}"?\n\nThis will hide it from your active skills.`
      )
    ) {
      archiveMut.mutate();
    }
  }, [archiveMut, skill.title]);

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
        {archived ? (
          <>
            <button
              onClick={() => restoreMut.mutate()}
              className="text-sm hover:underline disabled:opacity-50"
              disabled={restoreMut.isPending}
            >
              {restoreMut.isPending ? "Restoring…" : "Restore"}
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    `Permanently delete "${skill.title}"?\n\nThis cannot be undone.`
                  )
                ) {
                  purgeMut.mutate();
                }
              }}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
              disabled={purgeMut.isPending}
            >
              {purgeMut.isPending ? "Deleting…" : "Delete permanently"}
            </button>
          </>
        ) : (
          <>
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
              onClick={onArchive}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
              disabled={archiveMut.isPending}
            >
              {archiveMut.isPending ? "Archiving…" : "Archive"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
