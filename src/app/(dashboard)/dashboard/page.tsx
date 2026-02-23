"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSkills } from "@/lib/api/skills";
import type { Skill } from "@/lib/api/skills";

const LEVEL_ORDER: Skill["level"][] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LEVEL_COLORS: Record<Skill["level"], string> = {
  BEGINNER: "bg-emerald-500 dark:bg-emerald-400",
  INTERMEDIATE: "bg-amber-500 dark:bg-amber-400",
  ADVANCED: "bg-indigo-500 dark:bg-indigo-400",
};
const LEVEL_LABELS: Record<Skill["level"], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
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

    // Average per level
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

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-gray-500 dark:text-zinc-400">Overview of your learning progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Skills" value={stats.activeCount} />
        <StatCard label="Archived Skills" value={stats.archivedCount} />
        <StatCard label="Average Progress" value={`${stats.avgProgress}%`} />
        <StatCard label="Highest Skill" value={`${stats.highest}%`} />
      </div>

      {/* Overall Mastery */}
      <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
        <h2 className="text-lg font-medium text-gray-900 dark:text-zinc-50 mb-3">Overall Mastery</h2>
        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gray-900 dark:bg-indigo-500 progress-bar-fill transition-all duration-700"
            style={{ width: `${stats.avgProgress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Your average skill progress is {stats.avgProgress}%.
        </p>
      </div>

      {/* Per-level breakdown */}
      {stats.activeCount > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-zinc-50 mb-4">Progress by Level</h2>
          <div className="space-y-4">
            {stats.byLevel.map(({ level, avg, count }) =>
              count === 0 ? null : (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      {LEVEL_LABELS[level]}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                      {avg}% · {count} skill{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full progress-bar-fill ${LEVEL_COLORS[level]}`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/skills/new"
          className="rounded-md bg-gray-900 dark:bg-indigo-600 px-4 py-2 text-white
            hover:bg-gray-700 dark:hover:bg-indigo-500 transition-colors duration-150"
        >
          New Skill
        </Link>
        <Link
          href="/skills"
          className="rounded-md border border-gray-200 dark:border-zinc-700 px-4 py-2
            text-gray-900 dark:text-zinc-50 hover:bg-gray-50 dark:hover:bg-zinc-800
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
      transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-zinc-800/50">
      <p className="text-sm text-gray-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}