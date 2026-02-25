"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSkills } from "@/lib/api/skills";
import type { Skill } from "@/lib/api/skills";

const LEVEL_ORDER: Skill["level"][] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

// Distinct from orange primary: emerald → sky → violet
const LEVEL_COLORS: Record<Skill["level"], string> = {
  BEGINNER:     "bg-emerald-500 dark:bg-emerald-400",
  INTERMEDIATE: "bg-sky-500 dark:bg-sky-400",
  ADVANCED:     "bg-violet-500 dark:bg-violet-400",
};

const LEVEL_LABELS: Record<Skill["level"], string> = {
  BEGINNER:     "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED:     "Advanced",
};

const LEVEL_COMPLETE_MSG: Record<Skill["level"], string> = {
  BEGINNER:     "All beginner skills mastered!",
  INTERMEDIATE: "Intermediate level conquered!",
  ADVANCED:     "Advanced mastery achieved!",
};

export default function DashboardPage() {
  const activeQuery = useQuery({
    queryKey: ["skills", { archived: false }],
    queryFn: () => fetchSkills(false),
  });
  const archivedQuery = useQuery({
    queryKey: ["skills", { archived: true }],
    queryFn: () => fetchSkills(true),
  });

  const stats = useMemo(() => {
    const active = activeQuery.data ?? [];
    const archived = archivedQuery.data ?? [];

    const avgProgress =
      active.length === 0
        ? 0
        : Math.round(active.reduce((sum, s) => sum + s.progress, 0) / active.length);

    const highest = active.length === 0 ? 0 : Math.max(...active.map((s) => s.progress));

    const byLevel = LEVEL_ORDER.map((level) => {
      const group = active.filter((s) => s.level === level);
      const avg =
        group.length === 0
          ? null
          : Math.round(group.reduce((sum, s) => sum + s.progress, 0) / group.length);
      return { level, avg, count: group.length };
    });

    return { activeCount: active.length, archivedCount: archived.length, avgProgress, highest, byLevel };
  }, [activeQuery.data, archivedQuery.data]);

  if (activeQuery.isLoading || archivedQuery.isLoading) {
    return <p className="p-4 text-gray-500 dark:text-zinc-400">Loading dashboard…</p>;
  }

  const overallComplete = stats.activeCount > 0 && stats.avgProgress === 100;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-gray-500 dark:text-zinc-400">Overview of your learning progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Skills"   value={stats.activeCount} />
        <StatCard label="Archived Skills" value={stats.archivedCount} />
        <StatCard label="Average Progress" value={`${stats.avgProgress}%`} />
        <StatCard label="Highest Skill"   value={`${stats.highest}%`} />
      </div>

      {/* Overall Mastery */}
      <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
        <h2 className="text-lg font-medium text-gray-900 dark:text-zinc-50 mb-3">Overall Mastery</h2>

        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700
              ${overallComplete
                ? "bar-complete"
                : "progress-bar-fill bg-gradient-to-r from-orange-400 to-orange-600"
              }`}
            style={{ width: `${stats.avgProgress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Your average skill progress is {stats.avgProgress}%.
        </p>

        {/* Grand celebration */}
        {overallComplete && (
          <div className="celebrate-banner mt-4 flex items-center gap-3 rounded-lg
            bg-gradient-to-r from-orange-50 to-amber-50
            dark:from-orange-950/40 dark:to-amber-950/40
            border border-orange-200 dark:border-orange-800 px-4 py-3">
            <span className="trophy-pulse text-2xl">🏆</span>
            <div>
              <p className="font-semibold text-orange-700 dark:text-orange-300">
                Full Mastery Unlocked!
              </p>
              <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
                Every skill at 100%. You've mastered your entire skill set.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Per-level breakdown */}
      {stats.activeCount > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-zinc-50 mb-4">
            Progress by Level
          </h2>
          <div className="space-y-5">
            {stats.byLevel.map(({ level, avg, count }) => {
              if (count === 0) return null;
              const isComplete = avg === 100;
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {LEVEL_LABELS[level]}
                      </span>
                      {isComplete && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full
                          bg-amber-100 dark:bg-amber-900/40
                          text-amber-700 dark:text-amber-300
                          animate-fade-up">
                          ✦ Complete
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                      {avg}% · {count} skill{count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full
                        ${isComplete ? "bar-complete" : `progress-bar-fill ${LEVEL_COLORS[level]}`}`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>

                  {isComplete && (
                    <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 animate-fade-up">
                      🎉 {LEVEL_COMPLETE_MSG[level]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/skills/new"
          className="rounded-md px-4 py-2 text-sm btn-primary"
        >
          New Skill
        </Link>
        <Link
          href="/skills"
          className="rounded-md border border-gray-200 dark:border-zinc-700 px-4 py-2 text-sm
            text-gray-900 dark:text-zinc-50
            hover:border-orange-300 dark:hover:border-orange-700
            hover:text-orange-600 dark:hover:text-orange-400
            transition-colors duration-150"
        >
          View All Skills
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4
      transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200
      dark:hover:shadow-zinc-800/50 dark:hover:border-orange-900/50">
      <p className="text-sm text-gray-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}