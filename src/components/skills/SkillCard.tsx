"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Skill } from "@/lib/api/skills";
import { deleteSkill, purgeSkill, restoreSkill } from "@/lib/api/skills";

const LEVEL_COLORS: Record<Skill["level"], string> = {
  BEGINNER: "bg-emerald-500 dark:bg-emerald-400",
  INTERMEDIATE: "bg-amber-500 dark:bg-amber-400",
  ADVANCED: "bg-indigo-500 dark:bg-indigo-400",
};

const LEVEL_BADGE: Record<Skill["level"], string> = {
  BEGINNER: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950",
  INTERMEDIATE: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
  ADVANCED: "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950",
};

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
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["skills"] }); },
  });

  const restoreMut = useMutation({
    mutationFn: async () => restoreSkill(skill.id),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["skills"] }); },
  });

  const purgeMut = useMutation({
    mutationFn: async () => purgeSkill(skill.id),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["skills"] }); },
  });

  const onArchive = useCallback(() => {
    if (archiveMut.isPending) return;
    if (confirm(`Archive "${skill.title}"?\n\nThis will hide it from your active skills.`)) {
      archiveMut.mutate();
    }
  }, [archiveMut, skill.title]);

  return (
    <li className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900
      p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
      dark:hover:shadow-zinc-800/50">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-gray-900 dark:text-zinc-50 truncate">{skill.title}</h2>
          {skill.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
              {skill.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_BADGE[skill.level]}`}>
            {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
            {skill.progress}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
        <div
          className={`h-full rounded-full progress-bar-fill ${LEVEL_COLORS[skill.level]}`}
          style={{ width: `${skill.progress}%` }}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        {archived ? (
          <>
            <button
              onClick={() => restoreMut.mutate()}
              disabled={restoreMut.isPending}
              className="text-sm text-gray-700 dark:text-zinc-300 hover:underline disabled:opacity-50 transition-opacity"
            >
              {restoreMut.isPending ? "Restoring…" : "Restore"}
            </button>
            <button
              onClick={() => {
                if (confirm(`Permanently delete "${skill.title}"?\n\nThis cannot be undone.`)) {
                  purgeMut.mutate();
                }
              }}
              disabled={purgeMut.isPending}
              className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 transition-opacity"
            >
              {purgeMut.isPending ? "Deleting…" : "Delete permanently"}
            </button>
          </>
        ) : (
          <>
            <Link
              className="text-sm text-gray-700 dark:text-zinc-300 hover:underline transition-colors"
              href={`/skills/${skill.id}/resources`}
            >
              Resources
            </Link>
            <Link
              className="text-sm text-gray-700 dark:text-zinc-300 hover:underline transition-colors"
              href={`/skills/${skill.id}/edit`}
            >
              Edit
            </Link>
            <button
              onClick={onArchive}
              disabled={archiveMut.isPending}
              className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 transition-opacity"
            >
              {archiveMut.isPending ? "Archiving…" : "Archive"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}