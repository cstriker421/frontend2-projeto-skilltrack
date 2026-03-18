"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "@/lib/api/skills";
import type { Skill } from "@/lib/api/skills";
import SkillCard from "@/components/skills/SkillCard";
import { useState, useMemo } from "react";
import { sortSkills } from "@/lib/utils/sortSkills";
import type { SortKey } from "@/lib/utils/sortSkills";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "category-asc",  label: "Category (Beginner first)" },
  { value: "category-desc", label: "Category (Advanced first)" },
  { value: "progress-desc", label: "Progress (Highest first)" },
  { value: "progress-asc",  label: "Progress (Lowest first)" },
  { value: "recent",        label: "Most recent" },
  { value: "oldest",        label: "Oldest" },
  { value: "name-asc",      label: "Name (A → Z)" },
  { value: "name-desc",     label: "Name (Z → A)" },
];

// Component
export default function SkillsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("category-asc");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["skills", { archived: showArchived }],
    queryFn: () => fetchSkills(showArchived),
  });

  const sorted = useMemo(
    () => sortSkills(data ?? [], sortKey),
    [data, sortKey]
  );

  return (
    <div className="space-y-4 animate-fade-up">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {showArchived ? "Archived skills" : "Active skills"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ── Sliding pill toggle ── */}
          <div
            className="relative flex items-center rounded-lg border border-gray-200
              dark:border-zinc-700 p-1"
          >
            {/* Sliding background pill uses left/right so position is exact */}
            <button
              className={`text-center rounded-md px-4 py-1.5 text-sm font-medium w-24
                transition-all duration-200
                ${!showArchived
                  ? "btn-primary"
                  : "text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400"
                }`}
              onClick={() => setShowArchived(false)}
            >
              Active
            </button>
            <button
              className={`text-center rounded-md px-4 py-1.5 text-sm font-medium w-24
                transition-all duration-200
                ${showArchived
                  ? "btn-primary"
                  : "text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400"
                }`}
              onClick={() => setShowArchived(true)}
            >
              Archived
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            className="rounded-lg border border-gray-200 dark:border-zinc-700
              bg-white dark:bg-zinc-900 px-3 py-2 text-sm
              text-gray-700 dark:text-zinc-300
              focus:outline-none focus:ring-2 focus:ring-orange-400
              transition-colors"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Sort skills"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* New skill fades in/out with the Active tab */}
          <div
            className={`transition-all duration-200 overflow-hidden
              ${!showArchived ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}`}
          >
            <Link
              className="block whitespace-nowrap rounded-md px-3 py-2 text-sm btn-primary"
              href="/skills/new"
              tabIndex={showArchived ? -1 : 0}
            >
              New skill
            </Link>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-gray-500 dark:text-zinc-400">Loading…</p>}
      {isError   && <p className="text-red-600 dark:text-red-400">Failed to load skills.</p>}

      {!isLoading && sorted.length === 0 && (
        <p className="text-gray-500 dark:text-zinc-400">
          {showArchived
            ? "No archived skills yet."
            : "No skills yet. Create your first one."}
        </p>
      )}

      <ul className="grid gap-5 sm:grid-cols-2">
        {sorted.map((skill) => (
          <SkillCard key={skill.id} skill={skill} archived={showArchived} />
        ))}
      </ul>
    </div>
  );
}