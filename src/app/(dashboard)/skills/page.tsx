"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "@/lib/api/skills";
import SkillCard from "@/components/skills/SkillCard";
import { useState } from "react";

export default function SkillsPage() {
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["skills", { archived: showArchived }],
    queryFn: () => fetchSkills(showArchived),
  });

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {showArchived ? "Archived skills" : "Active skills"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active / Archived pill toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-zinc-700 p-1 gap-1">
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150
                ${!showArchived
                  ? "btn-primary"
                  : "text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              onClick={() => setShowArchived(false)}
            >
              Active
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150
                ${showArchived
                  ? "btn-primary"
                  : "text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              onClick={() => setShowArchived(true)}
            >
              Archived
            </button>
          </div>

          {!showArchived && (
            <Link
              className="rounded-md px-3 py-2 text-sm btn-primary"
              href="/skills/new"
            >
              New skill
            </Link>
          )}
        </div>
      </div>

      {isLoading && <p className="text-gray-500 dark:text-zinc-400">Loading…</p>}
      {isError && <p className="text-red-600 dark:text-red-400">Failed to load skills.</p>}

      {!isLoading && data?.length === 0 && (
        <p className="text-gray-500 dark:text-zinc-400">
          {showArchived ? "No archived skills yet." : "No skills yet. Create your first one."}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((skill) => (
          <SkillCard key={skill.id} skill={skill} archived={showArchived} />
        ))}
      </ul>
    </div>
  );
}