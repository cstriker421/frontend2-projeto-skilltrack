"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "@/lib/api/skills";
import SkillCard from "@/components/skills/SkillCard";

export default function SkillsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/skills/new">
          New skill
        </Link>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">Failed to load skills.</p>}

      {!isLoading && data?.length === 0 && (
        <p className="text-neutral-600">No skills yet. Create your first one.</p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </ul>
    </div>
  );
}
