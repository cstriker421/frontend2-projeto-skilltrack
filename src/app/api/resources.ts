export type Resource = {
  id: string;
  skillId: string;
  title: string;
  url?: string | null;
  type: "COURSE" | "BOOK" | "ARTICLE" | "VIDEO" | "CERTIFICATION";
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  notes?: string | null;
};

export async function fetchResources(skillId: string): Promise<Resource[]> {
  const res = await fetch(`/api/resources?skillId=${encodeURIComponent(skillId)}`);
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

export async function createResource(input: {
  skillId: string;
  title: string;
  url?: string;
  type?: Resource["type"];
  status?: Resource["status"];
  notes?: string;
}): Promise<Resource> {
  const res = await fetch("/api/resources", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create resource");
  return res.json();
}

export async function updateResource(
  resourceId: string,
  patch: Partial<Omit<Resource, "id" | "skillId">>
): Promise<Resource> {
  const res = await fetch(`/api/resources/${resourceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update resource");
  return res.json();
}

export async function deleteResource(resourceId: string): Promise<void> {
  const res = await fetch(`/api/resources/${resourceId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete resource");
}
