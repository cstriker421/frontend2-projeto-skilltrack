export type Resource = {
  id: string;
  skillId: string;
  title: string;
  url?: string | null;
  type: "ARTICLE" | "VIDEO" | "COURSE" | "BOOK" | "CERTIFICATION";
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};

export async function fetchResources(skillId: string): Promise<Resource[]> {
  const res = await fetch(`/api/skills/${skillId}/resources`);
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

export async function createResource(
  skillId: string,
  input: Pick<Resource, "title" | "url" | "type" | "status">
): Promise<Resource> {
  const res = await fetch(`/api/skills/${skillId}/resources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to create resource");
  return res.json();
}

export async function deleteResource(
  skillId: string,
  resourceId: string
): Promise<void> {
  const res = await fetch(`/api/skills/${skillId}/resources/${resourceId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete resource");
}
