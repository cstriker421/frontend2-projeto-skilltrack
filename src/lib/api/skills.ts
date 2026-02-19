export type Skill = {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: number;
  isArchived: boolean;
};

export async function fetchSkills(archived: boolean): Promise<Skill[]> {
  const res = await fetch(`/api/skills?archived=${archived ? "1" : "0"}`);
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
  patch: Partial<Pick<Skill, "title" | "description" | "level" | "progress" | "isArchived">>
): Promise<Skill> {
  const res = await fetch(`/api/skills/${skillId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update skill");
  return res.json();
}

export async function fetchSkill(skillId: string): Promise<Skill> {
  const res = await fetch(`/api/skills/${skillId}`);
  if (!res.ok) throw new Error("Failed to load skill");
  return res.json();
}

// NOTE: this is a soft-delete (archive)
export async function deleteSkill(skillId: string): Promise<void> {
  const res = await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to archive skill");
}

export async function restoreSkill(skillId: string): Promise<Skill> {
  return updateSkill(skillId, { isArchived: false });
}

export async function purgeSkill(skillId: string): Promise<void> {
  const res = await fetch(`/api/skills/${skillId}?hard=1`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to permanently delete skill");
}
