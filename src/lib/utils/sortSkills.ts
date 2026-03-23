import type { Skill } from "@/lib/api/skills";

// Re-export Skill as SortableSkill so the page only needs one import
export type { Skill as SortableSkill };

export type SortKey =
  | "category-asc"
  | "category-desc"
  | "progress-desc"
  | "progress-asc"
  | "recent"
  | "oldest"
  | "name-asc"
  | "name-desc";

export const LEVEL_RANK: Record<Skill["level"], number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export function sortSkills(skills: Skill[], key: SortKey): Skill[] {
  const copy = [...skills];

  const byRecent = (a: Skill, b: Skill) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

  const byCategory = (a: Skill, b: Skill) =>
    LEVEL_RANK[a.level] - LEVEL_RANK[b.level];

  const byCategoryDesc = (a: Skill, b: Skill) =>
    LEVEL_RANK[b.level] - LEVEL_RANK[a.level];

  const byProgressDesc = (a: Skill, b: Skill) =>
    b.progress - a.progress;

  const byProgressAsc = (a: Skill, b: Skill) =>
    a.progress - b.progress;

  switch (key) {
    case "category-asc":
      return copy.sort((a, b) =>
        byCategory(a, b) || byProgressDesc(a, b) || byRecent(a, b)
      );
    case "category-desc":
      return copy.sort((a, b) =>
        byCategoryDesc(a, b) || byProgressDesc(a, b) || byRecent(a, b)
      );
    case "progress-desc":
      return copy.sort((a, b) =>
        byProgressDesc(a, b) || byCategory(a, b) || byRecent(a, b)
      );
    case "progress-asc":
      return copy.sort((a, b) =>
        byProgressAsc(a, b) || byCategory(a, b) || byRecent(a, b)
      );
    case "recent":
      return copy.sort(byRecent);
    case "oldest":
      return copy.sort((a, b) => -byRecent(a, b));
    case "name-asc":
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title) || byRecent(a, b)
      );
    case "name-desc":
      return copy.sort((a, b) =>
        b.title.localeCompare(a.title) || byRecent(a, b)
      );
    default:
      return copy;
  }
}