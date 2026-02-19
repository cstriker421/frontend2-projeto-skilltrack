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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Skills</h1>
          <p className="text-sm text-neutral-600">
            {showArchived ? "Archived skills" : "Active skills"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              className={`rounded-md border px-3 py-2 text-sm ${
                !showArchived ? "bg-neutral-100 font-medium" : ""
              }`}
              onClick={() => setShowArchived(false)}
            >
              Active
            </button>
            <button
              className={`rounded-md border px-3 py-2 text-sm ${
                showArchived ? "bg-neutral-100 font-medium" : ""
              }`}
              onClick={() => setShowArchived(true)}
            >
              Archived
            </button>
          </div>

          {!showArchived ? (
            <Link className="rounded-md border px-3 py-2 text-sm" href="/skills/new">
              New skill
            </Link>
          ) : null}
        </div>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">Failed to load skills.</p>}

      {!isLoading && data?.length === 0 && (
        <p className="text-neutral-600">
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
