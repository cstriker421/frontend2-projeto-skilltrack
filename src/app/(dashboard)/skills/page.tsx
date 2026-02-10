"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type Skill = {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: number;
};

export default function SkillsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const res = await fetch("/api/skills");
      if (!res.ok) throw new Error("Failed to load skills");
      return res.json();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/skills/new">
          New skill
        </Link>
      </div>

      {isLoading ? <p>Loading…</p> : null}
      {isError ? <p className="text-red-600">Failed to load skills.</p> : null}

      {!isLoading && data?.length === 0 ? (
        <p className="text-neutral-600">No skills yet. Create your first one.</p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((s) => (
          <li key={s.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{s.title}</h2>
              <span className="text-xs text-neutral-600">{s.level}</span>
            </div>
            {s.description ? <p className="mt-2 text-sm text-neutral-600">{s.description}</p> : null}
            <p className="mt-3 text-sm">Progress: {s.progress}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
