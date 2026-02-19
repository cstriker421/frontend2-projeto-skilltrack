"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSkills } from "@/lib/api/skills";

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
        : Math.round(
            active.reduce((sum, s) => sum + s.progress, 0) / active.length
          );

    const highest =
      active.length === 0
        ? 0
        : Math.max(...active.map((s) => s.progress));

    return {
      activeCount: active.length,
      archivedCount: archived.length,
      avgProgress,
      highest,
    };
  }, [activeQuery.data, archivedQuery.data]);

  if (activeQuery.isLoading || archivedQuery.isLoading) {
    return <p className="p-4">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-neutral-600">
          Overview of your learning progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Skills" value={stats.activeCount} />
        <StatCard label="Archived Skills" value={stats.archivedCount} />
        <StatCard label="Average Progress" value={`${stats.avgProgress}%`} />
        <StatCard label="Highest Skill" value={`${stats.highest}%`} />
      </div>

      {/* Progress Overview */}
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-medium mb-2">Overall Mastery</h2>

        <div className="h-3 w-full rounded bg-neutral-200 overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{ width: `${stats.avgProgress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-neutral-600">
          Your average skill progress is {stats.avgProgress}%.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/skills/new"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          New Skill
        </Link>

        <Link
          href="/skills"
          className="rounded-md border px-4 py-2"
        >
          View All Skills
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
