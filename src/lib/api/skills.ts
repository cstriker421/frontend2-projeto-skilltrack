export type Skill = {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: number;
};

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch("/api/skills");
  if (!res.ok) throw new Error("Failed to load skills");
  return res.json();
}

export async function createSkill(input: {
  title: string;
  description?: string;
  level?: Skill["level"];
  progress?: number;
}): Promise<Skill> {
  const res = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create skill");
  return res.json();
}

export async function updateSkill(
  skillId: string,
  patch: Partial<Pick<Skill, "title" | "description" | "level" | "progress">>
): Promise<Skill> {
  const res = await fetch(`/api/skills/${skillId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update skill");
  return res.json();
}

export async function deleteSkill(skillId: string): Promise<void> {
  const res = await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete skill");
}
